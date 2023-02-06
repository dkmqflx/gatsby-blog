---
date: '2021-07-18'
title: '상속보다는 컴포지션을 사용하기 (Composition Over Inheritance)'
categories: ['OOP', 'TypeScript']
summary: 'OOP에 상속보다는 컴포지션을 사용하기 (Composition Over Inheritance)에 관련된 내용입니다.'
---

## Composition

Composition은 기존 클래스를 상속해서 확장하는 대신에 새로운 클래스를 만들고 새롭게 만든 클래스의 인스턴스로 기존 클래스를 참조하는 방식을 말합니다.

Composition을 사용할 때의 장점은 상속이 가지는 단점을 해결할 수 있다는 것입니다.

> Favor Composition Over Inheritance

예를들어 상속의 가장 큰 문제점 중 하나는 자식 클래스와 부모 클래스가 강하게 결합될 수 있다는 것입니다. 상속은 수직적 관계를 갖기 때문에 부모 클래스를 수정하면 해당 부모 클래스를 상속하는 모든 자식 클래스에 영향을 미치게 됩니다. 하지만 Composition을 사용하게 되면 필요한 요소를 가져와서 사용하기 때문에 상위 클래스에 의존하지 않게 됩니다.

아래 타입스크립트로 작성된 예시를 통해 상속이 가지는 단점을 확인할 수 있습니다.

---

### 상속으로 기능 구현

```ts
type Cup = {
  cup: number
  isFruit?: boolean
  isVegitable?: boolean
}

interface JuiceMaker {
  makeJuice(cup: number): Cup
}

// 주스 만들기 위한 JuiceMachine 클래스
class JuiceMachine implements JuiceMaker {
  makeJuice(cup: number): Cup {
    console.log(`${cup} cup of juice`)
    return {
      cup,
    }
  }
}

// 과일 주스 만들기 위한 FruitJuiceMachine 클래스
class FruitJuiceMachine extends JuiceMachine {
  private addFruit(): void {
    console.log('Add Fruit')
  }

  // overriding
  makeJuice(cup: number): Cup {
    this.addFruit() // 과일 추가
    const juice = super.makeJuice(cup)
    return {
      ...juice,
      isFruit: true,
    }
  }
}

// 야채 주스 만들기 위한 VegetableJuiceMachine 클래스
class VegetableJuiceMachine extends JuiceMachine {
  private addVegetable(): void {
    console.log('Add Vegetable')
  }

  // overriding
  makeJuice(cup: number): Cup {
    this.addVegetable() // 야채 추가
    const juice = super.makeJuice(cup)
    return {
      ...juice,
      isVegitable: true,
    }
  }
}
```

위 코드는 상속을 통해 구현한 주스를 만들기 위한 코드입니다. 주스를 만드는 `JuiceMachine` 클래스는 `JuiceMaker`라는 인터페이스를 구현합니다.

`FruitJuiceMachine` 클래스는 `JuiceMachine`클래스를 상속하고 오버라이딩한 `makeJuice` 함수에서 과일 여부를 리턴 값으로 추가해줍니다. 그리고 `VegetableJuiceMachine` 클래스에서도 `JuiceMachine` 클래스를 상속하고 오버라이딩한 `makeJuice` 함수에서 리턴 값으로 채소 여부를 추가해줍니다. 여기서 문제는 과일과 채소가 모두 들어간 주스를 만드는 경우입니다.

상속은 수직적 관계를 갖기 때문에 `JuiceMachine` 에서 코드를 수정하면 `JuiceMachine`를 상속하는 `FruitJuiceMachine` 클래스와 `VegetableJuiceMachine` 클래스 모두 수정을 해주어야 합니다. 이처럼 새로운 기능을 도입하려고 할 때 어떻게 상속의 구조를 가져와야 하는지 고민해야 하고 구조가 복잡해 질 수 있는 단점이 있습니다.

그리고 TypeScript에는 하나 이상의 부모클래스를 상속할 수 없기 때문에 과일 주스를 만들기 위한 `FruitJuiceMachine` 클래스와 야채 주스를 만들기 위한 `VegetableJuiceMachine` 클래스를 모두 상속하는 새로운 클래스를 만드느 것도 불가능합니다. 이러한 문제를 Composition을 통해 해결할 수 있습니다.

<br/>

---

### Composition으로 기능 구현

이전 코드에서는 각각의 클래스 내부에 과일 또는 야채를 추가하기 위한 함수를 정의해주었다면 아래 코드에서 확인할 수 있듯이 과일과 야채를 추가해주는 기능을 하는 AddFruit 클래스와 AddVegetable 클래스를 정의해주었습니다.

```ts

...

// 과일 추가해주는 클래스
class AddFruit {
  private addFruit(): void {
    console.log('Add Fruit')
    return true
  }

  addIsFruite(cup: Cup): Cup {
  const isFruit = this.addFruit()

    return {
      ...cup,
      isFruit: isFruit,
    }
  }
}

// 야채 추가해주는 클래스
class AddVegetable {
  private addVegetable(): void {
    console.log('Add Vegetable')
    return true
  }

  addIsVegetable(cup: Cup): Cup {
    const isVegetable = this.addVegetable()

    return {
      ...cup,
      isVegetable: isVegetable
    }
  }
}
```

<br/>

각각의 클래스에서는 과일 또는 채소 여부를 추가한 다음 Cup 객체를 반환해주는 함수를 추가해주었습니다. 그리고 클래스를 Dependency Injection를 통해 전달함으로써 아래처럼 필요한 곳에서 사용할 수 있습니다. 이렇게 기능별로 별도의 클래스로 구현한 다음 필요한 곳에서 가져다가 사용하는 방식이 Composition 입니다.

```ts
...


// 과일 주스 만드는 클래스, AddFruit 클래스를 인스턴스로 전달받는다
class FruitJuiceMachine extends JuiceMachine {
  constructor(private addFruit: AddFruit) {}

  makeJuice(cup: number): Cup {
    const juice = super.makeJuice(cup)
    return this.addFruite.addIsFruit(juice) // 과일 추가

  }
}

// 야채 주스 만드는 클래스, AddVegetable 클래스를 인스턴스로 전달받는다
class VegetableJuiceMachine extends JuiceMachine {
  constructor(private addVegetable: AddVegetable) {}

  makeJuice(cup: number): Cup {
    const juice = super.makeJuice(cup)
    return this.addVegetable.addIsVegetable(juice) // 야채 추가
  }
}

...


```

<br/>

이처럼 각각의 클래스에서 필요한 것을 매번 구현하는 것이 아니라 외부에서 필요한 기능을 구현한 클래스를 만들어둠으로써 필요한 곳에서 사용할 수 있습니다.
이러한 Composition을 통해 코드의 재사용성을 높일 수 있고 Dependency Injection을 통해 전달한 클래스가 내부적으로 어떻게 작동하는지는 알지 못해도 사용할 수 있습니다.
그리고 처음 상속으로 코드를 작성했을 때 마주했던 문제인 과일과 채소 모두 들어가는 주스 또한 만들 수 있습니다.

```ts
...

// 과일과 채소 모두 들어가는 주스 만들기 위한 클래스
class FruitVegetableJuiceMachine extends JuiceMachine {
  constructor(
    private addFruite AddFruit,
    private addVegetable: AddVegetable,
  ) {}

  makeJuice(cup: number): Cup {
    const juice = super.makeJuice(cup)

    const fruitAddedJuice = this.addFruit.addIsFruit(juice) // 과일 추가

    return this.addVegetable.addIsVegetable(fruitAddedJuice) // 야채 추가
  }
}
...

```

<br/>

---

### 인터페이스를 사용해서 개선하기

하지만 위처럼 작성한 Composition은 밀접하게 Coupling 되어 있다는 단점이 있습니다.
`FruitJuiceMachine` 클래스와 `VegetableJuiceMachine` 클래스 그리고 `FruitVegetableJuiceMachine` 클래스의 생성자를 보면 각각 전달받을 수 있는 클래스의 인스턴스가 정해져 있습니다.

`FruitJuiceMachine` 클래스 같은 경우는 `AddFruit` 클래스의 인스턴스만 전달받을 수 있고 `VegetableJuiceMachine` 클래스는 `AddVegetable` 클래스의 인스턴스만 전달 받을 수 있습니다. 그리고 `FruitVegetableJuiceMachine` 클래스를 보면 `AddFruit` 클래스와 `AddVegetable` 클래스의 인스턴스만 각각 전달받을 수 있습니다.

이 때 발생할 수 있는 문제는 과일 주스를 만들기 위한 `FruitJuiceMachine` 클래스와 야채 주스를 만들기 위한 `VegetableJuiceMachine` 에서 과일과 야채 이외의 다른 요소를 함께 전달하고 싶은 경우입니다.

예를들어 과일 주스에서는 얼음을 추가하고 사용하고 싶고 야채 주스에서는 견과류를 추가하고 싶다면 기존에 전달받는 `AddFruit`, `AddVegetable` 클래스를 각각 수정해주어야 합니다. 이처럼 클래스 사이에 상호작용을 하는 경우에는 클래스를 직접적으로 전달하는 것이 아니라 인터페이스를 통해서 서로 간의 상호작용을 할 수 있도록 해줍니다.

따라서 아래와 같이 인터페이스와 인터페이스를 구현하는 클래스를 정의해줍니다.

```ts
...

// 과일 주스 만들기 위한 인터페이스 정의
interface AddFruitMaker {
  addIsFruit(cup: Cup): Cup
}


// 기본 과일 주스 만들 때
class AddFruit implements AddFruitMaker {
  private addFruit(): void {
    console.log('Add Fruit')
    return true
  }

  addIsFruit(cup: Cup): Cup {
    const isFruit = this.addFruit()
    return {
      ...cup,
      isFruit: isFruit,
    }
  }
}

// 얼음이 추가된 과일주스 만들 때
class AddFruiteWithIce implements AddFruitMaker {
  private addFruitWithIce(): void {
    console.log('Add Fruit With Ice')
    return true
  }

  addIsFruit(cup: Cup): Cup {
    const isFruit = this.addFruitWithIce()

    return {
      ...cup,
      isFruit: isFruit,
    }
  }
}




// 야채 주스 만들기 위한 인터페이스 정의
interface AddVegetableMaker {
  addIsVegetable(cup: Cup): Cup
}

// 기본 야채 주스 만들 때
class AddrVegetable implements AddVegetableMaker {
  private addVegetable(): void {
    console.log('add Vegetablee')
    return true
  }

  addIsVegetable(cup: Cup): Cup {
    const isVegetable = this.addVegetable()

    return {
      ...cup,
      isVegetable: isVegetable,
    }
  }
}

// 견과류가 추가된 야채 주스 만들 때
class AddVegetableWithNut implements AddVegetableMaker {
  private addVegetableWithNut(): void {
    console.log('Add Vegetablee With Nut')
    return true
  }

  addIsVegetable(cup: Cup): Cup {
    const isVegetable = this.addVegetableWithNut()

    return {
      ...cup,
      isVegetable: isVegetable,
    }
  }
}



```

위 코드를 보면 과일 주스를 만들기 위한 `AddFruiteMaker` 인터페이스와 야채 주스를 만들기 위한 `VegetableBlenderMaker`라는 인터페이스를 정의해준 다음, 각각의 인터페이스를 구현하는 클래스들을 정의해주었습니다

이렇게 인터페이스를 정의하고 각각의 클래스에서 구현해준다면 `FruitJuiceMachine` 클래스에서는 어떤 과일 주스를 만들지에 대한 타입을 인터페이스로 정할 수 있고, 해당 인터페이스를 구현하는 클래스를 전달받을 수 있습니다. 이를 통해 클래스 간의 밀접하게 Coupling 되어 있는 문제를 해결할 수 있습니다.

```ts
// 과일 주스 만드는 클래스
class FruitJuiceMachine extends JuiceMachine {
  // AddFruiteMaker 구현하는 클래스의 인스턴스는 모두 전달 받을 수 있다
  constructor(private addFruit: AddFruiteMaker) {}

  makeJuice(cup: number): Cup {
    const juice = super.makeJuice(cup)
    return this.addFruit.addIsFruite(juice)
  }
}
const addFruit = new AddFruite()
const fruit = new FruitJuiceMachine(addFruit) // 기본 과일 주스

const addFruitWithIce = new AddFruiteWithIce()
const fruitWithIce = new FruitJuiceMachine(addFruitWithIce) // 얼음이 들어간 과일주스

// 야채 주스 만드는 클래스
class VegetableJuiceMachine extends JuiceMachine {
  // AddVegetableMaker 구현하는 클래스의 인스턴스는 모두 전달 받을 수 있다
  constructor(private addVegetable: AddVegetablerMaker) {}

  makeJuice(cup: number): Cup {
    const juice = super.makeJuice(cup)
    return this.addVegetable.addIsVegetable(juice)
  }
}
const addVegetable = new AddVegetable()
const vegetable = new VegetableJuiceMachine(addVegetable) // 기본 야채 주스

const addVegetableWithNut = new AddVegetableWithNut()
const vegetableWithNut = new VegetableJuiceMachine(addVegetableWithNut) // 견과류가 들어간 야채주스
```

<br/>

지금까지 작성된 코드를 보면 과일과 야채 주스를 만들기 위한 별도의 클래스가 각각 정의되어 있습니다. 하지만 과일과 야채를 만들기 위한 인터페이스가 정의되었기 때문에 이 인터페이스를 구현하는 클래스의 인스턴스를 전달받는 방식으로 JuiceMachine 클래스를 수정해서 하나의 클래스로 과일주스와 야채주스를 만들 수 있습니다.

우선 과일과 야채를 추가 하지 않는 경우를 처리하기 위한 클래스도 정의해 줍니다

```ts

...


// 과일 추가 안하는 클래스
class AddNoFruit implements AddFruitMaker {

  // 전달 받은 cup을 그대로 리턴
  addIsFruit(cup: Cup): Cup {
    return {
      cup,
    }
  }
}


// 야채 추가 안하는 클래스
class AddNoVegetable implements AddVegetableMaker {

  // 전달 받은 cup을 그대로 리턴
  addIsVegetable(cup: Cup): Cup {
    return {
      cup,
    }
  }
}
```

그리고 JuiceMachine 클래스에서 과일 추가와 관련된 `AddFruitMaker` 인터페이스와, 야채 추가를 위한 `AddVegetablerMaker` 인터페이스를 구현한 클래스의 인스턴스를 받을 수 있도록 처리해줍니다.

```ts
class JuiceMachine implements JuiceMaker {
  constructor(
    private addFruit: AddFruitMaker,
    private addVegetable: AddVegetablerMaker,
  ) {}

  makeJuice(cup: number): Cup {
    console.log(`${cup} cup of juice`)
    const juice = { cup }

    const fruitAdd = this.addFruit.addIsFruit(juice) // 과일 추가
    return this.addVegetable.addIsVegetable(fruitAdd) // 야채 추가
  }
}
```

<br/>

그리고 과일, 야채 인터페이스를 구현한 클래스의 인스턴스를 전달받아서 내가 원하는 방식으로 주스를 만들 수 있습니다

```ts
// 과일

const fruit = new AddFruit() // 기본 과일 주스 만들 때
const fruitWithIce = new AddFruitWithIce() // 얼음 들어간 과일 주스 만들 때
const NoFruit = new AddNoVegetable() // 과일 추가 안하는 경우

// 야채
const vegetable = new AddVegetable() // 기본 야채 주스
const vegetableWithNut = new AddVegetableWithNut() // 견과류 들어간 야채 주스 만들 때
const NoVegetable = new AddNoVegetable() // 야채 추가 안하는 경우

// 과일만 들어간 주스
const fruitJuice = new JuiceMachine(fruit, NoVegetable)

// 야채만 들어간 주스
const vegetableJuice = new JuiceMachine(NoFruit, vegetable)

// 과일 야채 모두 들어간 주스
const fruitJuice = new JuiceMachine(fruit, vegetable)

// 얼음이 들어간 과일과 견과류가 들어간 채소 주스
const fruitJuice = new JuiceMachine(fruitWithIce, vegetableWithNut)
```
