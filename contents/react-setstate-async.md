---
date: '2021-04-28'
title: 'React의 setState를 비동기 함수 안에서 사용하면 일어나는 일'
categories: ['React']
summary: 'React의 setState를 비동기 함수 안에서 사용하면 일어나는 일에 대해 정리한 글입니다.'
---

- React에서 `setState`는 비동기적으로 작동합니다.

- 여기서 비동기적이란, `setState`가 실행되는 즉시 렌더링이 일어나는 것이 아니라, 렌더링이 이전에 `setState`가 실행됨으로써 변경된 `state`들이 한번에 처리된다는 것입니다.

- 즉, 여러개의 `state`에 관한 `setState`가 있는 경우, 각각의 `setState`가 실행될 때 마다 렌더링이 일어나는 것이아니라, 모든 `state`의 변경된 상태를 한번의 렌더링으로 처리해줍니다.

- 아래 코드를 실행시켜 보면 이를 확인할 수 있습니다.

```jsx
import { useState } from 'react'

export default function App() {
  const [state1, setState1] = useState(1)
  const [state2, setState2] = useState(2)

  const onChange = () => {
    setState1(state1 + 1)
    console.log('state1')

    setState2(state2 + 2)
    console.log('state2')
  }
  console.log('render')
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={onChange}>Click</button>
      <span>{state1}</span>
      <span>{state2}</span>
    </div>
  )
}
```

- 이 코드는 button을 클릭하면 `setState1`과 `setState1`가 실행되어 `state1` 과 `state2`가 변하는 부분이 구현되어 있습니다.

- 코드를 실행해보면, 컴포넌트가 마운트되어 실행되기 때문에 콘솔창에 `render`가 출력됩니다.

- 그리고 나서 버튼을 클릭하면서 콘솔창을 확인해보면 `state1`, `state2`, `render`순으로 출력되는 것을 확인할 수 있습니다

- 만약 `setState`가 실행되어 `state`가 바뀔 때 마다 렌더링이 일어난다면, 콘솔창에서는 `state1`,`render`, `state2`, `render` 순으로 출력되었겠지만, `state1`, `state2`, `render`순으로 출력되는 것을 통해 `setState`는 비동기적으로 렌더링 될 때 모든 `state` 를 한번에 처리해준다는 것을 알 수 있습니다.

- 하지만 아래 코드를 실행하고 콘솔창을 확인해보면 이전코드와는 다르게 작동하는 것을 확인할 수 있습니다.

```jsx
import { useEffect, useState } from 'react'
export default function App() {
  const [state1, setState1] = useState(1)
  const [state2, setState2] = useState(2)

  const getData = async () => {
    const url = await fetch('https://type.fit/api/quotes')
    const result = await url.json()
    setState1(result[0].text)
    console.log('setState1')

    setState2(result[1].text)
    console.log('setState2')
  }

  useEffect(() => {
    console.log('useEffect')
    getData()
  }, [])
  console.log('render')
  return (
    <div className="App">
      <button onClick={onChange}>Click</button>
      <span>{state1}</span>
      <span>{state2}</span>
    </div>
  )
}
```

- 코드를 실행시키고 콘솔창을 확인해보면, `render , useEffect , render , setState1 , render, setState2` 순으로 출력됩니다.

- 앞에서 배운 내용대로라면 `setState`를 통해 `state`가 변경되더라도 비동기적으로 렌더링 되기 전에 한번에 모든 `state`를 변경된 상태를 반영해서 렌더링해주어야 합니다.

- 따라서 `render , useEffect , setState1 setState2, render` 가 출력되는 것으로 기대하였지만 이 코드에서는 `setState`가 실행될 때 마다 렌더링을 진행하고 있다는 것을 볼 수 있습니ㅏㄷ.

- 이러한 원인을 이해하기 위해서는 우선 앞서 설명한 state가 리엑트에서 처리되는 작동 방식을 조금 더 자세히 이해해야 할 필요가 있습니다..

- 현재 React에서는 앞서 말한 것 처럼 비동기적으로 state를 일괄처리 해준다. 이를 batch update 라고 하는데, 이러한 batch update는 setState가 React-based 이벤트 내에서 발생했을 때만 일어납니다

- 여기서 React-based 이벤트는, onClick, onChange 등과 같이 리엑트에서 지원하는 이벤트 핸들러를 말합니다.

- 따라서 [리액트 이벤트 핸들러](https://ko.reactjs.org/docs/handling-events.html)가 아닌, setTimeout 이나 Promise와 같은 것들 안에서 `setState`가 실행되면 batch update 로 일괄처리 되는 것이 아니라 `setState`가 실행될 때 마다 렌더링이 됩니ㅏㄷ.

- 다시 코드를 보면 useEffect의 dependancy로 빈 배열이 전달되었기 때문에 처음 컴포넌트가 Mount 될 때만 useEffect가 실행되고, `async await` 부분 때문에 `setState1`이 실행되면 렌더링이, `setState2`가 실행되면 또 렌더링이 되기 때문에 `render , useEffect , render , setState1 , render, setState2` 순으로 출력됩니다..

- 따라서, 리액트를 사용하다보면 useEffect 안에서 `async, await`와 함께 fetch나 axios를 사용해서 데이터를 불러오는 방식으로 구현을 많이하게 되는데, 이 때 여러개의 `setState`를 사용하는 것이아니라 아래처럼 하나의 `setState` 안에 객체를 통해 필요한 데이터를 한번에 얻는 것이 더 나은 방법입니다.

```jsx
const [data, setData] = useState({})

const getData = async () => {
  const url = await fetch('https://type.fit/api/quotes')
  const result = await url.json()

  setProjData({
    data1: result.data1,
    dtaa2: result.data2,
    data3: result.data3,
  })
}

useEffect(() => {
  getData()
}, [])
```

---

## Reference

- [Understanding React.js Part 2 - Batched Updates](https://gaopinghuang0.github.io/2020/12/21/react-batched-update)
- [Simplifying state management in React apps with batched updates](https://blog.logrocket.com/simplifying-state-management-in-react-apps-with-batched-updates/)
- [Batching update in react-hooks #14259](https://github.com/facebook/react/issues/14259)
