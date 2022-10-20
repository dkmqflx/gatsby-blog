---
date: '2021-05-16'
title: 'memo와 useState를 사용한 함수형 업데이트'
categories: ['React']
summary: 'React의 setState에서 callback 함수를 사용하는 방법에 대해 정리한 글입니다.'
---

- 아래는 `useState`의 state로 관리하는 `users`의 목록을 출력하고, `+` 버튼을 누르면 해당하는 user의 count가 1씩 증가하는 코드입니다..

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

- 하지만 코드를 보면 User 컴포넌트는 `memo`로 감쌌음에도 불구하고 user 하나의 `+` 버튼을 클릭해도 `"User render"`가 3번씩 출력되는 것을 확인할 수 있습니다

- 그 이유는, onAdd 함수가 useCallback을 사용하고 있지만 dependency가 users로 되어 있기 때문에, users가 update 되면 다시 onAdd 함수가 정의되어 props로 전달되어 User 컴포넌트가 각각 다시 렌더링 되기 때문입니다.

- 이러한 문제를 useState의 함수형 업데이트를 사용해서 해결할 수 있습니다.

- useState의 함수형 업데이트는, [setState 안에서 callback 함수를 사용해서 가장 최신의 state를 사용해서 state를 update 하는 방법](https://dkmqflx.netlify.app/react-setstate-callback/)으로, 아래처럼 onAdd 함수를 수정해줍니다.

```jsx
const onAdd = useCallback(id => {
  setUsers(users =>
    users.map(user =>
      user.id === id ? { ...user, count: user.count + 1 } : user,
    ),
  )
}, [])
```

- useCallback의 dependency를 없앴기 때문에 해당 함수는 다시 정의되지 않습니다.

- 하지만 setUsers에서 callback를 통해 users를 사용하고, 해당 callback함수 안에 state를 사용해서 count를 증가시키도록 구현되어 있기 때문에, count를 1씩 증가시킬 수 있게 됩니다.

- 따라서 코드를 수정 후, 각각 요소의 `+` 버튼을 클릭하면 `"User render"`가 한번만 출력되는 것을 확인할 수 있습니다.

- 만약 아래처럼 dependency가 없고 함수형 업데이를 하지 않는 경우, 같은 `+` 버튼을 여러번 누르더라도, 1 이상 증가하지 않습니다.

```jsx
const onAdd = useCallback(id => {
  setUsers(
    users.map(user =>
      user.id === id ? { ...user, count: user.count + 1 } : user,
    ),
  )
}, [])
```

- 그 이유는 useCallback은 메모에이징된 콜백 함수를 반환하는데, dependency가 없는 경우에는, 처음 함수가 정의된 이후 재 정의되지 않으므로 해당 콜백함수에서는 처음 할당된 `users`를 계속해서 사용하기 때문입니다

- 따라서 처음 `users`의 user는 모두 count가 0이므로, 0에 1을 더한 값이 계속해서 새로운 값으로 User 컴포넌트에 표시됩니다.

- 그리고 다른 `+` 버튼을 클릭했을 때, 처음 클릭한 `+` 버튼 옆 숫자가 1에서 0으로 초기화 되는 이유도, 처음 user 값이 반환되기 때문입니다.

---

## Reference

- [리액트 공식 문서](https://reactjs.org/docs/react-api.html#reactmemo)
- [useMemo 를 사용하여 연산한 값 재사용하기](https://react.vlpt.us/basic/17-useMemo.html)
