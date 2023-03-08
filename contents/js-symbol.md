---
date: '2021-10-16'
title: 'Symbol의 특징과 사용하는 방법'
categories: ['JavaScript']
summary: 'Symbol에 대해서 정리한 글입니다.'
---

### Symbol

Symbol은 ES6에서 새롭게 추가된 타입으로 변경이 불가능한 원시 타입 입니다. 따라서 유일한 값이나 유일한 키를 나타낼 때 유용하게 사용할 수 있습니다.

아래 코드는 맵에서 새로운 key-value를 추가하는 코드 입니다. key로 사용되는 id1과 id2에 저장된 문자열이 `id`로 동일하기 때문에 id2로 key 값을 출력하더라도 `this is id 1`로 value가 출력됩니다

```js
const map = new Map()

const id1 = 'id'
const id2 = 'id'

map.set(id1, 'this is id 1')
console.log(map.get(id2)) // 'this is id 1')

console.log(id1 === id2) // true
```

이러한 문제를 Symbol을 사용하면 해결할 수 있습니다. Symbol을 사용해서 값을 생성할 때 동일한 문자열을 전달하더라도 이름은 똑같지만 서로 다른 Symbol 값이 생성됩니다. id1과 id2값을 비교해보면 false 값이 출력되는 것을 통해 이를 확인할 수 있습니다. 그리고 id2로 key 값을 출력하더라도 이전과 달리 `undefined`가 출력되는 것을 확인할 수 있습니다.

```js
const map = new Map()

const id1 = Symbol('id')
const id2 = Symbol('id')

console.log(id1, id2) // Symbol(id) Symbol(id)

map.set(id1, 'this is id 1')

console.log(map.get(id1)) // this is id 1
console.log(map.get(id2)) // undefined

console.log(id1 === id2) // false
```

Symbol이 유일한 값을 가지는 특징을 아래 코드에서도 확인할 수 있습니다. obj의 `[Symbol('id')]`로 Symbol을 key로 갖는 프로퍼티를 추가해주었습다. 하지만 이 때 `[Symbol('id')]`로 obj에 외부에서 접근하려고 하면 undefined가 출력되는데 그 이유는 obj의 `[Symbol('id')]`과 console.log의 `[Symbol('id')]`은 서로 다른 Symbol이기 때문입니다

```js
const obj = { id: 'this is id', [Symbol('id')]: 'this is symbol id' }
console.log(obj)

console.log(obj.id) //  'this is id'

console.log(obj[Symbol('id')]) // undefined
```

동일한 이름으로 하나의 키를 사용하고 싶다면 Symbol.for을 사용할 수 있습니다. 아래 코드처럼 Symbol.for 함수를 사용해서 인자로 값을 전달하면, Symbol 값들이 저장되어 있는 Global Symbol Registry에서 전달된 값을 찾습니다. 만약 전달된 값이 값이 있다면 해당하는 Symbol 값을 반환하고 없다면 새로운 Symbol 값을 생성해서 Global Symbol Registry 저장한 다음 값을 반환합니다

```js
const id1 = Symbol.for('id') // 'id' 없기 때문에 새로운 Symbole 값을 만든다
const id2 = Symbol.for('id') //'id' 없기 때문에 기존의 Symbole 값을 반환한다

console.log(id1 === id2) // true
```

keyFor을 사용하면 해당 Symbol에 해당하는 값을 알 수 있습니다. 단 keyFor은 Global Symbol Registry에 보관된 symble에 한해서만 이름을 가져올 수 있습니다.

```js
const id1 = Symbol.for('id')
const id2 = Symbol('id')

console.log(Symbol.keyFor(id1)) // id
console.log(Symbol.keyFor(id2)) // undefined
```
