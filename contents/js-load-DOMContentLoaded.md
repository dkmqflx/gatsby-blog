---
date: '2021-01-20'
title: 'DOMContentLoaded와 load 이벤트, beforeunload와 unload 이벤트 비교하기'
categories: ['JavaScript']
summary: 'DOMContentLoaded와 load 이벤트에 대해서 정리한 글입니다'
---

### DOMContentLoaded vs load

`DOMContentLoaded` 이벤트의 경우 브라우저의 HTML parsing이 끝난 다음 DOM 트리를 완성하는 즉시 발생합니다. 즉 폰트, 이미지, css 등 리소스가 다운로드 되는 것을 기다리지 않습니다.

`load` 이벤트의 경우에는 DOM 트리를 만드는 게 완성된 이후에도 페이지 안에서 사용되고 있는 모든 리소스가 다운로드가 완료되면 그 때 실행됩니다.

아래 코드를 실행하면 `DOMContentLoaded`, `load` 순으로 출력되는데 이를 통해 `DOMContentLoaded` 이벤트가 먼저 실행되는 것을 확인할 수 있습니다. 따라서 자바스크립트 파일이 어떤 리소스에 대한 처리가 필요 하지 않다면 `DOMContentLoaded` 안에서 동작을 수행하면 사용자가 더 빨리 화면을 볼 수 있다는 장점이 있습니다.

```html
<body>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      console.log('DOMContentLoaded')
    })

    window.addEventListener('load', () => {
      console.log('load')
    })
  </script>
</body>
```

---

### beforeunload vs unload

`beforeunload` 이벤트의 경우 unload 되기 전에 실행되는 이벤트로 사용자가 페이지를 나가기 전에 실행됩니다.

`unload` 이벤트의 경우에는 사용자가 페이지를 떠날 때, 즉 모든 리소스들이 unload 될 때 실행됩니다

```html
<head> </head>
<body>
  <script>
    window.addEventListener('beforeunload', () => {
      console.log('beforeunload')
    })

    window.addEventListener('unload', () => {
      console.log('unload')
    })
  </script>
</body>
```

`beforeunload` 이벤트의 사용자가 페이지를 나가기 전에 실행되기 때문에, 페이지를 벗어나기 전에 사용자가 입력한 정보를 저장하지 않은 경우, 알림을 주는 용도로 사용할 수 있습니다.

```html
<head> </head>
<body>
  <script>
    window.addEventListener('beforeunload', () => {
      return alert('입력한 정보가 저장되지 않았습니다.')
    })
  </script>
</body>
```
