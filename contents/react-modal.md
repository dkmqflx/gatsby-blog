---
date: '2021-04-26'
title: 'React에서 Modal창 직접 구현하기'
categories: ['React']
summary: 'React에서 Modal창 직접 구현하는 방법에 대해 정리한 글입니다.'
---

- 아래는 리액트에서 Modal 창을 간단하게 구현한 코드입니다.

- `ModalContainer` 의 `Click` 버튼을 클릭하면 Modal 창을 열고 닫을 수 있습니다.

```jsx
//ModalContainer.jsx

import React, { useState } from 'react'
import Modal from './Modal'

const ModalContainer = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  return (
    <>
      <button onClick={toggleModal}>Click</button>
      {modalOpen && <Modal modalClose={toggleModal}></Modal>}
    </>
  )
}

export default ModalContainer
```

- `Modal Close` 버튼을 누르면 `ModalContainer` 에서 전달받은 `modalClose` 실행되어 Modal을 열고 닫을 수 있습니다.

```jsx
// Modal.jsx

import React from 'react'
import './Modal.scss'

const Modal = ({ modalClose }) => {
  return (
    <div className="modal__container">
      <div className="modal">
        <button className="modal__button" onClick={modalClose}>
          Modal Close
        </button>
      </div>
    </div>
  )
}

export default Modal
```

- Modal 창이 열릴 때, Modal 창을 제외한 나머지 부분을 어둡게 하는 방법은, Modal 창을 감싸는 컨테이너 요소를 만들고 해당 요소에 스타일을 적용하는 것입니다

- 우선, 아래 코드처럼 `width`, `height` 속성을 전체 브라우저를 다 차지하도록 조정해줍니다.

- 그리고, `position`, `top`, `left` 속성을 사용해서 해당 요소가 브라우저를 기준으로 모든 요소를 다 자치하도록 해준 다음 `z-index`의 값으로 높은 값을 주어 가장 위에 있는 요소로 만들어줍니다.

```css
/* Modal.css */

.modal__container {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
}

.modal {
  width: 300px;
  height: 150px;
  background-color: #fff;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.modal__button {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

- 그리고 Modal 창을 제외한 나머지 부분을 클릭했을 때도 Modal 창이 닫히도록 하기 위해서, 다음과 같이 코드를 변경시켜줍니다.

```jsx
// Modal.jsx

import React from 'react'
import './Modal.scss'

const Modal = ({ modalClose }) => {
  return (
    <div className="modal__container" onClick={modalClose}>
      <div className="modal">
        <button className="modal__button" onClick={modalClose}>
          Modal Close
        </button>
      </div>
    </div>
  )
}

export default Modal
```

- 하지만 코드를 실행시켜보면, Modal 창의 `z-index`가 더 높지만, Modal 창의 내부를 클릭해도 Modal 창이 닫히게 되는 문제가 생깁니다.

- 그 이유는 바로 부모 - 자식 요소 간에는, 자식 요소가 부모 요소보다 `z-index`가 높다고 해서 더 위에 있는 요소가 되지 않기 때문입니ㅏㄷ.

- 즉, `z-index`는 해당 부모 요소 안의 자식 요소 우선순위를 비교하는 것이기 때문에 자식 요소가 부모 요소보다 `z-index`가 높다고 더 높은 우선순위를 갖지 않습니다.

- `z-index`는 부모 요소 안에 자식 요소1과 자식 요소2 child2가 있는 경우, 각각의 자식 요소의 우선순위를 비교할 때 사용되는 속성이기 때문입니다.

- 따라서 부모 - 자식 간의 우선순위로 해결할 수 없기 때문에, `event.target`과 `event.currentTarget`을 비교하는 방법으로 이러한 문제를 해결할 수 있습니다.

- 아래 코드처럼, modal의 컨테이너 요소에 `event.target`과 `event.currentTarget`를 비교해주는 함수를 등록해줍니다..

- `onClick` 이벤트는, 컨테이너 요소에 등록되어 있기 때문에, modal 창 내부를 클릭하고 콘솔창의 결과 값을 비교해보면, `event.target`과 `event.currentTarget`가 서로 다른 것을 확인할 수 있습니다.

- 따라서, 컨테이너 요소에 해당하는 부분을 클릭했을 때만 `event.target`과 `event.currentTarget` 가 같아지기 때문에, modal 창을 제외한 나머지 부분을 클릭했을 때 modal 창이 닫히게 됩니다.

```jsx
import React from 'react'
import './Modal.scss'

// Modal.jsx

const Modal = ({ modalClose }) => {
  const onCloseModal = e => {
    console.log('e.target: ', e.target)
    console.log('e.tarcurrentTargetget: ', e.currentTarget)
    if (e.target === e.currentTarget) {
      modalClose()
    }
  }
  return (
    <div className="modal__container" onClick={onCloseModal}>
      <div className="modal">
        <button className="modal__button" onClick={modalClose}>
          {' '}
          Modal Close
        </button>
      </div>
    </div>
  )
}

export default Modal
```

- 완성된 결과물을 아래 코드에서 실행해 볼 수 있습니다.

<iframe src="https://codesandbox.io/embed/reacteseo-modal-cang-jigjeob-guhyeonhagi-hsk8jd?fontsize=14&hidenavigation=1&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React에서 Modal 창 직접 구현하기"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## Reference

- [z-index가 동작하지않는 이유 4가지](https://erwinousy.medium.com/z-index%EA%B0%80-%EB%8F%99%EC%9E%91%ED%95%98%EC%A7%80%EC%95%8A%EB%8A%94-%EC%9D%B4%EC%9C%A0-4%EA%B0%80%EC%A7%80-%EA%B7%B8%EB%A6%AC%EA%B3%A0-%EA%B3%A0%EC%B9%98%EB%8A%94-%EB%B0%A9%EB%B2%95-d5097572b82f)
