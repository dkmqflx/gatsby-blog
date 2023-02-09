---
date: '2022-07-27'
title: '의존성 역전 원칙(Dependency Inversion Principle)이란'
categories: ['OOP', 'JavaScript']
summary: '의존성 역전 원칙에 대해서 정리한 글입니다.'
---

## 의존성 역전 원칙(Dependency Inversion Principle) 이란

의존성 역전 원칙이란 high-level module이 low-level module에 의존하는 것이 아니라 추상화에 의존하는 것입니다. 여기서 high-level modul과 low-level module이 의미하는 바는 아래 코드에서 확인할 수 있습니다.

```ts
class A {
  printA() {
    console.log('A')
  }
}

class B {
  printB() {
    console.log('B')
  }
}

class Alphabet {
  private a = new A()

  private b = new B()

  printAlphabet() {
    this.a.printA()
    this.b.printB()
  }
}

const alphabet = new Alphabet()
alphabet.printAlphabet()
```

`Alphabet` 클래스 내부를 보면 `A` 클래스와 `B` 클래스가 사용되는 것을 확인할 수 있습니다. 이 때 `A` 클래스 또는 `B` 클래스의 print 함수의 이름이 변경되면 `Alphabet` 클래스에서도 수정 사항을 반영해야 합니다. 이처럼 B가 변하면 A에 영향을 미치는 관계(A -> B)를 A가 B에 의존한다고 말합니다.

위 코드에서는 `Alphabet` 클래스가 `A` 클래스와 `B` 클래스에 의존성(dependency)를 가지고 있고 `Alphabet` 클래스가 high-level module 그리고 `A` 클래스와 `B` 클래스가 low-level module이 됩니다.

이렇게 의존성을 갖고 있는 상황의 문제점은 위에서 언급한 것처럼 low-level module에서 수정사항이 발생하면 high-level module에서 수정을 해주어야 할 뿐 아니라, high-level module에서 새로운 low-level module을 추가할 때 마다 의존성이 증가하기 때문에 나중에 코드를 관리하거나 수정하는데 어려움이 생길 수 있습니다.

이러한 문제를 해결하기 위한 것이 바로 의존성 역전 원칙입니다.

---

### 의존성 역전 원칙 적용하기

아래는 앞서 작성된 코드에 의존성 역전 원칙을 적용한 코드입니다.

```ts
interface Charactor {
  print(): void
}

class A implements Charactor {
  print() {
    this.printA()
  }

  printA() {
    console.log('A')
  }
}

class B implements Charactor {
  print() {
    this.printB()
  }
  printB() {
    console.log('B')
  }
}

class Alphabet {
  constructor(private chracters: Charactor[]) {}

  printAlphabet() {
    this.chracters.map(item => item.print())
  }
}

const alphabet = new Alphabet([new A(), new B()])
alphabet.printAlphabet()
```

`A` 클래스와 `B` 클래스가 인터페이스 `Charactor` 를 구현함으로써 `Charactor` 인터페이스에 의존성을 갖게 만들었습니다. 그리고 `Alphabet` 클래스에서는 인터페이스를 구현한 클래스를 생성자의 인자로 받아서 인터페이스의 print 함수를 출력합니다. `Charactor` 인터페이스의 print 함수를 수정하면 `Alphabet` 클래스도 해당 함수를 수정해주어야 하기 때문에 `Alphabet` 또한 `Charactor`에 의존성을 갖고 있다고 할 수 있습니다.

이처럼 high-level module인 `Alphabet` 이 low-level module에 의존하지 않고 추상화를 위한 인터페이스에 의존하고 low-level module 또한 인터페이스에 의존하는 상황(A -> C <- B)을 의존성 역전 원칙이 적용되었다고 할 수 있습니다. 이처럼 의존성 역전 원칙을 적용함으로써 `A` 클래스 또는 `B` 클래스에서 printA 또는 printB 함수를 수정하더라도 `Alphbet` 클래스에서는 수정사항을 반영할 필요가 없게 됩니다.

---

### React Query에 의존성 역전 원칙 적용하기

이러한 의존성 역전 원칙을 API 통신에도 사용할 수 있습니다. 다음은 Data fetching에 React Query를 사용하는 코드입니다. 코드를 보면 React Query의 useQuery를 그대로 사용하는 것이 아니라 Data fetching을 위한 useRequest를 정의해서 사용한 것을 확인할 수 있습니다. 이처럼 인터페이스를 새롭게 정의해서 사용하게 되면 때문에 외부 변경으로인한 영향을 최소화할 수 있다는 장점이 있습니다.

```ts
// useReqeust.ts

import { useQuery } from 'react-query'

type requestOptionType = {
  enabled?: boolean
}

export const useRequest = <TData>(
  key: string | string[],
  request: () => TData | Promise<TData>,
  option?: requestOptionType,
) => {
  return useQuery(key, request, { ...option })
}
```
