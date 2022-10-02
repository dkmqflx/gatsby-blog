---
date: '2021-04-24'
title: 'flex-basis가 적용되지 않을 때 해결하는 방법'
categories: ['CSS']
summary: 'flex-basis가 적용되지 않을 때 해결하는 방법
에 대해서 정리한 글입니다.'
---

- 아래는 `flex-basis` 속성을 사용해서 flex item의 크기를 조절하는 코드입니다.

<iframe src="https://codesandbox.io/embed/boring-fog-gksdxi?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index.html?module=index.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="boring-fog-gksdxi"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

- `flex-basis`로 값을 조정하다 보면 어느 정도 값이 아래로 작아지면 input의 크기가 변하지 않는 것을 확인할 수 있습니다.

- 즉, 50%, 30%, 20% 로 크기를 조절 하면 줄어드는 것을 확인할 수 있지만
  어느 정도 값이 작아지면 더 이상 Input 크기가 줄어들지 않는 것을 확인할 수 있습니다.

- 그 이유는 flex item은 item의 크기에 따라 default 값으로 `min-width: auto`, `min-height: auto` 값을 가지기 때문입니다.

- 즉, `flex-basis` 속성을 작게 하더라도 `min-width: auto`, `min-height: auto`로 설정된 flex item의 크기보다 작아질 수 없기 때문에 input 태그의 크기가 변하지 않는 것입니다.

- 이를 해결하는 첫번째 방법으로는 `min-width`을 `0`으로 직접 설정하는 방식입니다.

- 아래처럼 `min-width`을 `0`를 설정해주면, `flex-basis` 값을 줄일 때 Input의 크기 또한 계속해서 줄어드는 것을 확인할 수 있습니다.

<iframe src="https://codesandbox.io/embed/boring-fog-gksdxi?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index2.html?module=index2.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="boring-fog-gksdxi"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

- 또 다른 방법으로는 기본적으로는 flex item은 `overflow:visible`이므로, `overflow:hidden` 속성을 사용해서 해결할 수 있습니다.

<iframe src="https://codesandbox.io/embed/boring-fog-gksdxi?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index3.html?module=index3.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="boring-fog-gksdxi"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## Reference

- [Why don't flex items shrink past content size?](https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size)
- [HTML inputs ignore flex-basis CSS property](https://stackoverflow.com/questions/46684636/html-inputs-ignore-flex-basis-css-property)
