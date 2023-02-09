---
date: '2021-02-13'
title: 'React 렌더링 과정과 최적화 이해하기'
categories: ['React']
summary: 'React의 render phase와 commit phase 그리고 최적화 방법에 대해 설명한 글입니다.'
---

## JSX

리액트 렌더링 과정을 이해하기 위해서는 우선 JSX 문법에 대한 이해가 필요합니다. <br/>
JSX는 JavaScript를 확장한 문법으로 JSX로 작성한 코드는 React.createElement를 실행해서 객체를 생성됩니다.
아래처럼 리액트에서 JSX로 작성한 코드를 통해 이를 확인할 수 있습니다.

```js
const element = <h1 className="hello">Hello, world</h1>
```

<br/>

이렇게 작성한 코드를 babel로 통해 컴파일 해보면 아래처럼 React.createElement 함수가 실행되고, 인자로 HTML 태그 이름, class 이름이 포함된 객체, 그리고 children이 전달되는 것을 확인할 수 있습니다.

```js
const element = React.createElement(
  'h1',
  {
    className: 'hello',
  },
  'Hello, world',
)
```

<br/>

그리고 React.createElement의 결과 값은 아래와 같은 객체가 되는데 이 객체가 바로 React Element 입니다.

```js
const element = {
  type: 'h1',
  props: {
    className: 'hello',
    children: 'Hello, world!',
  },
}
```

JSX가 React Element가 되는 일련의 과정을 통해서 JSX 문법을 사용하면 React.createElement 함수를 사용해서 코드를 작성할 필요 없이 간단하게 코드를 작성할 수 있는 것을 알 수 있습니다. 즉, JSX로 코드를 작성하게 되면 React.createElement가 실행되고 그 return 값이 바로 React Element 입니다.

이 때, React Element는 JavaScript 객체로서 UI 구조를 나타냅니다.

추가적으로 JSX의 또 다른 장점으로는 Injection Attacks로부터 안전하다는 것입니다. 사용자 정보와 같은 민감한 정보를 탈취하기 위해서 자바스크립트 코드를 삽입할 수 있는데 JSX는 렌더링하기 전에 모든 자바스크립트 코드를 string으로 escape 해주기 때문에 자바스크립트 코드로 실행이 되지 않아 이러한 공격으로 부터 안전하다는 장점이 있습니다.

<br/>

---

## Rendering in React

앞서 확인한 것처럼 우리가 JSX 문법으로 작성한 리액트 코드는 React Element로 변환이 됩니다. 그리고 이렇게 변환된 React Element를 DOM에 추가하는 것을 Mounting이라고 하는데 이러한 과정을 총 2단계로 나눌 수 있습니다.

1. Render Phase : 컴포넌트를 렌더링하고 변경사항을 계산하는 과정
2. Commit Phase : DOM에 변경사항을 적용하는 과정

그리고 각 단계는 리액트가 처음 렌더링되는지, 또는 다시 렌더링되는지에 따라 차이점이 있습니다.

### Initial Render

**1. Render Phase**

1. 리액트는 컴포넌트 트리의 가장 상단에 위치한 Root 컴포넌트에서 시작해서 Leaf 컴포넌트까지 내려갑니다.
2. 이 때 리액트는 JSX로 작성된 코드를 createElement 메소드를 실행해서 React Element로 변환시켜준 다음 Render Output을 저장합니다.
3. 전체 컴포넌트 트리에 대해서 이 과정이 끝나고 나면 모든 변환된 모든 React Element는 Commit Phase로 전달됩니다.

**2. Commit Phase**

React Element들이 react-dom 패키지에 의해 DOM에 추가되는 단계입니다.

<br/>

ReactDOM.render 함수가 실행되는 과정을 통해 Render Phase와 Commit Phase 과정을 다음과 같이 요약할 수 있습니다.

```jsx
ReactDOM.render(App, document.getElementById('root'))
```

1. ReactDOM의 Render 함수에 전달되는 arguments는 두가지로 React Element와 브라우저 DOM Element 입니다.
2. ReactDOM.Render 함수가 실행되면 우선 최상위 컴포넌트 부터 시작해서 React element가 만들어집니다. (**Render Phase**)
3. 이렇게 만들어진 React element가 DOM element에 소속되고 이렇게 DOM element로 인식된 React element가 브라우저에 의해 렌더링됩니다. (**Commit Phase**)

<br/>

### Re Render

**1. Render Phase**

1. 리액트는 컴포넌트 트리의 가장 상단에 위치한 Root 컴포넌트에서 시작해서 Leaf 컴포넌트까지 내려갑니다.
2. 이 때 모든 업데이트가 필요한 컴포넌트(Flagged 컴포넌트)들을 찾고 Flagged 컴포넌트와 Flagged 컴포넌트에 영향을 받는 모든 컴포넌트들에 대해서 createElement를 실행해서 React Elements로 변환시켜준 다음 Render Output을 저장합니다.
3. 모든 Flagged 컴포넌트에 대해 이 과정이 끝나고 나면 리액트는 이전에 렌더링된 React Elements(Virtual DOM)과 새롭게 렌더링된 React Elements(Virtual DOM)을 비교해줍니다. 이 과정을 재조정(Reconciliation)이라고 합니다.
4. 그리고 나서 실제 DOM에 반영되어야 하는 모든 변경사항들을 Commit Phase로 전달됩니다. 여기서 중요한 것은 이전에 렌더링된 React Elements와 새롭게 렌더링된 React Elements를 비교해서 변경사항이 없다면 Commit phase로 넘어가지 않고 어떠한 변화도 DOM에 적용되지 않습니다.

**2. Commit Phase**

재조정 과정에서 찾은 Virtual DOM의 서로 다른 부분들이 실제 DOM에 반영됩니다.

<br/>

여기서 중요한 것은 렌더링과 DOM을 업데이트하는 것이 다르다는 것입니다. 리액트 렌더링 과정을 거치더라도 이전에 렌더링 된 React Elements와 새롭게 렌더링된 React Elements가 같다면 실제 DOM은 업데이트 되지 않기 때문에 컴포넌트는 DOM을 업데이트 하지 않고도 렌더링 될 수 있기 때문입니다.

<br/>

---

## Rendering 최적화

아래는 First 컴포넌트에서 Count 버튼을 클릭하면 count 값이 증가하고 변경된 count 값을 Second 컴포넌트에서 보여주는 코드입니다.

```js
// Parent.js

import { useState } from 'react'
import First from '../src/First'
import Second from '../src/Second'

export default function Parent() {
  const [count, setCount] = useState(0)

  const onClick = () => {
    setCount(count => count + 1)
  }

  return (
    <div>
      <First onClick={onClick} />
      <Second count={count} />
    </div>
  )
}
```

```js
// Fist.js

const First = ({ onClick }) => {
  console.log('Render First')
  return (
    <div>
      <button onClick={onClick}>Count</button>
    </div>
  )
}

export default First
```

```js
// Second.js

const Second = ({ count }) => {
  console.log('Render Second')

  return <div>count{count}</div>
}

export default Second
```

이 때 count 값이 증가할 때 마다 `Render First`, `Render Second`가 출력되는 것을 확인할 수 있는데, 그 이유는 state인 count 값이 변경됨에 따라 Parent 컴포넌트가 다시 렌더링 되면서 onClick 함수가 다시 정의되고 그 결과 First 컴포넌트로 전달되는 props 또한 변경되기 때문입니다.

이러한 문제를 해결하기 위해 메모이징 된 콜백을 반환하는 `useCallback` 함수를 사용할 할 수 있습니다. `useCallback`으로 함수를 감싸주고 dependancy로 빈 배열을 전달해주게 되면 onClick 함수는 처음 컴포넌트가 렌더링 될 때만 정의가 되고 state값이 변경되더라도 다시 정의가 되지 않습니다.

```js
// Parent.js

import { useCallback, useState } from 'react'
import First from '../src/First'
import Second from '../src/Second'

export default function Parent() {
  const [count, setCount] = useState(0)

  const onClick = useCallback(() => {
    setCount(count => count + 1)
  }, [])

  return (
    <div>
      <First onClick={onClick} />
      <Second count={count} />
    </div>
  )
}
```

<br/>

하지만 이렇게 `useCallback`을 onClick 함수를 감싸서 같은 props를 전달해주더라도 count 값이 증가할 때 마다 `Render First`, `Render Second`가 출력됩니다.
그 이유는 Babel로 컴파일한 아래 코드를 통해 확인할 수 있습니다.

```js
// Parent.js

import { useCallback, useState } from 'react'
import First from '../src/First'
import Second from '../src/Second'

export default function Parent() {
  const [count, setCount] = useState(0)

  const onClick = useCallback(() => {
    setCount(count => count + 1)
  }, [])

  return React.createElement(
    'div',
    null,
    React.createElement(First, {
      onClick: onClick,
    }),
    React.createElement(Second, {
      count: count,
    }),
  )
}
```

위 코드를 보면 First 컴포넌트와 Second 컴포넌트에 해당하는 React.CrateElement가 존재합니다. 따라서 count가 변경됨에 따라 Parent 컴포넌트가 리렌더링 되면 return문 안에 있는 React.CreateElement들이 모두 실행되고 그 결과 First 컴포넌트에 해당하는 React.createElement가 실행 됩니다. <br/>
따라서 `useCallback`으로 함수를 감싸 같은 props를 전달해주더라도 이에 상관없이 First 컴포넌트는 리렌더링이 일어날 수 밖에 없습니다.

리렌더링이 일어날 때 Render Phase는 일어나지만 Commit Phase는 발생하지 않습니다. 같은 props로 값을 전달해서 이전에 렌더링된 React Elements와 새롭게 렌더링된 React Elements을 비교했을 때 변경된 점이 없기 때문입니다. Commit Phase는 발생하지 않는다는 점에서 어느 정도 렌더링 최적화가 되었다고 할 수 있습니다.

이 때 Render Phase도 일어나지 않게 하기 위해서 사용할 수 있는 것이 `React.memo`입니다. `React.memo`는 고차 컴포넌트(Higher Order Component)로 `React.memo`로, 컴포넌트를 감싸주게 되면 해당 컴포넌트로 전달되는 props가 변경되는 경우에만 컴포넌트가 렌더링 됩니다. 즉, React는 `React.memo`로 컴퍼넌트를 렌더링하고 결과를 메모이징(Memoizing)한 다음, 다시 렌더링이 일어날 때 props가 같다면 마지막으로 렌더링 된 결과를 재사용합니다.

따라서 아래와 같인 First 컴포넌트 수정해주면 count 값이 증가하더라도 더 이상 `Render First`는 출력되지 않고 `Render Second`만 출력이 됩니다.

```js
// First.js

import { memo } from 'react'

const First = memo(({ onClick }) => {
  console.log('Render First')
  return (
    <div>
      <button onClick={onClick}>Count</button>
    </div>
  )
})

export default First
```

<br/>

---

## 최적화 함수 사용하기 전에 코드 개선하기

`React.memo` 또는 `useCallback`, `useMemo`를 사용해서 불필요하게 렌더링이 일어나는 것을 막고 최적화를 할 수 있습니다. 하지만 이렇게 최적화를 위한 코드를 작성하게 되면 내부적으로 특정한 동작을 실행해주어야 하기 때문에 비용이 발생하게 됩니다. 따라서 최적화를 위한 방법을 사용하지 않고도 불필요한 렌더링일 발생하지 않도록 근본적으로 코드를 개선할 수 있습니다.

아래는 Click 버튼을 클릭하면 state인 count가 증가하는 코드로, count 값이 변경되어 부모 컴포넌트인 Parent 컴포넌트가 렌더링 될 때 마다 자식 컴포넌트인 First 컴포넌트도 다시 렌더링 되는 코드입니다.

```js
// Parent.js

import { useState } from 'react'
import First from '../src/First'

export default function Parent() {
  const [count, setCount] = useState(0)

  const onClick = () => {
    setCount(count => count + 1)
  }

  return (
    <div>
      <div>{count}</div>
      <button onClick={onClick}>Click</button>
      <First></First>
    </div>
  )
}
```

<br/>

Click 버튼을 클릭할 때 마다 `Render First` 출력되는 것을 확인할 수 있습니다.

```js
// First.js
const First = () => {
  console.log('Render First')
  return <div>First</div>
}

export default First
```

<br/>

`React.memo`를 사용해서 컴포넌트를 감싸주면 더 이상 `Render First`가 출력되지 않습니다.
하지만 근본적인 코드를 개선함으로써 `React.memo`를 사용하지 않고도 자식 컴포넌트가 렌더링 되는 것을 막을 수 있습니다.

```js
// First.js
import { memo } from 'react'

const First = memo(() => {
  console.log('Render First')
  return <div>First</div>
})

export default First
```

<br/>

이전에는 Parent 컴포넌트 내부에서 First 컴포넌트를 불러와서 사용했다면, 아래처럼 Parent 컴포넌트에 children props 전달받도록 코드를 수정해준 다음, 외부에서 Parent 컴포넌트의 children props로 First 컴포넌트를 전달해줍니다.

```js
// App.js
import { useState } from 'react'
import First from '../src/First'
import Second from '../src/Second'
import Parent from '../src/Parent'

export default function App() {
  return (
    <Parent>
      <First />
    </Parent>
  )
}
```

```js
// Parent.js
import { useState } from 'react'

// children props 전달받는다.
export default function Parent({ children }) {
  const [count, setCount] = useState(0)

  const onClick = () => {
    setCount(count => count + 1)
  }

  return (
    <div>
      <div>{count}</div>
      <button onClick={onClick}>Click</button>
      {children}
    </div>
  )
}
```

```js
// First.js

// React.memo 제거
const First = () => {
  console.log('Render First')
  return <div>First</div>
}

export default First
```

<br/>

이렇게 코드를 수정해주게 되면 더 이상 Click 버튼을 클릭할 때 마다 `Render First` 출력되지 않습니다.
그 이유는 Parent 컴포넌트를 Babel로 컴파일 해보면 확인할 수 있습니다.

```js
// Parent.js
import { useState } from 'react'

export default function Parent({ children }) {
  const [count, setCount] = useState(0)

  const onClick = () => {
    setCount(count => count + 1)
  }

  return React.createElement(
    'div',
    null,
    React.createElement('div', null, count),
    React.createElement(
      'button',
      {
        onClick: onClick,
      },
      'Click',
    ),
    children,
  )
}
```

return 부분을 보면 children이 있는 것을 확인할 수 있습니다. 만약 이전처럼 Parent 컴포넌트 내부에서 First 컴포넌트를 불러와서 사용했다면 Parent 컴포넌트가 렌더링될 때 마다
First 컴포넌트에 대한 React.createElement가 실행되어 컴포넌트가 렌더링이 되었겠지만 이렇게 children을 props로 전달받게 되면 First 컴포넌트가 리렌더링 되더라도 children props로 전달받은 First 컴포넌트가 렌더링되는 것을 막을 수 있습니다.

이처럼 리액트에서 제공하는 `React.memo` 또는 `useCallback`, `useMemo`를 사용해서 최적화를 할 수 있지만 그 전에 코드를 개선함으로써 추가적인 코드를 작성할 필요 없이 최적화를 해줄 수 있습니다.
