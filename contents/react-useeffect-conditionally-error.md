---
date: '2021-05-13'
title: 'React Hook "useEffect" is called conditionally... 에러를 헤결하는 방법'
categories: ['React']
summary: 'React Hooks must be called in the exact same order in every component render. 에러가 발생한 경우 해결하는 방법 대해 정리한 내용입니다'
---

아래는 useEffect와 useRef를 사용한 커스텀 hook으로 유저가 정의한 함수를 event listenr에 등록해주는 코드입니다.

```js
// app.js

import useClick from './useClick/useClick'

function App() {
  const sayHello = () => console.log('say Hello')
  const elmentRef = useClick(sayHello)

  return (
    <div className="App">
      <h1 ref={elmentRef}>title</h1>
    </div>
  )
}

export default App
```

```js
// useClick

import { useEffect, useRef } from 'react'

const useClick = onClick => {
  if (typeof onClick !== 'function') {
    return
  }

  const element = useRef()
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener('click', onClick)
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener('click', onClick)
      }
    }
    // 새로운 함수 사용하면 새로 해당 ref에 함수 등록
  }, [onClick])

  return element
}

export default useClick
```

하지만 코드를 실행하면 다음과 같은 에러가 발생합니다.

<blockquote>

<p>
    Line 9:21:  React Hook "useRef" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?     react-hooks/rules-of-hooks

</p>

<p>
    Line 10:5:  React Hook "useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?  react-hooks/rules-of-hooks
</p>

</blockquote>

이러한 에러가 발생하는 이유는 공식문서에서 [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)을 보면 알 수 있습니다.

공식 문서에서는 **Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function, before any early returns.** 라고 되어 있는데 즉, hook은 문서의 최상단에 어떠한 값이 return 되기 전에 정의되어야 하기 때문에 이전 코드처럼 hook을 사용하기 전에 조건문으로 return 하는 코드가 있으면 에러가 발생하게 되는 것입니다.

따라서 다음과 같이 조건문 앞으로 useEffect 위치를 수정하는 방식으로 코드를 수정해서 문제를 해결할 수 있습니다.

```js
import { useEffect, useRef } from 'react'

const useClick = onClick => {
  const element = useRef()
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener('click', onClick)
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener('click', onClick)
      }
    }
  }, [onClick])

  if (typeof onClick !== 'function') {
    return
  }

  return element
}

export default useClick
```

`useClick`에 함수가 전달되지 않으면 useRef가 전달되지 않기 때문에 `useRef`로 다른 객체를 참조할 수 없습니다. 따라서 useEffect가 나중에 실행될 때 `element.current`는 `undefined`가 되므로 event가 등록되지 않게 됩니다.
