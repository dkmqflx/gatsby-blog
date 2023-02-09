---
date: '2021-08-11'
title: 'innerHTML, innerText, textContext 비교하기'
categories: ['JavaScript']
summary: 'innerHTML, innerText, textContext에 대해서 정리한 글입니다.'
---

### innerHTML

innerHTML을 사용하면 요소내에 포함 된 HTML 또는 XML 마크업을 모두 가져올 수 있습니다. 아래 코드를 실행하면 section 안에 있는 태그를 포함한 모든 요소가 출력되는 것을 확인할 수 있습니다.

```html
<body>
  <section id="section">
    <h3>section title</h3>
    <p>section paragraph</p>
  </section>
  <script>
    const section = document.querySelector('#section')
    console.log(section.innerHTML)
  </script>
</body>
```

innerHTML을 사용하면 아래처럼 템플릿 리터럴을 사용해서 HTML 요소를 추가할 수 있습니다.

```html
<body>
  <section id="section"></section>

  <script>
    const section = document.querySelector('#section')

    section.innerHTML = `
        <h3 class='title'>title</h3>
        <p>paragraph</p>
      `
  </script>
</body>
```

다만 새로운 요소를 추가하거나 업데이트하는 경우처럼, 동적으로 요소가 변경되는 경우에는 템플릿 리터럴으로 코드를 작성하면 다시 DOM을 생성하고 Render tree를 그리는 모든 과정이 일어나게 됩니다. 따라서 한번 요소가 생성 된 이후 업데이트가 일어나지 않는다면 템플릿 리터럴로 처리할 수 있지만, 부분적으로 변경이 일어나는 경우 아래 코드처럼 createElement를 사용해서 요소를 만들고 속성을 추가하는 방식으로 처리해주는 것이 좋습니다.

아래는 위에서 템플릿 리터럴로 작성된 코드를 createElement를 사용해서 구현한 코드입니다.

```html
<body>
  <section id="section"></section>

  <script>
    const section = document.querySelector('#section')

    const h3 = document.createElement('h3')
    h3.setAttribute('class', 'title')
    h3.textContent = 'title'

    const paragraph = document.createElement('div')
    paragraph.textContent = 'paragraph'
    section.append(h3)
    section.append(paragraph)
  </script>
</body>
```

---

### innerText

innerText은 사용자가 읽을 수 있는 텍스트 값을 가져옵니다. 따라서 아래 코드를 실행했을 때 `style` 태그나 `display:none`으로 설정한 요소는 출력되지 않는 것을 확인할 수 있습니다.

```html
<body>
  <section id="section">
    <style>
      #section {
        color: red;
      }
    </style>

    <h3>section title</h3>
    <p>
      section paragraph sentence1 <br />
      ection paragraph sentence 2
    </p>
    <span style="display: none">hide span</span>
  </section>
  <script>
    const section = document.querySelector('#section')

    const sectionInnerText = section.innerText

    console.log(sectionInnerText)
  </script>
</body>
```

---

### textContent

textContent 같은 경우에는 `<script>`나 `<style>`를 포함해서 모든 노드의 텍스트를 반환합니다. 따라서 아래 코드를 실행하면 innerText와 달리 `style` 태그와 `display:none`으로 설정한 요소가 모두 출력되는 것을 확인할 수 있습니다.

```html
<body>
  <section id="section">
    <style>
      #section {
        color: red;
      }
    </style>
    <h3>section title</h3>
    <p>
      section paragraph sentence1 <br />
      section paragraph sentence 2
    </p>
    <span style="display: none">hide span</span>
  </section>
  <script>
    const section = document.querySelector('#section')

    const sectiontextContent = section.textContent

    console.log('sectiontextContext', sectiontextContent)
  </script>
</body>
```

---

### innerHTML vs textContent

innerHTML 속성은 문자열 내에서 발견된 HTML 요소를 실제 DOM 노드로 반환하는 반면 textContent는 텍스트 노드를 생성하는데만 사용이 가능합니다. 따라서 HTML 요소를 포함하고 있는 문자열을 textContent에 전달하면 단순히 텍스트로만 전달됩니다. 아래 코드를 통해서 이를 확인할 수 있습니다.

```html
<!-- innerHTML 사용 -->
<body>
  <section id="section"></section>
  <script>
    const section = document.querySelector('#section')

    section.innerHTML = '<span>section</span>'
    // span 태그가 section 태그 안에 추가 됩니다.
  </script>
</body>
```

```html
<!-- textContent 사용 -->
<body>
  <section id="section"></section>
  <script>
    const section = document.querySelector('#section')

    section.textContent = '<span>section</span>'
    // span 태그가 추가되는 것이 아니라 '<span>section</span>' 부분이 문자열로 section 태그에 추가됩니다.
  </script>
</body>
```

innerHTML은 XSS에 취약하다는 단점이 있는데, XSS(Cross-Site Scripting)이란 클라이언트 사이드에서 웹사이트에 악성 스크립트를 주입하는 것을 말합니다. 이러한 문제는 HTML5에서 해결되어 아래처럼 `script` 태그를 직접적으로 innerHTML의 값으로 사용할 수 없습니다.

```html

<body>
  <section id="section"></section>

  <script>
    const xss = `<script>alert('xss')</script>`;
    section.innerHTML = xss
  </script>
</body>

```

하지만 이를 우회하는 방법이 있는데, 아래처럼 `script` 태그를 사용하지 않고 템플릿 리터럴로 선언된 버튼 태그의 onclick 이벤트에 등록된 alert 함수내에 코드를 삽입하는 방식으로 자바스크립트 코드를 실행할 수 있습니다.

```html
<body>
  <section id="section"></section>

  <script>
    const section = document.querySelector('#section')

    const h3 = document.createElement('h3')

    const xss = `<button onclick=alert('xss!')>click me!</button>`

    section.innerHTML = xss
  </script>
</body>
```

따라서 코드 내에서 innerHTML을 사용하는것은 괜찮지만, 사용자에게 입력받은 데이터를 바로 innerHTML을 이용해서 설정하는것은 XSS 공격에 취약하기 때문에 사용자에게 입력받은 데이터는 innerHTML로 설정하지 않는 것이 좋습니다. 대신 주어진 요소를 텍스트 노드를 생성하기 때문에 XSS 공격의 위험이 없는 textContent로 처리하는 것이 안전합니다
