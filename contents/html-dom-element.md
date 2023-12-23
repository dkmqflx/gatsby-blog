---
date: '2023-12-23'
title: 'Next 13에서 Testing 환경 설정하기 (Jest, React Testing Library)'
categories: ['Next']
summary: 'Next 13에서 Unit Test를 위한 환경을 설정한 과정을 공유합니다'
---

## 라이브러리 설치

Next 공식문서에서는 여러가지 Testing 라이브러리에 대한 가이드를 제공하고 있습니다.

하지만 테스팅 라이브러리로 jest와 React Testing Library를 사용하기로 결정했기 때문에 [Testing](https://nextjs.org/docs/pages/building-your-application/testing/jest) 페이지의 [Quickstart](https://github.com/vercel/next.js/tree/canary/examples/with-jest) 헝목에 있는 링크의 레포를 참고해서 필요한 라이브러리를 설치해주었습니다.

참고로 next 13 버전에서는 swc를 사용하고 있기 때문에 Babel을 사용하고 있는 이전 버전의 next 환경에서 테스팅 환경을 구축할 때는 공식문서의 [Setting up Jest (with Babel)](https://nextjs.org/docs/pages/building-your-application/testing/jest#setting-up-jest-with-babel) 항목을 참고해서 초기 설정을 다르게 해주어야 합니다.

테스팅에 필요한 기본적인 라이브러리는 다음과 같습니다.

```bash
npm install -D
	@testing-library/jest-dom
	@testing-library/react
	@testing-library/user-event
	@types/jest
	jest
	jest-environment-jsdom
	react-test-renderer # 스냅샷 테스트를 위한 라이브러리

```

라이브러리를 설치한 다음 테스트 코드를 작성하기에 앞서 필요한 라이브러리를 설치하고 추가적으로 설정을 해주어야 합니다.

## [next-router-mock](https://www.npmjs.com/package/next-router-mock)

테스트 하는 컴포넌트가 useRouter를 사용하는 경우에 `nextrouter was not mounted` 라는 에러 메세지가 나타나는데요, 이러한 에러를 해결하기 위해서는 router 관련된 부분을 mocking 해주어야 합니다.

공식문서의 **[NextRouter was not mounted](https://nextjs.org/docs/messages/next-router-not-mounted)** 항목을 보면 [next-router-mock](https://www.npmjs.com/package/next-router-mock)를 Useful Links로 걸어놓았기 때문에 해당 라이브러리를 설치해서 mocking 해주었습니다.

```bash
$ npm install -D next-router-mock
```

라이브러리 설치후 `jest.setup.ts` 파일에 아래 코드를 추가해주면 됩니다.

```tsx
// jest.setup.ts

jest.mock('next/router', () => require('next-router-mock'))
```

## [Jest Styled Components](https://github.com/styled-components/jest-styled-components#jest-styled-components)

추가적으로 Styled Components를 스타일링을 위한 라이브러리로 사용하고 있었기 때문에 스냅샷 테스트를 할 때 유용하게 사용할 수 있는 유틸 함수를 제공하는 jest styled componenets도 함께 설치해주었습니다.

```bash
npm -i -D jest-styled-components
```

라이브러리 설치 후 각각의 테스트가 실행되기 전에 configuration이 적용되도록 `setupFilesAfterEnv`에 추가해줍니다

```jsx
// jest.config.js

setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', 'jest-styled-components'],
```

<br/>

## 타입스크립트로 테스트를 작성하는 방법

지금까지는 테스트를 작성하는데 필요한 라이브러리를 설치하는 과정이였는데요

해당 라이브러리를 모두 설치한 다음 `"컴포넌트이름".test.tsx` 와 같이 타입스크립트 확장자를 가진 파일에서 테스트를 작성하게 되면 아래와 같이 matcher를 찾지 못한다는 에러가 나타나게 됩니다.

이러한 에러를 해결하기 위해서는 `jest.setup.ts`와 같이 setup 파일의 확장자를 `.ts`로 수정한 다음 아래처럼 jest-dom을 추가 해주어야 합니다.

```tsx
// TS: Property 'toBeInTheDocument' does not exist on type 'Assertion'.

import '@testing-library/jest-dom'
```

jest-dom github의 [With TypeScript](https://github.com/testing-library/jest-dom#with-typescript) 항목에서 위 문제를 해결하는 방법을 찾을 수 있습니다.

### `.env.test` 환경변수 추가하기

기존에 사용하던 환경변수를 테스팅 환경에서도 사용하기 위해서는 `.env.test` 라는 이름의 **env** 파일을 추가해주어야 합니다.

```tsx
"scripts": {
	"test": "jest --watch",
  "test:coverage": "jest --watch --coverage"
}
```

### jest.setup.ts, jest.config.js

지금까지의 과정을 거쳐 완성된 setup과 config 파일을 다음과 같습니다

기본적으로 [Next.js with Jest and React Testing Library](https://github.com/vercel/next.js/tree/canary/examples/with-jest) 레포에 있는 설정을 참고하였고 필요한 설정을 추가해주었습니다.

```tsx
// jest.setup.ts

import '@testing-library/jest-dom'

jest.mock('next/router', () => require('next-router-mock'))
```

```jsx
// jest.config.js

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', 'jest-styled-components'],
  testEnvironment: 'jest-environment-jsdom',
  clearMocks: true,
  coverageDirectory: 'coverage',

  moduleDirectories: ['node_modules', 'src'],
  // src를 추가해야지 절대 경로로 정의된 파일 찾을 수 있음.
}

module.exports = createJestConfig(customJestConfig)
```

<br/>

## Providers

테스트를 작성하다 보면 공통적으로 사용해야 하는 Provider가 있습니다.

대표적으로 스타일링을 위한 styled component의 Theme Provider, 그리고 서버 상태를 관리하는데 사용하는 React Query의 QueryClientProvider가 있습니다

테스트 코드에 스타일 또는 비동기 처리를 위한 코드가 있다면 위의 Provider로 감싸주어야 합니다.

이 때 반복되는 코드 작성을 줄이고 필요한 테스트에서 쉽게 가져다 사용할 수 있도록 Provider를 미리 정의해줍니다.

```tsx
// __test__/providers/themeProvider.tsx

import { ThemeProvider } from 'styled-components'
import styledTheme from 'theme/styledTheme'

export const TestThemeProvider = ({
  children,
}: React.PropsWithChildren<{}>) => (
  <ThemeProvider theme={styledTheme}>{children}</ThemeProvider>
)
```

```tsx
// __test__/providers/reactQueryProvider.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const testQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
  })
}

export const TestQueryClientProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const testClient = testQueryClient()

  return (
    <QueryClientProvider client={testClient}>{children}</QueryClientProvider>
  )
}
```

아래 코드는 위에서 정의한 Theme Provider를 적용해서 테스트 코드를 작성한 예시입니다.

```tsx
import { render } from '@testing-library/react'
import { TestThemeProvider } from '@common/__test__/providers'
import Add from './index'

describe('List', () => {
  it('img 태그 확인', () => {
    render(
      <TestThemeProvider>
        <img src='./images/title.png' alt='title'/>)
      </TestThemeProvider>,
    )
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

```

만약 Theme Provider로 감싸주지 않으고 테스트를 실행하게 되면 아래의 theme을 찾을 수 없다는 에러가 나타나게 됩니다.

```tsx
export const Text = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.blueGray[500]};
  text-align: center;
`
```

## 마치며

단위테스트와 통합 테스트를 위한 라이브러리들을 설치하고 환경을 구성해 주었는데요.

이 과정에서 테스트가 실패하거나 에러가 발생하는 어려움이 있었고 환경 설정하는 과정이 쉽지만은 않다는 것을 다시 한번 느끼게 되었습니다.

하지만 테스트 환경을 설정하기 위한 전체적인 과정을 경험할 수 있었고 이번 경험을 바탕으로 추가적인 설정이 필요할 때도 자신감을 갖고 작업을 할 수 있을 것 같습니다.
