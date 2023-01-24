---
date: '2021-01-23'
title: 'React의 setState에서 callback 함수를 사용하는 방법'
categories: ['React']
summary: 'React의 setState에서 callback 함수를 사용하는 방법에 대해 정리한 글입니다.'
---

리액트의 `setState`는 batch update가 적용되기 때문에 이벤트 핸들러에 여러번 호출되더라도 하나의 업데이트로 처리가 됩니다.
따라서 아래와 같은 코드에서 버튼을 클릭하면 3씩 증가하는 것이 아니라 1씩 증가합니다.

```jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return (
    <div>
      <span>{`count is ${count}`}</span>
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}

export default App
```

<br/>

만약`setState`를 호출할 때 마다 실행하고 싶다면 이전 `state`를 사용해서 새로운 `state`를 계산하는 함수를 `setState`에 전달함으로써 문제를 해결할 수 있습니다. 아래 코드처럼 `setCount`에 `count`라는 인자를 전달받는 콜백함수를 전달하게 되면, 함수는 `count`의 이전 `state`를 값으로 받습니다. 따라서 각 함수가 이전 `state` 값에서 1 만큼 증가하기 때문에 버튼을 누르면 3씩 증가하게 됩니다.

```jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count => count + 1)
    setCount(count => count + 1)
    setCount(count => count + 1)
  }

  return (
    <div>
      <span>{`count is ${count}`}</span>
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}

export default App
```

<br/>

이처럼 `setState`에 callback 함수를 전달함으로써 호출 할 때마다 `state` 값을 변경시킬 수 있습니다.

아래 코드는 버튼을 누르면 1씩 증가한 값이 화면에 출력됩니다. handleIncrement 함수를 보면 map 함수를 사용해서 하나씩 card가 선택한 card와 id와 같은지 비교한 다음에 같은 card에 대해 count를 1만큼 증가시킵니다. 하지만 이렇게 반복적으로 map 또는 loop를 사용하는 것은 좋지 않은데 반복적으로 비교해야하는 요소가 많을수록 성능이 좋지 않기 때문입니다.

이 때 `setState`에 callback 함수를 전달하는 방식으로 작성된 코드를 개선할 수 있습니다.

```jsx
//App.js

import { useState } from 'react'
import Card from './components/card'

function App() {
  const [cards, setCards] = useState({
    1: { id: 1, name: 'TypeScript', count: 0 },
    2: { id: 2, name: 'JavaScript', count: 0 },
    3: { id: 3, name: 'Python', count: 0 },
  })

  const handleIncrement = seletecCard => {
    const newCards = Object.keys(cards).map(key => {
      if (cards[key].id === seletecCard.id) {
        return { ...seletecCard, count: seletecCard.count + 1 }
      }
      return cards[key]
    })
    setCards(newCards)
  }

  return Object.keys(cards).map(key => (
    <Card key={key} card={cards[key]} handleIncrement={handleIncrement}></Card>
  ))
}

export default App
```

```jsx
//Card.js

import React from 'react'

const Card = ({ card, handleIncrement }) => {
  const onClick = () => {
    handleIncrement(card)
  }

  return (
    <div>
      <div>{`name is ${card.name}`}</div>
      <span>{`count is ${card.count}`}</span>
      <button onClick={onClick}>+</button>
    </div>
  )
}

export default Card
```

<br/>

아래처럼 prevCards라는 이전 `state`을 받아서 updateCards라는 새로운 객체를 만들고 이 객체에 클릭되는 항목의 count를 1만큼 증가시켜서 새로 객체에 할당하는 방식으로 문제를 해결할 수 있습니다.

```jsx
//App.js
import { useState } from 'react'
import Card from './components/card'

function App() {
  const [cards, setCards] = useState({
    1: { id: 1, name: 'TypeScript', count: 0 },
    2: { id: 2, name: 'JavaScript', count: 0 },
    3: { id: 3, name: 'Python', count: 0 },
  })

  const handleIncrement = seletecCard => {
    setCards(prevCards => {
      const updatedCards = { ...prevCards }
      updatedCards[seletecCard.id] = {
        ...seletecCard,
        count: seletecCard.count + 1,
      }

      return updatedCards
    })
  }

  return Object.keys(cards).map(key => (
    <Card key={key} card={cards[key]} handleIncrement={handleIncrement}></Card>
  ))
}

export default App
```

<br/>

`useCallback`을 사용할 때 dependency가 빈 배열이라면 `state` 가 변경되지 않아 문제가 발생할 때가 있습니다. 이러한 경우에도 `setState`에 콜백함수를 전달함으로써 해결할 수 있습니다.

아래 코드는 위의 `setState`에 콜백함수를 사용하기 전 map 함수를 사용한 코드에서 dependency가 빈 배열인 `useCallback`을 사용한 경우입니다. 만약 아래처럼 코드를 작성 한후 `+`버튼을 눌러 특정 항목의 count를 증가 시킨 후 다음 항목의 `+`버튼을 누르면 이전에 count가 증가했던 항목의 count는 다시 0이 됩니다.

그 이유는 `useCallback` 은 메모이징된 콜백 함수를 반환하는데, 아래 코드에서 콜백 함수로 전달된 함수에서의 cards는 처음 할당된 cards 객체를 값으로 가지기 때문입니다. dependency가 빈 배열이기 때문에 함수는 처음 한번만 정의되고, 새로운 항목의 + 버튼을 클릭하더라도 다시 최초의 cards에 대해 계산을 하기 때문에 다른 항목은 다시 count 값이 0이 됩니다.

```jsx
//App.js

import { useState, useCallback } from 'react'
import Card from './components/card'

function App() {
  const [cards, setCards] = useState({
    1: { id: 1, name: 'TypeScript', count: 0 },
    2: { id: 2, name: 'JavaScript', count: 0 },
    3: { id: 3, name: 'Python', count: 0 },
  })

  const handleIncrement = useCallback(seletecCard => {
    const newCards = Object.keys(cards).map(key => {
      if (cards[key].id === seletecCard.id) {
        return { ...seletecCard, count: seletecCard.count + 1 }
      }
      return cards[key]
    })
    setCards(newCards)
  }, [])

  return Object.keys(cards).map(key => (
    <Card key={key} card={cards[key]} handleIncrement={handleIncrement}></Card>
  ))
}

export default App
```

<br/>

이러한 경우도 아래처럼 `setState`에 콜백 함수를 전달함으로써 해결 할 수 있습니다. `useCallback`을 사용할때 `setState`에 이전 state를 전달하는 콜백함수를 사용하면 함수가 한번만 정의되어 있더라도 최신의 `state`를 참조할 수 있기 때문입니다.

```jsx
//App.js

import { useState, useCallback } from 'react'
import Card from './components/card'

function App() {
  const [cards, setCards] = useState({
    1: { id: 1, name: 'TypeScript', count: 0 },
    2: { id: 2, name: 'JavaScript', count: 0 },
    3: { id: 3, name: 'Python', count: 0 },
  })

  const handleIncrement = useCallback(seletecCard => {
    setCards(prevCards => {
      const updatedCards = { ...prevCards }
      updatedCards[seletecCard.id] = {
        ...seletecCard,
        count: seletecCard.count + 1,
      }

      return updatedCards
    })
  }, [])

  return Object.keys(cards).map(key => (
    <Card key={key} card={cards[key]} handleIncrement={handleIncrement}></Card>
  ))
}

export default App
```

---
