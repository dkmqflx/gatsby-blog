---
date: '2022-06-14'
title: '화살표 함수를 super 키워드로 호출하면 에러가 발생하는 이유'
categories: ['JavaScript']
summary: '화살표 함수를 super 키워드로 호출하면 에러가 발생하는 이유에 대해서 정리한 글입니다.'
---

아래 코드는 Fruit라는 클래스를 상속한 Orange 클래스에서 super 키워드를 사용해서 부모 클래스에서 정의된 함수를 호출하는 코드입니다. 이 때 정의된 두 함수 중 하나는 일반함수로, 그리고 또 다른 함수는 화살표 함수로 정의되어 있습니다.

```js
class Fruit {
  generalPrint() {
    console.log('general')
  }

  ArrowPrint = () => {
    console.log('arrow')
  }
}

class Orange extends Fruit {
  print() {
    super.generalPrint()
    super.ArrowPrint() // error
  }
}

const orange = new Orange()

orange.print()
```

코드를 실행하면 일반 함수는 정상적으로 실행되어 `general` 문자열이 출력되지만 화살표 함수로 정의된 함수를 호출하는 부분에서는 에러가 발생합니다. 이렇게 에러가 발생하는 이유는 작성된 코드를 Babel을 사용해서 ES6으로 변환해보면 확인할 수 있습니다.

```js
class Fruit {
  constructor() {
    this.ArrowPrint = () => {
      console.log('arrow')
    }
  }

  generalPrint() {
    console.log('general')
  }
}
class Orange extends Fruit {
  print() {
    super.generalPrint()
    super.ArrowPrint() // error
  }
}
const orange = new Orange()

orange.print()
```

코드를 보면 일반함수로 정의된 함수는 아무런 변화가 없습니다. 하지만 화살표 함수로 정의한 함수는 constructor로 이동이 되어 있는 것을 확인할 수 있습니다. constructor는 객체가 생성될 때 실행되는 함수이기 때문에 ArrowPrint Fruit 함수는 클래스의 인스턴스에서만 사용을 할 수 있습니다. 즉, 프로토타입에 정의가 되어 있지 않습니다. 실제로 console.log로 프로토타입을 출력해 보면 일반함수인 generalPrint만 정의되어 있는 것을 확인할 수 있습니다.

```js
console.log(Orange.prototype)

{constructor: ƒ, generalPrint: ƒ}
  constructor: class Fruit
  generalPrint: ƒ generalPrint()
  [[Prototype]]: Object
```

이러한 이유로 자식 클래스에서는 부모 클래스에서 화살표 함수로 정의한 함수를 super 키워드를 사용해서 호출할 수가 없습니다.
