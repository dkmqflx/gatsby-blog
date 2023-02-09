---
date: '2020-09-20'
title: '자바스크립트 클래스와 this 바인딩'
categories: ['JavaScript']
summary: '자바스크립트 클래스와 this 바인딩에 대해서 정리한 글입니다.'
---

아래 코드는 버튼에 이벤트 리스너를 등록하고 버튼을 클릭할 때 마다 `number` 클래스의 숫자를 출력하는 코드입니다. 하지만 버튼을 클릭해도 이벤트가 작동하지 않고 `Cannot read properties of undefined (reading 'innerText')`라는 에러 메시지가 발생하는데 그 이유는 자바스크립트에서 this 바인딩은 동적으로 결정되기 때문입니다.

즉, 자바스크립트에서는 누가 this를 호출하느냐에 따라 this가 달라집니다. 따라서 어떤 클래스 안에 있는 함수를 다른 콜백으로 인자로 전달할 때 `class` 정보는 함께 전달되지 않기 때문에 에러 메세지가 발생합니다.

<iframe src="https://codesandbox.io/embed/cool-ben-z8gwty?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index.html?module=index.js"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

console.log의 인자로 this를 전달해서 `console.log(this)`로 바꿔 `this` 값을 출력하면 출력하면 `<button class="button">button</button>`이 출력되는 것을 확인할 수 있는데 이를 통해 `onClick` 함수 안의 `this`는 이 클래스 객체를 가르키지 않는다는 것을 알 수 있습니다.

자바스크립트에서 함수를 누군가에게 전달해 줄 때는 클래스 정보가 무시되기 때문에 함수를 클래스와 바인딩을 해주어야 합니다.

<br/>

---

### bind 함수 사용하기

함수를 클래스와 바인딩하는 방법으로는 `bind` 함수를 사용하는 방법이 있습니다. 다음과 같이 `bind` 함수를 사용해서 함수에 객체를 바인딩해주면 `this`가 `Field` 클래스가 되기 때문에, 버튼을 클릭하면 `Field` 클래스의 `this.number` 안의 값이 출력됩니다.

<iframe src="https://codesandbox.io/embed/boring-frog-cf3p7z?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex2.js&theme=dark&view=split?initialpath=index2.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>

---

### 화살표 함수 (Arrow Function)

또 다른 방법으로는 화살표 함수를 사용할 수 있습니다. 아래처럼 화살표 함수 안에 실행하고자 하는 함수를 넣어 콜백 함수로 전달하면 화살표 함수에는 `this`가 없기 때문에, 스코프 체인을 따라서 `this`를 찾게 됩니다. 따라서 `this`가 `Field` 클래스가 되고, onClick 함수의 `this`는 함수가 선언된 렉시컬 스코프를 따라 `Field` 클래스가 되므로 `this.number`의 숫자가 출력 됩니다.

<br/>

<iframe src="https://codesandbox.io/embed/boring-frog-cf3p7z?fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex3.js&theme=darkview=split?initialpath=index3.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
