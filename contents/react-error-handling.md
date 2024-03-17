---
date: '2024-03-17'
title: 'React Query에서 에러 핸들링을 하는 방법'
categories: ['React']
summary: 'React Query를 사용해서 비동기 처리를 할 때 에러 핸들링을 하는 방법에 대해 정리한 글입니다.'
---

- React Query를 사용해서 비동기 처리를 하고 있는 경우, 다음과 같은 방법으로 에러를 처리할 수 있습니다.

1. useQuery의 onError 콜백 함수 전달

2. 컴포넌트 내부에서 조건문을 통해서 처리

### useQuery의 onError 콜백 함수 전달

- React Query v5 부터는 onError로 콜백함수를 전달하는 방식을 지원하지 않기 때문에 더 이상 사용할 수 없는 방식입니다.

- V5로 마이그레이션 하는 경우를 대비해서 이러한 방법을 더 이상 사용하지 않고 기존에 작성된 코드도 수정할 필요가 있습니다.

### 컴포넌트 내부에서 조건문을 통해서 처리

- 컴포넌트 내부의 조건문을 사용해서 처리하게 되면 로딩, 성공, 실패에 대한 처리가 모두 한 컴포넌트에서 작성되기 때문에 관심사가 분리되지 않는 문제가 있습니다.

- 그리고 API 호출을 하는 컴포넌트 내부에서만 로딩, 실패에 대한 처리를 해줄 수 있기 때문에 외부로 위임을 할 수 없습니다.

```tsx
const { firstError } = useGetFirst()
const { secondError } = useGetSecond()

if (firstError || secondError) { ... }

```

<br/>

이러한 문제는 두가지 방식을 통해서 해결할 수 있습니다.

1. Error Boundary에서 처리하는 방법

2. QueryClient 에서 전역적으로 처리하는 방법

---

### Error Boundary에서 관리하는 방법

- `react-error-boundary` 라이브러리의 ErrorBoundary를 사용해서 선언적으로 에러 처리를 할 컴포넌트를 감싸줍니다.

- 이 때 FallbackComponent props에 정의한 FallbackComponent를 전달해줍니다

  ```tsx
  import React from 'react'

  import { QueryErrorResetBoundary } from '@tanstack/react-query'
  // QueryErrorResetBoundary는 reset 시, query를 다시 fetch 하기 위해 사용합니다.
  import { ErrorBoundary } from 'react-error-boundary'

  import First from './First'
  import Second from './Second'

  const Fallback = ({ error, resetErrorBoundary }) => {
    return (
      <div role="alert" className="error">
        <h1>Error,</h1>
        <button type="button" onClick={resetErrorBoundary}>
          Reset Error
        </button>
      </div>
    )
  }

  const Test = () => {
    return (
      <div>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={Fallback} onReset={reset}>
              <First />
              <Second />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </div>
    )
  }

  export default Test
  ```

  - 서비스를 사용하다 보며 사전에 정의할 수 없는 에러가 발생할 수 있습니다.

  - 예를들어 500번대의 서버가 예상하지 못한 에러가 발생할 수 있는데 이러한 경우에 Error Boundary를 사용해서 에러를 처리할 수 있습니다.

  - 예를들어 에러 발생시 fallback으로 나타나는 페이지가 보이게 되고, 해당 페이지에서 “새로고침” 버튼을 통해 상태를 Reset 하고

  - 3번 이상 새로고침 버튼을 클릭해도 에러가 발생하면 home 화면으로 이동해야 한다면 아래와 같은 Error Boundary 컴포넌트를 만들고, 필요한 컴포넌트를 children으로 전달해줍니다.

  ```tsx
  // src/commons/components/ErrorBoundary/GlobalErrorBoundary.tsx

  export const GlobalErrorBoundary = ({
    children,
  }: React.PropsWithChildren<{}>) => {
    const resetClickCount = React.useRef(0)

    const handleReset = (reset: () => void) => {
      resetClickCount.current += 1

      if (resetClickCount.current > ERROR_RESET_TRY_MAX_COUNT) {
        window.location.href = '/'
        return
      }

      reset()
    }

    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            FallbackComponent={FallBack}
            onReset={() => {
              handleReset(reset)
            }}
          >
            {children}
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    )
  }
  ```

- 이때, useQuery로 호출하는 API를 Error Boundary로 전달하기 위해서는 useErrorBoundary 옵션을 true로 설정을 해주어야 합니다.

  ```tsx
  export function useTodos() {
    return useQuery({
      queryKey: ['todos', 'list'],
      queryFn: fetchTodos,
      useErrorBoundary: true,
    })
  }
  ```

- 그렇기 때문에 QueryClient에서 500이상의 정의되지 않은 서버 에러에 대해서만 true를 반환하도록 해줍니다.

```tsx
const [queryClient] = React.useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          useErrorBoundary: error => {
            if (error.response.status >= 500) {
              return true
            }
          },
        },
      },
    }),
)
```

### React Query의 QueryClient를 사용해서 전역적으로 처리하는 에러인 경우

- React Query v5부터는 onError 콜백 함수가 사라지게 됩니다.

- 따라서 해당 Query에 대한 에러를 전역적으로 처리하게 되는데 이 때 사용할 수 있는게 meta객체 입니다.

- 아래와 같이 meta 객체에 전달하고자 하는 값을 선언해줍니다.

```tsx
export function useGetData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: getDataFn,
    meta: {
      message: 'Failed to get data',
      callback: handleError, // 에러 발생시 사용자가 실행할 수 있는 callback 함수
    },
  })
}
```

- React Query의 QueryClient에 onError 콜백 함수를 등록해줍니다.

```tsx
const [queryClient] = React.useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          useErrorBoundary: error => {
            const 에러바운더리_처리_조건 =
              !error.response.data.code && error.response.status >= 500
            if (error.response.status >= 500) {
              return true
            }
          },
        },
      },

      queryCache: new QueryCache({
        onError: (error, query) => {
          if (query.meta.message) {
            modal.open(message, handleError)
            // error handler 함수를 등록합니다.
            // toast 또는 Modal을 전역적으로 실행시키는 로직을 작성합니다.
          }
        },
      }),
    }),
)
```

- 전역적으로 등록된 토스트 컴포넌트를 통해 에러 메세지를 보여주거나, 전역적으로 등록된 모달을 통해 에러가 발생했을 때 사용자의 액션을 유도하고 싶을 때 이러한 방법을 유용하게 사용할 수 있습니다.

- 그렇기 때문에 Error Boundary를 사용할 때와 달리 사전에 정의한 에러를 처리할 때 유용하게 에러 핸들링을 할 수 있습니다.
