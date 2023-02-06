---
date: '2021-05-16'
title: 'React.memo와 useState의 함수형 업데이트를 사용한 렌더링 최적화'
categories: ['React']
summary: 'React의 setState에서 callback 함수를 사용하는 방법에 대해 정리한 글입니다.'
---

## React.memo

React.memo는 고차 컴포넌트(Higher Order Component)로 React.memo로, 컴포넌트를 감싸주게 되면 해당 컴포넌트로 전달되는 props가 변경되는 경우에만 컴포넌트가 렌더링 됩니다.
즉, React는 React.memo로 컴퍼넌트를 렌더링하고 결과를 메모이징(Memoizing)한 다음, 다시 렌더링이 일어날 때 props가 같다면 마지막으로 렌더링 된 결과를 재사용합니다.

기본적으로 React.memo는 props 혹은 props의 객체를 비교할 때 얕은(shallow) 비교를 하지만, 두번째 인자로 props를 비교하기 위한 함수를 별도로 전달할 수 있습니다.

```jsx
function MyComponent(props) {
  // props를 사용하여 렌더링
}

function areEqual(prevProps, nextProps) {
  return prevProps === nextProps ? true : false

  // nextProps가 prevProps와 동일한 값을 가지면 true를 반환하고, 그렇지 않다면 false를 반환
}

export default React.memo(MyComponent, areEqual)
```

<br/>

다음은 React.memo의 간단한 사용 예시입입니다.
아래 코드를 보면 Parent 컴포넌트에서 `childCount`를 Child에 props로 전달해줍니다. 이 때 Count 버튼을 클릭할 때 마다 count 값은 증가하지만 `childCount` 값은 변하지 않습니다. 하지만 Child 컴포넌트를 보면 `console.log`가 계속해서 실행되는 것을 확인할 수 있는데 그 이유는 Parent 컴포넌트가 렌더링 될 때 마다 `childCount` 값이 props로 전달되기 때문입니다.

```jsx
import { useState } from 'react'
import Child from './Child'

const Parent = () => {
  const [count, setCount] = useState(0)
  const childCount = 0

  const onClick = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <button onClick={onClick}>Count</button>
      <Child childCount={childCount} />
    </div>
  )
}

export default Parent
```

```jsx
const Child = ({ childCount }) => {
  console.log(childCount)

  return <div>{`Child ${childCount}`}</div>
}

export default Child
```

<br/>

이러한 문제를 React.memo를 통해 해결할 수 있습니다. Child 컴포넌트를 React.memo로 감싸주게 되면 이전에 props로 전달받은 `childCount` 값과 새롭게 props로 전달 받은 `childCount` 값을 비교한 다음, 두 값이 같으면 Child 컴포넌트는 렌더링이 되지 않습니다.

```jsx
import { memo } from 'react'

const Child = memo(({ childCount }: { childCount: number }) => {
  console.log(childCount)

  return <div>{`Child ${childCount}`}</div>
})

export default Child
```

---

## React.memo와 useState의 합수형 업데이트 함께 사용하기

아래는 `useState`의 state로 관리하는 `users`의 목록을 출력하고, `+` 버튼을 누르면 해당하는 user의 count가 1씩 증가하는 코드입니다.

```jsx
import { useCallback, useState } from 'react'

const App = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'user1',
      count: 0,
    },
    {
      id: 2,
      username: 'user2',
      count: 0,
    },
    {
      id: 3,
      username: 'user3',
      count: 0,
    },
  ])

  const onAdd = useCallback(
    id => {
      setUsers(
        users.map(user =>
          user.id === id ? { ...user, count: user.count + 1 } : user,
        ),
      )
    },
    [users],
  )

  return (
    <div>
      <UserList users={users} onAdd={onAdd}></UserList>
    </div>
  )
}

export default App
```

```jsx
//UserList.jsx

const UserList = ({ users, onAdd }) => {
  console.log('UserList render')
  return (
    <>
      {users.map(user => (
        <User key={user.id} user={user} onAdd={onAdd}></User>
      ))}
    </>
  )
}
```

```jsx
//User.jsx

import { memo } from 'react'

const User = memo(({ user, onAdd }) => {
  console.log('User render')
  return (
    <div>
      <span>{user.username}</span>
      <div>
        <span>{user.count}</span>
        <button onClick={() => onAdd(user.id)}>+</button>
      </div>
    </div>
  )
})
```

하지만 코드를 보면 User 컴포넌트는 `memo`로 감쌌음에도 불구하고 user 하나의 `+` 버튼을 클릭해도 `"User render"`가 3번씩 출력되는 것을 확인할 수 있습니다.
그 이유는 onAdd 함수가 useCallback을 사용하고 있지만 dependency가 users로 되어 있기 때문에 users가 update 되면 다시 onAdd 함수가 정의된 다음 props로 전달되어 User 컴포넌트가 각각 다시 렌더링 되기 때문입니다.

이러한 문제를 useState의 함수형 업데이트를 사용해서 해결할 수 있는데 아래처럼 onAdd 함수를 수정해줍니다.

```jsx
const onAdd = useCallback(id => {
  setUsers(users =>
    users.map(user =>
      user.id === id ? { ...user, count: user.count + 1 } : user,
    ),
  )
}, [])
```

useCallback의 dependency를 없앴기 때문에 해당 함수는 다시 정의되지 않습니다. 그리고 setUsers에서 callback 함수를 통해 이전 state를 사용해서 count를 증가시키도록 구현되어 있기 때문에 count를 1씩 증가시킬 수 있게 됩니다.
코드를 수정 후, 각각 요소의 `+` 버튼을 클릭하면 `"User render"`가 한번만 출력되는 것을 확인할 수 있습니다.

만약 아래처럼 dependency가 없고 함수형 업데이를 하지 않는 경우, 같은 `+` 버튼을 여러번 누르더라도, 1 이상 증가하지 않습니다.

```jsx
const onAdd = useCallback(id => {
  setUsers(
    users.map(user =>
      user.id === id ? { ...user, count: user.count + 1 } : user,
    ),
  )
}, [])
```

그 이유는 useCallback은 메모에이징된 콜백 함수를 반환하는데, dependency가 없는 경우에는 처음 함수가 정의된 이후 재 정의되지 않으므로 해당 콜백함수에서는 처음 할당된 `users`를 계속해서 사용하기 때문입니다. 따라서 처음 `users`의 user는 모두 count가 0이므로, 0에 1을 더한 값이 계속해서 새로운 값으로 User 컴포넌트에 표시됩니다.
그리고 다른 `+` 버튼을 클릭했을 때, 처음 클릭한 `+` 버튼 옆 숫자가 1에서 0으로 초기화 되는 이유도 처음 user 값이 반환되기 때문입니다.
