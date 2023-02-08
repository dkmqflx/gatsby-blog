---
date: '2022-11-10'
title: 'BroadcastChannel API 사용해서 서로 다른 탭 사이에 통신하기'
categories: ['JavaScript', 'React']
summary: 'BroadcastChannel API를 사용하는 방법에 대해 정리한 글입니다.'
---

## BroadcastChannel

BroadcastChannel은 동일한 Origin을 갖는 서로 다른 창 또는 탭 사이에서 통신할 때 사용할 수 있는 API 입니다. <br/>
아래처럼 BroadcastChannel을 생성할 수 있습니다. 이 때 동일한 Origin에 대해서는 중복되는 Channel 이름으로 BroadcastChannel을 만들 수 없습니다.

```js
const broadCastChannel = new BroadcastChannel(CHANNEL_NAME)
```

이렇게 선언된 BroadcastChannel은 postMessage 함수를 통해서 메세지를 전달할 수 있는데, 전달된 메세지는 같은 이름의 BroadcastChannel를 listening 하고 있는 모든 BroadcastChannel에 전송됩니다

아래처럼 postMessage 함수에 `'new Message!'` 라는 메세지를 전달합니다.

```js
const sendBroadCastChannel = new BroadcastChannel(CHANNEL_NAME)
broadCastChannel.postMessage('new Message!')
```

이렇게 전달된 메세지는 같은 BroadcastChannel 이름을 갖고 있는 BroadcastChannel 객체의 onmessage 함수를 통해 전달받을 수 있습니다.

```js
const receiveBroadCastChannel = new BroadcastChannel(CHANNEL_NAME)
broadCastChannel.onmessage = event => {
  console.log(event.data) // new Message!
}
```

---

## React 에서 BroadcastChannel 하는 Custom hook 만들기

리액트에서도 BroadcastChannel을 사용해서 서로 다른 탭 사이에 통신을 할 수 있습니다. 아래는BroadcastChannel을 사용하기 위한 Custom hook입니다.

```js
// hooks/useNewTab.jsx

import { useEffect, useRef, useState } from 'react'

const CHANNEL_NAME = 'newtab'

const useNewTab = () => {
  const channel = useRef()
  const [data, setData] = useState()

  // 메세지 보내는 함수
  const postMessage = message => {
    channel.current?.postMessage(message)
  }

  // 새로운 탭 열 수 있는 함수
  const openNewTab = () => {
    window.open(`/newtab`)
  }

  useEffect(() => {
    channel.current = new BroadcastChannel(CHANNEL_NAME)

    if (channel.current) {
      // channel.current.onmessage와 동일, 메세지 이벤트 발생할 때 마다 state 변경해준다
      channel.current.addEventListener('message', event => {
        setData(event.data)
      })
    }

    return () => {
      channel.current?.removeEventListener('message', event => {
        setData(event.data)
      })
    }
  }, [])

  return { postMessage, data, openNewTab }
}

export default useNewTab
```

이렇게 선언한 Custom hook에는 BroadcastChannel가 선언되어 있기 때문에 hook을 사용하는 모든 곳에서 서로 데이터를 주고 받을 수 있게 됩니다. <br/>
아래는 새로운 탭을 열고 다른 BroadcastChannel에서 보낸 메세지를 받아서 보여주는 코드입니다.

```js
// pages/Home.js
import useNewTab from '../src/hooks/useNewTab'

export default function Home() {
  const { data, openNewTab } = useNewTab()

  return (
    <div>
      <div>data is {data}</div>
      <button onClick={openNewTab}>Open new Tab</button>
    </div>
  )
}
```

`Open new Tab` 버튼을 눌러 새로운 페이지를 열어줍니다. 그리고 해당 페이지에서 데이터를 입력받은 후 확인 버튼을 누르면 위 페이지에서 입력한 데이터를 볼 수 있습니다

```js
// pages/newtab.jsx
import useNewTab from '@/src/hooks/useNewTab'

const newtab = () => {
  const { postMessage } = useNewTab()

  const onSubmit = e => {
    e.preventDefault()

    postMessage(e.target.data.value)
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="data" />
      <button type="submit">확인</button>
    </form>
  )
}

export default newtab
```
