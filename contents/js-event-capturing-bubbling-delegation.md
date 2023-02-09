---
date: '2020-11-10'
title: 'Event Capturing & Bubbling 그리고 Event delegation'
categories: ['JavaScript']
summary: 'Event Capturing & Bubbling 그리고 Event delegation 대해서 정리한 글입니다.'
---

### Event Bubbling (버블링)

자식 요소부터 발생한 이벤트가 부모 요소까지 전파되는 것을 버블링이라고 합니다. 이러한 버블링이 일어나기 때문에 이유로 부모 요소는 자식 요소에서 발생하는 모든 이벤트를 전달받을 수 있습니다. 이 때 버블링은 부모와 자식 사이에서만 발생하고 형제 요소 사이에는 발생하지 않습니다.
아래 코드에서 이를 확인할 수 있는데, 버튼을 클릭하면 `button`, `three`, `two`, `one` 순으로 출력이 됩니다. 이를 통해서 자식요소에서 발생한 이벤트가 부모 요소로 전달되는 버블링을 확인할 수 있습니다.

```html
<!-- html -->
<body>
  <div id="one">
    <div id="two">
      <div id="three">
        <button>Click</button>
      </div>
    </div>
  </div>
  <script>
    const one = document.querySelector('#one')
    const two = document.querySelector('#two')
    const three = document.querySelector('#three')
    const button = document.querySelector('button')

    one.addEventListener('click', () => {
      console.log('one')
    })

    two.addEventListener('click', () => {
      console.log('two')
    })

    three.addEventListener('click', () => {
      console.log('three')
    })

    button.addEventListener('click', () => {
      console.log(`button`)
    })
  </script>
</body>
```

---

### Event Capturing (캡처링)

캡처링은 버블링과 반대로 특정 요소에서 발생한 이벤트가 부모 요소부터 시작하여 이벤트를 발생시킨 요소까지 도달하는 것을 말합니다. 이벤트를 등록할 때 `capture: true` 옵션을 설정함으로써 캡처링을 구현할 수 있습니다.
아래 코드에서 버튼을 클릭하면 버블링과 반대로 `one`, `two`, `three`, `button` 순으로 출력이 됩니다.

```html
<body>
  <div id="one">
    <div id="two">
      <div id="three">
        <button>Click</button>
      </div>
    </div>
  </div>
  <script>
    const one = document.querySelector('#one')
    const two = document.querySelector('#two')
    const three = document.querySelector('#three')
    const button = document.querySelector('button')

    one.addEventListener(
      'click',
      () => {
        console.log('one')
      },
      {
        capture: true,
      },
    )

    two.addEventListener(
      'click',
      () => {
        console.log('two')
      },
      {
        capture: true,
      },
    )

    three.addEventListener(
      'click',
      () => {
        console.log('three')
      },
      {
        capture: true,
      },
    )

    button.addEventListener(
      'click',
      () => {
        console.log(`button`)
      },
      {
        capture: true,
      },
    )
  </script>
</body>
```

---

### Event currentTarget vs Event target

이벤트 객체에는 `target`과 `currentTarget`이 있습니다. 두 요소의 차이는 아래 코드를 통해서 확인할 수 있습니다.

```html
<!-- html -->
<body>
  <div id="one">
    <div id="two">
      <div id="three">
        <button>Click</button>
      </div>
    </div>
  </div>
  <script>
    const one = document.querySelector('#one')
    const two = document.querySelector('#two')
    const three = document.querySelector('#three')
    const button = document.querySelector('button')

    one.addEventListener('click', () => {
      console.log(`one: ${event.currentTarget},${event.target}`)
    })

    two.addEventListener('click', () => {
      console.log(`two: ${event.currentTarget},${event.target}`)
    })

    three.addEventListener('click', () => {
      console.log(`three: ${event.currentTarget},${event.target}`)
    })

    button.addEventListener('click', () => {
      console.log(`button event1: ${event.currentTarget},${event.target}`)
    })

    button.addEventListener('click', () => {
      console.log(`button event2: ${event.currentTarget},${event.target}`)
    })
  </script>
</body>
```

다음과 같은 코드에서 button을 클릭하면 `button event1`, `button event2`, `three`, `two`, `one` 순서대로 총 4가지가 출력됩니다.

`button event1`, `button event2`가 출력되는 console.log에서는 `currentTarget`과 `target`이 HTMLButtonElement로 동일하지만, `three`, `two`, `one`이 출력되는 console.log를 보면 `currentTarget`은 `HTMLDivElement`, `target`이 `HTMLButtonElement`로 서로 다른 것을 확인할 수 있습니다.

`currentTarget`과 `target`이 다르게 출력되는 이유는 `target`은 이벤트가 발생한 요소를 가르키고, `currentTarget`은 이벤트 핸들러를 등록한 요소를 가르키기 때문입니다.

즉, `one`, `two`, `three`는 각각 div 태그에 이벤트를 등록했기 때문에 `target`과 `currentTarget`이 다르게 출력되는 것입니다. 이처럼 `target`과 `currentTarget`이 다른 것을 통해 해당 요소에서 이벤트가 일어나지 않은 것을 알 수 있습니다.

요소에서 발생한 이벤트를 상위 요소로 전달하지 않기 위해서는 `stopPropagation` 또는 `stopImmediatePropagation` 을 사용할 수 있습니다.

---

### stopPropagation vs stopImmediatePropagation

아래 코드처럼 첫번째 button 태그에 이벤트를 등록할 때 stopPropagation을 사용하면, 해당 요소에서 발생한 이벤트를 상위 요소로 전달하지 않기 때문에 버튼을 클릭하더라도 `button event1`, `button event2` 만 출력이 됩니다

```html
<!-- html -->
<body>
  <div id="one">
    <div id="two">
      <div id="three">
        <button>Click</button>
      </div>
    </div>
  </div>
  <script>
    const one = document.querySelector('#one')
    const two = document.querySelector('#two')
    const three = document.querySelector('#three')
    const button = document.querySelector('button')

    one.addEventListener('click', () => {
      console.log(`one: ${event.currentTarget},${event.target}`)
    })

    two.addEventListener('click', () => {
      console.log(`two: ${event.currentTarget},${event.target}`)
    })

    three.addEventListener('click', () => {
      console.log(`three: ${event.currentTarget},${event.target}`)
    })

    button.addEventListener('click', () => {
      console.log(`button event1: ${event.currentTarget},${event.target}`)
      event.stopPropagation()
    })

    button.addEventListener('click', () => {
      console.log(`button event2: ${event.currentTarget},${event.target}`)
    })
  </script>
</body>
```

만약 상위 요소로 이벤트를 전달하는 것을 막는 것에 더해서 동일한 요소에 등록된 또 다른 이벤트 리스너에 이벤트가 전달되는 것을 방지하고 싶다면, 아래처럼 `stopImmediatePropagation`을 사용하면 됩니다. 버튼을 클릭하면 `button event1` 만 출력되는 것을 확인할 수 있습니다.

```html
<!-- html -->
<body>
  <div id="one">
    <div id="two">
      <div id="three">
        <button>Click</button>
      </div>
    </div>
  </div>
  <script>
    const one = document.querySelector('#one')
    const two = document.querySelector('#two')
    const three = document.querySelector('#three')
    const button = document.querySelector('button')

    one.addEventListener('click', () => {
      console.log(`one: ${event.currentTarget},${event.target}`)
    })

    two.addEventListener('click', () => {
      console.log(`two: ${event.currentTarget},${event.target}`)
    })

    three.addEventListener('click', () => {
      console.log(`three: ${event.currentTarget},${event.target}`)
    })

    button.addEventListener('click', () => {
      console.log(`button event1: ${event.currentTarget},${event.target}`)
      event.stopImmediatePropagation()
    })

    button.addEventListener('click', () => {
      console.log(`button event2: ${event.currentTarget},${event.target}`)
    })
  </script>
</body>
```

이벤트 버블링을 막기 위한 방법으로 `stopPropagation`, `stopImmediatePropagation` 이 두개는 가능한 사용하지 않는 것이 좋은데, 그 이유는 위의 코드에서 button이 클릭되었을 때 다른 요소에서 이벤트와 관련되어있는 일을 처리해야 할 수도 있고 부모 요소에서 특별한 기능을 수행하는 코드가 있을 수 있기 때문입니다.

따라서 부모 요소에 이벤트가 전달되는 것을 막는 대신 `currentTarget`과 `target`에 따른 조건을 설정해주는 방식으로, 특정한 요소에 대한 이벤트 처리를 해줄 수 있습니다.

아래처럼 button의 부모 요소에 `currentTarget`과 `target`을 비교하는 조건문을 추가해줍니다. 그리고 button이 클릭해주면 부모 요소에서는 아무런 console.log도 출력되지 않고 `button event1`, `button event2` 만 출력이 되는 것을 확인할 수 있습니다.

```html
<!-- html -->
<body>
  <div id="one">
    <div id="two">
      <div id="three">
        <button>Click</button>
      </div>
    </div>
  </div>
  <script>
    const one = document.querySelector('#one')
    const two = document.querySelector('#two')
    const three = document.querySelector('#three')
    const button = document.querySelector('button')

    one.addEventListener('click', () => {
      if (event.target !== event.currentTarget) {
        return
      }

      console.log(`one: ${event.currentTarget},${event.target}`)
    })

    two.addEventListener('click', () => {
      if (event.target !== event.currentTarget) {
        return
      }
      console.log(`two: ${event.currentTarget},${event.target}`)
    })

    three.addEventListener('click', () => {
      if (event.target !== event.currentTarget) {
        return
      }
      console.log(`three: ${event.currentTarget},${event.target}`)
    })

    button.addEventListener('click', () => {
      console.log(`button event1: ${event.currentTarget},${event.target}`)
    })

    button.addEventListener('click', () => {
      console.log(`button event2: ${event.currentTarget},${event.target}`)
    })
  </script>
</body>
```

---

### Eveng Delegation (이벤트 위임)

이벤트 위임은 하위 요소에 각각 이벤트 리스너를 등록하지 않고 상위 요소에서 하위 요소의 이벤트들을 제어하는 방식입니다. 부모 요소는 어떠한 자식 요소에서 이벤트가 발생하면 버블링에 의해 이벤트를 전달 받을 수 있기 때문에 자식 요소에서 발생한 이벤트를 처리할 수가 있습니다.

아래는 모든 li 태그에 클릭 이벤트 리스너를 등록해서 li 태그 클릭하면 해당 태그의 텍스트가 출력되는 코드입니다. 이렇게 작성한 코드의 단점으로는 새로운 li 태그가 추가될 때 마다 해당 태그에 이벤트 리스너를 일일이 등록해주어야 한다는 것입니다.

```html
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
    <li>10</li>
  </ul>
  <script>
    const lis = document.querySelectorAll('li')
    lis.forEach(li => {
      li.addEventListener('click', e => {
        console.log(e.target.innerText)
      })
    })
  </script>
</body>
```

이러한 문제를 해결할 수 있는 것이 바로 이벤트 위임입니다. 아래처럼 li 태그의 부모 요소인 ul 태그에 이벤트를 등록함으로써 자식요소에서 발생한 이벤트를 처리할 수 있습니다

```html
<!-- html -->
<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
    <li>8</li>
    <li>9</li>
    <li>10</li>
  </ul>
  <script>
    const ul = document.querySelector('ul')
    ul.addEventListener('click', e => {
      // LI 태그에서 이벤트가 일어난 경우에만 조건문 true
      if (e.target.tagName === 'LI') {
        console.log(e.target.innerText)
      }
    })
  </script>
</body>
```
