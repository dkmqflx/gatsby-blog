---
date: '2022-08-10'
title: 'React Suspense가 등장하게 된 이유와 사용법'
categories: ['React']
summary: 'React Suspense의 개념과 사용법 정리한 글입니다.'
---

### React Suspense

Suspense는 React 16.6에서 추가된 기능으로 Suspense로 감싼 컴포넌트가 아직 렌더링 될 준비가 되지 않은 경우, 기다리는 동안 loading state를 나타낼 수 있도록 하는 기능입니다. Suspense는 Component Lazy Loading이나 Data Fetching 등의 비동기 처리에 사용될 수 있습니다.

> React 16.6 added a <Suspense> component that lets you “wait” for some code to load and declaratively specify a loading state (like a spinner) while we’re waiting:

_[React 공식문서 : Suspense for Data Fetching (Experimental)](https://17.reactjs.org/docs/concurrent-mode-suspense.html)_

Suspense가 등장하게 된 배경에는 다음과 같은 배경이 있습니다.

---

### Approach 1: Fetch-on-Render (not using Suspense)

기존에는 아래처럼 컴포넌트가 mount 된 다음에 useEffect를 호출해주는 방식으로 처리해주었습니다.

1. 처음에는 state가 null이기 때문에 조건문이 실행되어 Loading state가 화면에 출력됩니다.

2. 컴포넌트가 mount 된 다음 useEffect가 실행되어 데이터를 받아오고 setState로 state 값을 업데이트 해줍니다.

3. state가 업데이트 되었기 때문에 다시 렌더링이 일어나게 되고 `if(!users)` 조건문 아래 있는 return 문의 컴포넌트가 사용자에게 보여지게 됩니다.

```js
// App.js
import { useState, useEffect } from 'react'

function App() {
  return (
    <>
      <Users />
      <Posts />
    </>
  )
}

const getData = type => {
  return fetch(`https://jsonplaceholder.typicode.com/${type}`)
}

// Users 컴포넌트
function Users() {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    getData('users')
      .then(response => response.json())
      .then(data => setUsers(data))
  }, [])

  if (!users) return <p>Loading Users</p>

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

// Posts 컴포넌트
function Posts() {
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    getData('posts')
      .then(response => response.json())
      .then(data => setPosts(data))
  }, [])

  if (!posts) return <p>Loading Post</p>

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

이렇게 useEffect를 실행해서 데이터를 받아오는 경우 다음과 같은 문제점이 있습니다.
유저 정보를 받아오는 동안 비동기 처리가 되고 있기 때문에 벙렬적으로 포스트에 대한 정보를 서버로 부터 받아올 수 있음에도 불구하고 유저 정보를 다 받아온 다음에야 Posts 컴포넌트에서 데이터를 요청하는 함수 `getData`가 실행되어서 포스트 정보를 받아올 수 있습니다.

그렇기 때문에 사용자는 유저 정보를 받아 올 때까지는 `Loading Users` 가 보이고, 유저 정보를 다 받아온 다음에 포스트 정보를 받을 때는 `Loading Posts`에 해당하는 loading state를 사용자는 계속 보게 됩니다.

이러한 문제를 해결하기 위해 `Promise.all`을 사용해서 병렬적으로 두 정보를 동시에 받아오는 방법이 있습니다.

---

### Approach 2: Fetch-Then-Render (not using Suspense)

첫번째 방법이 각각 데이터를 불러오는 방법이었다면 아래 코드에서는 `Promise.all`을 사용해서 데이터를 한꺼번에 불러오도록 수정하였습니다.

```js
// App.js

import { useState, useEffect } from 'react'

function App() {
  return (
    <>
      <Users />
    </>
  )
}

const getData = type => {
  return fetch(`https://jsonplaceholder.typicode.com/${type}`)
}

// Posts 컴포넌트 Users 컴포넌트 안으로 이동
function Users() {
  const [users, setUsers] = useState(null)
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    // Promise.all을 사용해서 병렬적으로 데이터를 받아온다
    Promise.all([getData('users'), getData('posts')])
      .then(responses =>
        Promise.all(responses.map(response => response.json())),
      )
      .then(([users, posts]) => {
        setUsers(users)
        setPosts(posts)
      })
  }, [])

  if (!users) return <p>Loading Users</p>

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
      <Posts posts={posts} />
    </div>
  )
}

function Posts({ posts }) {
  if (!posts) return <p>Loading Post</p>

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

`Promise.all`을 사용해서 서버로 부터 유저 정보와 포스트 정보를 동시에 요청한 다음 두 데이터를 모두 받은 다음에 `then`이 실행됩니다. 하지만 `Promise.all`을 사용해서 데이터를 동시에 요청하더라도 다음과 같은 문제점이 있습니다.

`Promise.all`은 주어진 프로미스가 모두 완료될 때까지 기다리기 때문에 만약 포스트 정보를 받아오는데 많은 시간이 걸린다면, 유저 정보를 다 받아오고 나서도 사용자는 포스트 정보를 보지 못하게 됩니다. 그리고 리액트 18 이전 버전에서는 Promsie 안에서의 `setState` 사용으로 인해 batch 업데이트가 되지 않는 문제가 있습니다. setUser을 호출하면 렌더링이 일어나고, setPosts를 호출하면 또 다시 렌더링이 일어나서 총 세번의 렌더링이 일어나는데, 이처럼 setState 호출 때 마다 렌더링이 일어나는 문제가 발생합니다.

앞서 언급한 이러한 문제점들을 극복하기 위한 방법이 바로 `Suspense` 입니다.

---

### Approach 3: Render-as-You-Fetch (using Suspense)

아래 코드는 Suspense를 React Query와 함께 사용한 예시입니다. 앞의 두 예시에서는 fetching 시작 후 fetching이 다 끝난 다음에 setState를 통해서 렌더링을 해주었습니다. 하지만 Suspense를 사용하면 fetching을 하면서 현재 상태를 rendering해서 보여줄 수 있습니다.

```js
// App.js

import { Suspense, useState, useEffect } from 'react'
import { useQuery } from 'react-query'

function App() {
  return (
    <>
      <Suspense fallback={<h1>Loading Users</h1>}>
        <Users />
        <Suspense fallback={<h1>Loading Posts</h1>}>
          <Posts />
        </Suspense>
      </Suspense>
    </>
  )
}

const getData = type => {
  return fetch(`https://jsonplaceholder.typicode.com/${type}`)
}

function Users() {
  const { data: users } = useQuery(
    ['users'],
    () => getData('users').then(response => response.json()),
    { suspense: true },
  )

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users?.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

function Posts() {
  const { data: posts } = useQuery(
    ['posts'],
    () => getData('posts').then(response => response.json()),
    { suspense: true },
  )

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts?.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

코드는 다음과 같은 순서로 실행됩니다.

1.  리액트가 Users 컴포넌트를 렌더링 하려고 할 때 컴포넌트가 데이터를 가지고 오고 있는 suspend 상태이기 때문에 리액트는 해당 컴포넌트를 skip 하고 Post 컴포넌트를 렌더링 합니다.

2.  Post 컴포넌트 또한 Suspense로 감싸져 있고 데이터를 가지고 오고 있는 suspend 상태이기 때문에 리액트는 skip을 합니다.

3.  리액트가 더 이상 렌더링할 것이 없으면 가장 먼저 suspend 상태로 등록된 Users 컴포넌트의 fallback인 `<h1>Loading Users</h1>`를 보여줍니다

4.  만약 Users의 비동기 작업이 작업이 끝나면 리액트는 Users 컴포넌트를 다시 렌더링하는데 fallback 대신 Users 컴포넌트가 렌더링되어 사용자에게 보여집니다.

5.  이제 리액트는 Users 다음으로 suspend로 상태로 등록되어 있는 Posts 컴포넌트의 fallback인 `<h1>Loading Posts</h1>`를 보여줍니다

6.  Posts 컴포넌트도 비동기 작업이 작업이 끝나면 리액트는 Posts 컴포넌트를 다시 렌더링 해주고 fallback 대신 Posts 컴포넌트가 렌더링되어 사용자에게 보여집니다.

7.  하지만 Users가 아니라 Posts의 비동기 작업이 먼저 끝나게 되면 리액트는 Posts 컴포넌트를 먼저 렌더링 해서 사용자에게 보여주게 되고 이후에 Users 컴포넌트의 비동기 작업이 작업이 끝나면 컴포넌트를 다시 렌더링해줍니다.

정리하자면, Suspense 컴포넌트를 사용해서 `Users` 컴포넌트와 `Posts` 중 자식 컴포넌트의 비동기 작업이 먼저 끝나는 컴포넌트를 렌더링 해주는 방식으로 useEffect와 Promise.all을 사용했을 때의 한계점을 극복할 수 있습니다.

만약 아래처럼 하나의 Suspense 안에 두 컴포넌트가 있다면, 두 컴포넌트 모두 비동기 작업이 끝날 때 까지 fallback이 렌더링 되고 두 컴포넌트의 비동기 작업이 끝난 이후에 Suspense 안에 있는 두 컴포넌트가 렌더링 됩니다.

```js
function App() {
  return (
    <Suspense fallback={<h1>Loading Users</h1>}>
      <Users />
      <Posts />
    </Suspense>
  )
}
```

각각의 컴포넌트를 Suspense로 감싸주면 각 Suspense의 fallback이 동시에 보여지게 되고, 비동기 작업이 끝나면 컴포넌트가 다시 렌더링 됩니다.

```js
function App() {
  return (
    <>
      <Suspense fallback={<h1>Loading Users</h1>}>
        <Users />
      </Suspense>
      <Suspense fallback={<h1>Loading Posts</h1>}>
        <Posts />
      </Suspense>
    </>
  )
}
```

<br/>

하지만 React 18에서는 lazy loading components에만 Suspense를 사용할 수 있는데 아직 data fetching을 지원하지 않기 때문입니다. 공식문서에서 이를 확인할 수 있습니다.

> React.Suspense lets you specify the loading indicator in case some components in the tree below it are not yet ready to render. In the future we plan to let Suspense handle more scenarios such as data fetching. You can read about this in our roadmap. Today, lazy loading components is the only use case supported by <React.Suspense>:

_[React 공식문서 : React.Suspense v18](https://reactjs.org/docs/react-api.html#reactsuspense)_

따라서 React 18에서는 아래처럼 컴포넌트를 동적으로 불러오는 lazy loading에서만 Suspense를 사용할 수 있습니다.

```js
const LazyComponent = React.lazy(() => import('./LazyComponent'))

function MyComponent() {
  return (
    <Suspense fallback={<h1>Loading Users</h1>}>
      <div>
        <LazyComponent />
      </div>
    </Suspense>
  )
}
```
