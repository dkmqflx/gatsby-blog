---
date: '2021-04-26'
title: 'React에서 Modal창 직접 구현하기'
categories: ['React']
summary: 'React에서 Modal창 직접 구현하는 방법에 대해 정리한 글입니다.'
---

### Modal 컴포넌트 구현

아래는 리액트에서 Modal 창을 간단하게 구현한 코드로 `ModalContainer` 의 `Click` 버튼을 클릭하면 Modal 창을 열고 닫을 수 있습니다.

```js
// ModalContainer.jsx

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

`Modal Close` 버튼을 누르면 `ModalContainer` 에서 전달받은 `modalClose` 함수가 실행되어 Modal을 닫을 수 있습니다.

```js
// Modal.jsx

const Modal = ({ modalClose }) => {
  return (
    <div>
      <div>
        <button onClick={modalClose}>Modal Close</button>
      </div>
    </div>
  )
}
```

---

### Modal 이외의 요소 어둡게 하기

추가적으로 Modal 창이 열릴 때 Modal 창을 제외한 나머지 부분을 어둡게해서, 모달창을 시각적으로 구분시킬 수 있습니다. <br/>
우선 Modal 창을 감싸는 컨테이너 요소에 `position: fixed;`속성을 적용해서 부모 요소가 아닌 브라우저를 기준으로 요소가 배치되도록합니다. 그리고 `width`, `height` 속성을 전체 브라우저를 다 차지하도록 변경해준다음 `z-index`의 값으로 높은 값을 주어 가장 위에 있는 요소로 만들어줍니다.

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

그리고 Modal 창을 제외한 나머지 부분을 클릭했을 때도 Modal 창이 닫히도록 하기 위해서, 다음과 `modal__container` 요소를 클릭했을 때도 Modal 창이 닫히도록 코드를 변경시켜줍니다.

```js
// Modal.jsx
import './Modal.css'

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
```

하지만 코드를 실행시켜보면, Modal 창의 `z-index`가 더 높지만, Modal 창의 내부를 클릭해도 Modal 창이 닫히게 되는 문제가 생깁니다. 그 이유는 바로 부모 - 자식 요소 간에는, 자식 요소가 부모 요소보다 `z-index`가 높다고 해서 더 위에 있는 요소가 되지 않기 때문입니다.

즉, `z-index`는 해당 부모 요소 안의 자식 요소 우선순위를 비교하는 것이기 때문에 자식 요소가 부모 요소보다 `z-index`가 높다고 더 높은 우선순위를 갖지 않습니다. `z-index`는 부모 요소 안에 자식 요소1과 자식 요소2가 있는 경우, 각각의 자식 요소의 우선순위를 비교할 때 사용되는 속성이기 때문입니다.

따라서 부모 - 자식 간의 우선순위로 해결할 수 없기 때문에, `event.target`과 `event.currentTarget`을 비교하는 방법으로 이러한 문제를 해결해줍니다. 아래 코드처럼, Modal의 컨테이너 요소에 `event.target`과 `event.currentTarget`를 비교해주는 함수를 등록해줍니다.

`onClick` 이벤트는, 컨테이너 요소에 등록되어 있기 때문에, modal 창 내부를 클릭하고 콘솔창의 결과 값을 비교해보면, `event.target`과 `event.currentTarget`가 서로 다른 것을 확인할 수 있습니다. 따라서, 컨테이너 요소에 해당하는 부분을 클릭했을 때만 `event.target`과 `event.currentTarget` 가 같아지기 때문에, Modal 창을 제외한 나머지 부분을 클릭했을 때 Modal 창이 닫히게 됩니다.

```js
// Modal.jsx
import './Modal.css'

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
          Modal Close
        </button>
      </div>
    </div>
  )
}
```

완성된 결과물을 아래 코드에서 실행해 볼 수 있습니다.

<iframe src="https://codesandbox.io/embed/reacteseo-modal-cang-jigjeob-guhyeonhagi-hsk8jd?fontsize=14&hidenavigation=1&theme=dark&view=split"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React에서 Modal 창 직접 구현하기"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
