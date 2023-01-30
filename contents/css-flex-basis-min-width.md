---
date: '2021-04-24'
title: 'flex-basis가 적용되지 않을 때 해결하는 방법'
categories: ['CSS']
summary: 'flex-basis가 적용되지 않을 때 해결하는 방법
에 대해서 정리한 글입니다.'
---

아래는 `display: flex` 속성이 적용된 flex item을 `flex-basis` 속성을 사용해서 크기를 조절하는 코드입니다.

<br/>

<iframe src="https://codesandbox.io/embed/boring-fog-gksdxi?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index.html?module=index.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="boring-fog-gksdxi"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>

`flex-basis` 값에 따라 input 창의 크기가 바뀌는데, 어느 정도 값이 작아지면 input 창의 크기가 변하지 않는 것을 확인할 수 있습니다.
예를들어 50%, 30%, 20% 로 크기를 조절 하면 input 창의 크기가 줄어들지만 어느 정도 값이 작아지면 더 이상 Input 크기가 줄어들지 않습니다.

이러한 문제가 발생하는 이유는 flex item은 기본적으로 `min-width: auto`, `min-height: auto` 으로 설정되어 있기 때문입니다.
따라서 `flex-basis` 값이 작아지더라도 flex item의 content의 크기보다 작아질 수 없기 때문에 input 창의 크기가 변하지 않는 것입니다.

<br/>

이를 해결하는 첫번째 방법으로는 flex item에 `min-width`을 `0`으로 직접 설정하는 것입니다. <br/>
아래처럼 `min-width`을 `0`를 설정해주면, 최소 너비가 contents에 맞춰지지 않았기 때문에 `flex-basis` 값을 줄일 때마다 Input 창의 크기 또한 계속해서 줄어드는 것을 확인할 수 있습니다.

<br/>

<iframe src="https://codesandbox.io/embed/boring-fog-gksdxi?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index2.html?module=index2.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="boring-fog-gksdxi"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>
<br/>

또 다른 방법으로는 `overflow: hidden` 속성을 사용하는 것입니다.
flex item은 기본적으로는 `overflow: visible` 속성을 가지기 때문에, `overflow: hidden` 으로 설정한 다음 `flex-basis` 값을 줄이면 input 창의 크기도 함께 줄어드는 것을 확인할 수 있습니다.

<br/>

<iframe src="https://codesandbox.io/embed/boring-fog-gksdxi?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index3.html?module=index3.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="boring-fog-gksdxi"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
