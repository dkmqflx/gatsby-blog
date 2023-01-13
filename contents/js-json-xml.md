---
date: '2022-12-18'
title: 'JSON과 XML'
categories: ['JavaScript']
summary: 'JSON과 XML에 대해서 정리한 글입니다.'
---

### JSON (JavaScript Object Notation)

JSON(JavaScript Object Notation)은 Javascript 객체 문법으로 구조화된 데이터를 표현하기 위한 포맷으로 key-value 형태로 되어 있습니다. 텍스트로 이루어져 있으므로 읽기 쉽다는 장점이 있습니다.

```js
{
  "type": "json",
}
```

JSON 데이터는 클라이언트와 서버 간의 HTTP 통신에 사용될 수 있는데 클라이언트는 서버에 데이터를 전달 할 때 직렬화(serialization)를 해준다음 전달해주, 서버에서 데이터를 전달받을 때는 역직렬화(deserialization)를 해서 데이터를 사용할 수 있습니다.

```js
const obj = {
  type: 'object',
}

// 직렬화
const serializedJson = JSON.stringify(obj)
console.log(serializedJson) // '{"type":"object"}'

// 역직렬화
const deSerializedJson = JSON.parse(serializedJson)
console.log(deSerializedJson) // {type: 'object'}
```

이 때 주의할 점은 JSON에는 undefined, 함수, symbol 같은 것들을 포함이 되지 않습니다. 그리고 Date 객체를 사용할 때도 직렬화 과정에서 string으로 변환되기 때문에 다시 역직렬화를 하더라도 string 타입입니다. 따라서 Date 객체에서 사용할 수 있던 함수를 사용할 수 없게 됩니다.

아래 코드를 실행해보면 undefined를 값으로 가지는 name, Symbol을 값으로 가지는 symbol, 함수를 값으로 가지는 foo 가 없는 것을 확인할 수 있습니다. date 또한 string이 된 것을 확인할 수 있습니다.

```js
const obj = {
  type: 'object',
  name:undefined
  date: new Date(),
  symbole: Symbol('symbol'),
  foo: () => {
    console.log('foo')
  },
}

const json = JSON.stringify(obj)
console.log(json) // {"type":"object","date":"2023-01-13T03:09:07.445Z"}

```

마지막으로 JSON은 '프로그래밍 언어와 플랫폼에 독립적이다.'라는 특징이 있습니다. 예를 들어 클라이언트에서는 자바스크립트를 사용하고 서버에서는 파이썬을 사용한다고 할 때, JSON을 처리할 수 있는 함수가 각각의 언어에 있기 때문에 서로 다른 언어를 사용하고 있지만 데이터를 주고 받을 수가 있게 되는 것입니다.

---

### XML (Extensible Markup Language)

XML은 열린 태그 닫힌 태그로 이루어진 구조의 데이터를 의미합니다. xml 옆에 version과 encoding을 작성하는데 이 부분을 프롤로그라고 합니다. 태그가 정해져 있는 HTML과 달리 XML은 태그가 정해져 있지 않습니다. 그리고 가장 최상위 태그는 아래 코드의 `Data` 처럼 하나만 사용이 가능합니다.

```xml

<?xml version="1.0" encoding="UTF-8"?>
  <Data>
    <First>
      <name>first</name>
      <Number>1</Number>
    </First>
    <Second>
      <name>second</name>
      <Number>2</Number>
    </Second>
  </Data>

```

xml이 사용되는 대표적인 예시가 sitemap.xml입니다. SEO (Searh Engine Optimization)을 위해서는 sitemap.xml가 필수적입니다. 구글 사이트를 예로 들면, 구글에 크롤링 봇이 있는데 이 봇이 사이트를 찾아다니면서 사이트에 대한 정보를 가공해서 구글 DB 안에 insert 하게 됩니다. 그러면 DB안에 있는 정보를 기반으로 해서 구글은 사용자가 어떤 것을 검색했을 때 그에 맞는 결과를 화면에 보여줍니다. 그런데 이 크롤링 봇이 사이를 찾아다니면서 모든 정보를 수집할 수 있겠지만 잘 안되는 경우가 발생할 수 있습니다. 하지만 sitemap.xml을 최상단에 선언해 놓으면 크롤링 봇이 이 사이트에 대한 페이지를 빠짐없이 크롤링해서 DB에 저장할 수 있게 됩니다. 사이트가 매우 큰 경우 크기로 인해 웹 크롤러가 신규 또는 최근에 업데이트 된 웹 사이트를 지나칠 수 있고 처음 사이트를 접속했을 때 이 사이를 저 사이트로 보내줄 수 있는 링크가 종속적으로 연결되어 있으면 잘 되는데 연결되어 있지 않으면 크롤링이 잘 못할 수도 있다. 이러한 것을 방지하는 것이 sitemap.xml의 역할입니다

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://www.example.com/foo.html</loc>
    <lastmod>2018-06-04</lastmod>
</url> <url>
    <loc>http://www.example.com/abc.html</loc>
    <lastmod>2018-06-04</lastmod>
  </url>
</urlset>
```

XML과 JSON과 비교해보면 XML같은 경우 닫는 태그가 필요하기 때문에 JSON 보다 글자수가 더 많아져서 상대적으로 더 무겁습니다. 또한 자바스크립트 객체로 변환할 때도 JSON의 경우 `JSON.stringfy`, `JSON.parse`을 사용해서 간편하게 처리할 수 있지만 XML의 경우 더 복잡하다는 단점이 있습니다.
