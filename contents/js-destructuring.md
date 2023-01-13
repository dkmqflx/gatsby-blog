---
date: '2021-09-25'
title: '배열 안의 객체에서 필요한 값만 destructuring 해서 구하는 방법'
categories: ['JavaScript']
summary: '배열 안의 객체에서 필요한 값만 destructuring 해서 구하는 방법에 대해서 '
---

### destructuring (구조 분해 할당)

destructuring은 ES6에서 등장한 문법으로 배열 또는 객체에 있는 값을 얻어올 때 유용하게 사용할 수 있습니다. 다음과 같이 배열 안의 객체가 있을 때, destructuring을 통해 필요한 값만 얻어올 수 있다

```javascript
const data = [{ date: '2021-04-17', id: 5, id2: 11 }]

const [{ date }] = data

console.log('date: ', date) // "2021-04-17"
```

destructuring은 다음과 같은 동작을 통해 값을 얻게 됩니다

1. `date`라는 key에 해당하는 값을 얻어오는 객체 destructuring이 일어납니다.

2. 이 값이 `date`라는 배열 안의 변수에 할당됩니다,

즉, 객체의 key 값을 이용해서 해당 객체의 값을 얻어올 수 있기 때문에 객체에서 필요한 값을 얻을 수 있는 것입니다.

그리고 아래처럼 배열안에 여러개의 아이템이 있는 경우 아래처럼 특정한 아이템의 값만 얻어올 수 있다

```javascript
const data = [
  { date: '2021-04-17', id: 5, id2: 11 },
  { date: '2021-04-21', id: 3, id2: 3 },
  { date: '2021-04-29', id: 2, id2: 21 },
  { date: '2021-05-11', id: 6, id2: 19 },
  { date: '2021-05-21', id: 7, id2: 18 },
  { date: '2021-06-21', id: 9, id2: 18 },
]

const [{ date }] = data.filter(_data => _data.id === 7)

console.log('date: ', date) // 2021-05-21
```
