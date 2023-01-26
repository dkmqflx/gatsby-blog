---
date: '2021-04-19'
title: '가상 요소(pseudo element)에 transform 속성을 적용하는 방법'
categories: ['CSS']
summary: '가상 요소(pseudo element)에 transform 속성을 적용하는 방법에 대해서 정리한 글입니다.'
---

아래는 button 태그에 가상요소 `::before`를 사용해서 `ㅡ` 모양의 아이콘을 만들기 위한 코드입니다.

```css
/* css */
.delete__button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: absolute;
  right: 0px;
  top: 0px;
  background-color: tomato;
}

.delete__button::before {
  content: '|';
  color: #fff;
  transform: rotate(90deg);
}
```

<br/>

하지만 코드를 실행시켜보면 `ㅡ` 모양이 아니라 아이콘이 세로인 `|` 모양으로 되어있는 것을 확인할 수 있습니다.

<br/>

<iframe src="https://codesandbox.io/embed/long-morning-h33yhg?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index.html?module=index.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>
<br/>

그 이유는 인라인 요소는 transform 속성을 적용할 수 없는데 가상요소는 인라인 요소이기 때문입니다. `transform: rotate(90deg)` 속성이 적용되지 않았기 때문에 content 속성인 `|` 모양으로 보이게 되는 것입니다.

따라서 `display:block` 또는 `display:inline-block` 으로 해당 요소를 block level로 바꾸어 줍니다.

```css
/* css */
.delete__button::before {
  content: '|';
  color: #fff;
  transform: rotate(90deg);
  display: inline-block;
}
```

<br/>

속성을 block level로 바꾸어주면 아래처럼 아이콘이 `ㅡ` 모양으로 바뀌는 것을 확인할 수 있습니다.

<br/>

<iframe src="https://codesandbox.io/embed/long-morning-h33yhg?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index2.html?module=index2.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="long-morning-h33yhg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
