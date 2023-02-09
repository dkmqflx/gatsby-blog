---
date: '2022-01-04'
title: 'React useState에서 Lazy initialization 사용하기'
categories: ['React']
summary: 'React useState의 Lazy initialization에 대해 정리한 글입니다.'
---

## React Lazy initialization

useState의 타입을 확인할수 있는 index.d.ts 파일을 보면 initialState로 값을 바로 전달하는 것 이외에도 함수를 통해 값을 전달할 수 있는 것을 확인할 수 있습니다.

```ts
function useState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>]
```

아래 코드에는 Counter 버튼을 클릭해서 count 값을 증가시키는 코드로, value의 useState 인자로 굉장히 복잡한 작업을 하는 ComplexWork라는 이름의 함수가 실행되어 inistialState로 값을 전달(`initialState: S`) 합니다. Counter 버튼을 클릭해 보면 state 값의 변화로 인해 컴포넌트가 다시 렌더링 될 때 마다 마다 ComplexWork 함수가 실행되어 `ComplexWork`가 출력되는 것을 확인할 수 있습니다.
즉, 컴포넌트가 리렌더링 될 때마다 inistialState의 인자로 전달되는 인자가 초기화 되기 때문에 함수가 실행되는 것입니다.

```js
function App() {
  const ComplexWork = () => {
    console.log('ComplexWork')
    return 1
  }

  const [value, setValue] = useState(ComplexWork())
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>{`current Count : ${count}`}</div>
      <button onClick={() => setCount(count + 1)}>Counter</button>
    </div>
  )
}
```

이러한 문제를 해결할 수 있는 방법이 바로 함수를 통해 initialState 값을 전달하는 것입니다.

```js
function App() {
  const ComplexWork = () => {
    console.log('ComplexWork')
    return 1
  }

  const [value, setValue] = useState(() => heavyWork())
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>{`current Count : ${count}`}</div>
      <button onClick={() => setCount(count + 1)}>Counter</button>
    </div>
  )
}
```

initialState를 반환하는 heavyWork 함수를 useState의 인자로 함수를 통해 실행되도록 전달한 다음 Counter 버튼을 클릭하면 `ComplexWork`가 더 이상 출력되는 않는 것을 확인할 수 있습니다. 즉, 함수가 아닌 값을 전달할 때 처럼 딱 한번만 초기화가 되는 것을 확인할 수 있습니다.
