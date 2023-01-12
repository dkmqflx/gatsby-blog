---
date: '2020-12-01'
title: 'window size와 브라우저 좌표를 구하는 방법'
categories: ['JavaScript']
summary: '자바스크립트 클래스와 this 바인딩에 대해서 정리한 글입니다.'
---

window 객체에는 화면의 사이즈를 구할 수 있는 여러가지 객체가 제공됩니다.

### window.screen.width , window.screen.height

브라우저의 바깥까지 모두 포함한 사용자의 모니터의 사이즈를 구할 수 있습니다

```javascript
window.screen.width
window.screen.height
```

### window outer

브라우저의 URL와 Tab을 포함한 전체적인 브라우저의 사이즈를 나타냅니다

```javascript
window.outerWidth
window.outerHeight
```

### window inner

브라우저의 URL와 Tab을 제외한 브라우저의 사이즈를 나타냅니다. 그리고 스크롤이 있는 경우 스크롤에 해당하는 부분도 포함합니다.

```javascript
window.innerWidth
window.innerHeight
```

---

브라우저 이외에도 문서의 요소에 대한 위치를 구할 수 있습니다.

### documentElement.clientWidth, documentElement.clientheight

브라우저의 URL와 Tab을 제외한 화면상에 나타내는 브라우저의 사이즈를 나타냅니다. 이 때 스크롤이 있는 경우에도 스크롤 아래 화면에 보이지 않는 부분은 사이즈에 포함시키지 않습니다

```javascript
document.documentElement.clientWidth
document.documentElement.clientheight
```

### getBoundingClientRect()

요소의 width, height, left, top 정보를 알 수 있습니다. left는 x축, top은 y축과 같이 왼쪽에서 얼마나 떨어져 있는지, 위쪽에서 얼마나 떨어져 있는지를 나타냅니다. 하지만 right와 bottom은 css에서 right와 bottom을 구하는 방법과 다릅니다.
css에서는 right는 오른쪽에서 얼마나 떨어져 있는지, 그리고 bottom이 아래쪽에서 얼마나 떨여져있는지를 나타내지만 `getBoundingClientRect`에서는 right는 가장 왼쪽을 기준으로 얼마나 떨어져 있는지 그리고 bottom은 위를 기준으로 얼마나 떨어져 있는지를 나타냅니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #rect {
        width: 200px;
        height: 200px;
        background: yellow;
      }
    </style>
  </head>
  <body>
    <div id="rect"></div>
    <script>
      const rect = document.querySelector('#rect')
      const clientRect = rect.getBoundingClientRect()
      console.log(
        `top ${clientRect.top} left ${clientRect.left} right ${clientRect.right} bottom ${clientRect.bottom}`,
      )
    </script>
  </body>
</html>
```

### client X, Y vs page X, Y

clientX, Y는 브라우저에서(URL과 Tab을 제외한) x와 y가 얼마나 떨어져 있는지를 나타냅니다.
pageX, Y는 화면상에 보이는 브라우저를 기준으로 한 좌표가 아니라 페이지 자체에서 떨어져 있는 x와 y를 의미합니다. 이 때 페이지는 우리 눈에 보이지 않는 제일 위의 지점일 수도 있습니다.
예를 들어, 문서의 스크롤 아래의 부분에서 click 이벤트를 발생한 다음 pageY 구하게 되면, 화면에서 보이는 창에서 y만큼 떨어진 좌표를 구하는 것이 아니라 페이지 시작 부분에서 y 값을 구하게 됩니다.

```javascript
const coordinates = e => {
  console.log(`client: ${e.clientX}, ${e.clientY} `)
  console.log(`page: ${e.pageX}, ${e.pageY} `)
}
```
