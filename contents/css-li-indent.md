---
date: '2020-08-16'
title: 'css reset이 적용된 li 태그 안에서 들여쓰기 하는 법'
categories: ['CSS']
summary: 'css reset이 적용되었을 때 li 태그 안에서 들여쓰기 하는 방법에 대해서 정리한 글입니다.'
---

css reset을 사용해서 margin이나 padding을 초기화 시키고 나면 그 이후에 `li` 태그에 작성한 내용이 생각대로 화면에 표시가 되지 않는 경우가 있습니다.
예를들어 아래처럼 `<ol>`태그와 `<li>` 태그에 `margin`과 `padding` 을 `0`으로 설정하고 나면, 아래처럼 `li` 태그의 마커가 모두 보이지 않고 일부분만 보이게 됩니다.

<br/>

<iframe src="https://codesandbox.io/embed/romantic-lovelace-h38yq2?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index1.html?module=index.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="romantic-lovelace-h38yq2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>
<br/>

만약 `list-style-position` 값을`inside` 로 설정하는 경우에는 마커가 보이지만, 스크린의 크기에 따라 두번째 줄 부터 들여쓰기가 제대로 적용되지 않는 것을 확인할 수 있습니다

<br/>

<iframe src="https://codesandbox.io/embed/romantic-lovelace-h38yq2?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index2.html?module=index2.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="romantic-lovelace-h38yq2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<br/>
<br/>

이러한 문제를 `text-indent`와 `padding-left` 속성을 사용해서 이러한 문제를 해결할 수 있습니다.
`text-indent` 속성은 첫 줄의 들여쓰기를 위한 속성으로 다음과 같이 속성을 지정하면, `padding-left` 때문에 모든 줄의 왼쪽에서 패딩을 가져야 합니다
하지만 `text-indent` 때문에 첫줄은 `-20px`만큼 padding을 가지게 됩니다
따라서 `text-indent`와 `padding-left` 속성을 변경해주면 아래처럼 두번째 줄 부터 들여쓰기가 되는 것을 확인할 수 있습니다

<br/>

<iframe src="https://codesandbox.io/embed/romantic-lovelace-h38yq2?fontsize=14&hidenavigation=1&theme=dark&view=split?initialpath=index3.html?module=index3.html"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="romantic-lovelace-h38yq2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## Reference

- [MDN web docs - list-style-position](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position)
- [MDN web docs - text-indent](https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent)
