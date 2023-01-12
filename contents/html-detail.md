---
date: '2020-11-23'
title: 'detail, summary 태그 사용하기'
categories: ['HTML']
summary: 'detail, summary 태그의 사용 방법에 대해서 정리한 글입니다'
---

### details, summary

`details` 태그는 유저가 클릭 했을 때 정보를 보여주거나 숨기기 위해서 사용할 수 있는 태그입니다. 그리고 사용자에게 보여지는 요약 정보를 `details` 태그 안의 `summary` 태그 안에 넣어줍니다.

```html
<details id="details">
  <summary>클릭 전 보여질 내용</summary>
  <span>클릭 후 보여질 내용</span>
</details>
```

그리고 details 태그에는 open 속성이 있어서 유저의 클릭 여부에 따라서 스타일을 변경하는데 사용할 수 있습니다.

```css
#details[open] {
  background-color: gray;
}
```

아래는 `details` 태그와 `summary` 태그를 사용하는 예시로, `detail 1 `옆에 나타나는 label을 클릭해서 `open` 상태가 되면 `p` 태그 안에 내용이 사용자에게 보여집니다. 그리고 `detail 1 `옆에 나타나는 label을 다시 클릭해서 해당 내용을 숨길 수도 있다

```html
<details>
  <summary>detail 1 summary</summary>
  <p>detail1 - paragraph</p>
</details>
```

`summary` 태그 안에는 `p` 태그 이외에도 다양한 태그를 사용할 수 있는데, 아래처럼 `li` 태그처럼 목록을 나타나는 태그와도 함께 사용할 수 있습니다.

```html
<details ontoggle="onToggle()">
  <summary>list</summary>
  <ol>
    <li>li 1</li>
    <li>li 2</li>
    <li>li 3</li>
    <li>li 4</li>
    <li>li 5</li>
  </ol>
</details>
```

공식 문서에는 다음과 같이 `detail` 태그로 만들어진 위젯이 `toggle` 되어 open 상태일 때 정보가 보여진다고 설명하고 있습니다 .따라서 `toggle` 이벤트와 함께 `details` 태그를 사용할 수 있습니다.

<blockquote>
  The HTML Details Element  <u>details</u> creates a disclosure widget in which information is visible only when the widget is toggled into an "open" state. A summary or label must be provided using the <u>summary</u> element.
</blockquote>

아래는 `detail` 태그에 `ontoggle` 이벤트 핸들러를 등록한 것으로, `detail 1 `옆에 나타나는 label을 클릭할 때마다 `ontoggle` 이벤트가 발생해서 `toggle!` 텍스트가 콘솔창에서 출력되는 것을 확인할 수 있습니다,

```html
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="./index.css" />
  <script>
    const onToggle = () => {
      console.log('toggle!')
    }
  </script>
</head>
<body>
  <div>
    <details ontoggle="onToggle()">
      <summary>detail 1</summary>
      <span>detail1 - span</span>
    </details>
  </div>
</body>
```
