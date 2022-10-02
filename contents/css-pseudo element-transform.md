---
date: '2020-08-16'
title: '가상 요소(pseudo element)에 transform 속성을 적용하는 방법'
categories: ['CSS']
summary: '가상 요소(pseudo element)에 transform 속성을 적용하는 방법에 대해서 정리한 글입니다.'
---

- 아래 코드는 button태그에 가상요소 `::before`를 사용해서 `ㅡ` 모양의 아이콘을 만들기 위한 코드입니다.

- 하지만 코드를 실행시켜보면, `ㅡ` 모양의 아이콘이 세로로 `|` 모양으로 되어있는 것을 확인할 수 있습니다.

<iframe src="https://codesandbox.io/embed/long-morning-h33yhg?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index.html?module=index.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

- 이러한 문제를 해결하기 위해 아래에 `transform: rotate(90deg)` 속성을 추가해주어도 rotate가 일어나지 않습니다

- 그 이유는 Inline 요소는 transform 속성을 적용할 수 없는데, 가상요소는 Inline 요소이기 때문입니다

- 따라서, `display:block` 또는 `display:inline-block` 으로 해당 요소를 block level로 바꾸어 줍니다

- 그리고 block level로 바꾸어주면 `ㅡ` 모양으로 바뀌는 것을 확인할 수 있습니다.

- 해당 요소의 절반을 다시 위로 이동시켜 수직으로 가운데 올 수 있도록 transform 속성을 사용해서 정렬시켜줍니다

<iframe src="https://codesandbox.io/embed/long-morning-h33yhg?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index2.html?module=index2.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## Reference

- [css rotate a pseudo :after or :before content:“”](https://stackoverflow.com/questions/9779919/css-rotate-a-pseudo-after-or-before-content)
- [Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
