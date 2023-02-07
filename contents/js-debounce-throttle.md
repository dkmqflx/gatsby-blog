---
date: '2022-02-11'
title: 'Debounce와 Throttle 구현하기'
categories: ['JavaScript']
summary: 'Debounce와 Throttle를 구현하는 방법에 대한 글입니다'
---

## Debounce

Debounce는 이벤트를 그룹화해서 일정 시간이 지난 후 하나의 이벤트만 발생하도록 하는 방법으로, 그룹화 된 이벤트에서 가장 첫번째 혹은 가장 마지막에 실행된 함수를 처리하기 위해 사용됩니다.

검색 기능을 구현하는 경우 Debounce를 유용하게 사용할 수 있습니다. <br/>
아래는 input 태그를 통해서 사용자가 검색어를 입력받아 서버로 요청하는 코드입니다.

```js
const input = document.querySelector('input')

input.addEventListener('input', e => {
  console.log('이벤트 발생', e.target.value)

  // 서버로 요청
  // ...
})
```

만약 사용자가 날씨라는 검색어를 입력한다고 했을 때, ㄴ, ㅏ, ㄹ, ㅆ, ㅣ 처럼 글자 하나를 입력 할 때 마다 서버로 요청이 전달됩니다. 이러한 방식은 비용이 많이 발생한다는 단점이 있습니다.

이 때 Debounce를 사용해서 이러한 문제를 해결할 수 있습니다..

```js
// Debounce
const input = document.querySelector('input')

const debounce = (callback, wait) => {
  let timer

  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      callback(...args)
    }, wait)
  }
}

input.addEventListener(
  'input',
  debounce(e => {
    console.log('이벤트 발생', e.target.value)

    // 서버로 요청
    // ...
  }, 3000),
)
```

debounce 함수가 동작하는 과정은 다음과 같습니다.

1. debounce 함수에 콜백함수와 마지막 이벤트 발생 후 기다리는 시간 wait를 전달해준다.
2. setTimeout에 전달한 콜백함수를 전달해주고 wait가 지나면 콜백함수가 실행된다.
3. wait 이전에 이벤트가 발생하는 경우에는 clearTimeout(time)를 실행해서 이전에 있던 setTimeout 함수를 제거해주고 다시 wait 만큼 기다리는 setTimeout에 콜백함수를 등록한다
4. 마지막 이벤트가 발생하고 나서 지정된 시간동안 이벤트가 추가적으로 발생하지 않으먼 callback 함수가 실행된다

코드를 실행해보면 이전과 달리 글자 하나를 입력할 때 마다 이벤트가 발생하는 것이 아니라, 마지막 입력이 발생하고 3초 후에 이벤트가 실행되는 것을 확인할 수 있습니다.

<br/>

---

## Throttle

Throttle은 이벤트를 일정한 주기마다 발생하도록 하는 방법으로 scroll 이벤트를 처리할 때 유용하게 사용할 수 있습니다.

scroll 이벤트의 경우 사용자가 scroll를 올리거나 내릴 때 마다 이벤트가 발생합니다. 따라서 scroll 이벤트가 발생할 때 마다 복잡한 작업이 실행된다면 사용자가 scroll을 올리거나 내릴 때 마다 해당 작업이 실행되어 버벅거리는 화면을 볼 수도 있습니다. 이 때 Throttle를 사용해서 정해진 시간 내에 발생하는 이벤트 실행 횟수를 제한함으로써 문제를 해결할 수 있습니다.

아래는 Throttle을 사용하지 않고 scroll 이벤트를 등록한 코드로, 스크롤을 할 때 마다 이벤트가 발생합니다

```js
document.addEventListener('scroll', () => {
  console.log('이벤트 발생')
})
```

Throttle을 사용해서 일정한 시간 내에 한번의 이벤트만 발생하도록 처리할 수 있습니다.

```js
// Throttle
const throttle = (callback, wait) => {
  let waiting = false

  return (...args) => {
    if (!waiting) {
      callback(...args)
      waiting = true

      setTimeout(() => {
        waiting = false
      }, wait)
    }
  }
}

document.addEventListener(
  'scroll',
  throttle(() => {
    console.log('이벤트 발생')
  }, 3000),
)
```

throttle 함수가 동작하는 과정은 다음과 같습니다.

1. throttle 함수에 콜백함수와 이벤트를 기다리는 시간 wait를 전달해준다.
2. 처음 waiting값이 false이기 때문에 callback 함수가 실행이 되고 waiting 값은 다시 true가 된다
3. waiting 값이 true이기 때문에 스크롤을 해도 이벤트가 발생하지 않는다.
4. wait가 끝나고 나면 waiting 값은 다시 true가 되기 때문에 다시 스크롤을 하면 이벤트가 발생한다
