---
date: '2021-07-18'
title: '상속보다는 컴포지션을 사용하기 (Composition Over Inheritance)'
categories: ['TypeScript', 'OOP']
summary: 'OOP에 상속보다는 컴포지션을 사용하기 (Composition Over Inheritance)에 관련된 내용입니다.'
---

```ts
type Cup = {
  count: number
  type: string
  isFruit?: boolean
  isVegitable?: boolean
}

interface JuiceMaker {
  makeJuice(cup: number): Cup
}

class JuiceMachine implements JuiceMaker {
  makeJuice(cup: number, type: string): Cup {
    console.log(`${cup} cup of ${string} juice`)
    return {
      cup,
      type,
    }
  }
}

class FruitJuiceMachine extends JuiceMachine {
  private blenderFruit(): void {
    console.log('Blender Fruite')
  }

  // overriding
  makeJuice(cup: number, type: string): Cup {
    this.blenderFruit()
    const juice = super.makeJuice(cup, type)
    return {
      ...juice,
      isFruit: true,
    }
  }
}

class VegetableJuiceMachine extends JuiceMachine {
  private blenderVegetable(): void {
    console.log('Blender Vegetable')
  }

  makeJuice(cup: number, type: string): Cup {
    this.blenderVegetable()
    const juice = super.makeJuice(cup, type)
    return {
      ...juice,
      isVegitable: true,
    }
  }
}
```

위 코드는 상속을 통해 작성한 주스를 만들기 위한 코드입니다.
주스를 만드는 `JuiceMachine` 클래스는 `JuiceMaker`라는 인터페이스를 구현하고, 과일 주스를 만들기 위한 `AppleJuiceMaker` 클래스와 채소 주스를 만들기 위한 `CarrotJuiceMaker` 클래스는 `JuiceMachine` 클래스를 상속한 다음 오버라이딩으로 정의한 함수를 통해 각각의 주스를 만듭니다.

작성한 코드에서 `FruitJuiceMachine` 클래스는 `JuiceMachine`클래스를 상속하고 과일 여부를 추가해줍니다.
그리고 `VegetableJuiceMachine` 클래스는 `JuiceMachine` 클래스를 상속하고 채소 여부를 추가해줍니다
여기서 문제는 과일과 채소가 모두 들어간 주스를 만드는 경우입니다.

상속은 수직적 관계를 갖기 때문에 내가 상속하는 부모를 수정하면 해당 부모를 상속하는 모든 자식 클래스에 영향을 미치게 됩니다.
또한 위에서 언급한 과일과 채소가 모두 들어간 주스를 만드는 경우처럼 새로운 기능을 도입하려고 할 때 어떻게 상속의 구조를 가져와야 하는지 고민해야 하고, 구조가 복잡해 질 수 있는 단점이 있습니다.

TypeScript에는 하나 이상의 부모클래스를 상속할 수 없기 때문에 `FruitJuiceMachine`과 `VegetableJuiceMachine`을 모두 상속하는 새로운 클래스를 만든느 것도 불가능합니다.
이러한 문제를 해결할 수 있는 방법이 바로 Composition 입니다.

> Favor Composition Over Inheritance

여기서 Composition은 구성요소를 의미하는 것으로, 상속이 아니라 Composition을 통해 필요한 요소를 가져와서 조립해서 기능을 구현할 수 있습니다.

```ts
type Cup = {
  count: number
  type: string
  isFruit?: boolean
  isVegitable?: boolean
}

interface JuiceMaker {
  makeJuice(cup: number): Cup
}

class JuiceMachine implements JuiceMaker {
  makeJuice(cup: number, type: string): Cup {
    console.log(`${cup} cup of ${string} juice`)
    return {
      cup,
      type,
    }
  }
}

class BlenderFruite {
  private blenderFruit(): void {
    console.log('Blender Fruite')
  }

  addIsFruite(cup: Cup): Cup {
    return {
      ...cup,
      isFruit: true,
    }
  }
}

class BlenderVegetable {
  private blenderVegetable(): void {
    console.log('Blender Vegetable')
  }

  addIsVegetable(cup: Cup): Cup {
    return {
      ...cup,
      isVegetable: true,
    }
  }
}
```

이전 코드에서는 각각의 클래스 내부에 Blender를 위한 함수를 정의해주었다면 위 코드에서는 Blender 기능을 하는 `BelnderFruite` 클래스와 `BelnderVegetable` 클래스를 정의해주었습니다. 그리고 이 클래스에서 과일 또는 채소 여부를 추가한 다음 `Cup` 객체를 반환해주는 함수를 추가해주었습니다.
그리고 클래스를 Dependency Injection를 통해 전달함으로써 아래처럼 필요한 곳에서 사용할 수 있습니다.
이렇게 기능별로 별도의 클래스로 구현한 다음 필요한 곳에서 가져다가 사용하는 방식이 Composition 입니다.

```ts
class FruitJuiceMachine extends JuiceMachine {
  constructor(private blender: BelnderFruite) {}

  makeJuice(cup: number, type: string): Cup {
    const juice = super.makeJuice(cup, type)
    return this.addIsFruite(juice)
  }
}

class VegetableJuiceMachine extends JuiceMachine {
  constructor(private blender: BelnderVegetable) {}

  makeJuice(cup: number, type: string): Cup {
    const juice = super.makeJuice(cup, type)
    return this.addIsVegetable(juice)
  }
}
```

이처럼 각각의 클래스에서 필요한 것을 매번 구현하는 것이 아니라 외부에서 필요한 기능을 구현한 클래스를 만들어둠으로써 필요한 곳에서 사용할 수 있습니다.
이러한 Composition을 통해 코드의 재사용성을 높일 수 있고 Dependency Injection을 통해 전달한 클래스가 내부적으로 어떻게 작동하는지는 알지 못해도 사용할 수 있습니다.
그리고 처음 상속으로 코드를 작성했을 때 마주했던 문제인 과일과 채소 모두 들어가는 주스 또한 만들 수 있습니다.

```ts
class FruitVegetableJuiceMachine extends JuiceMachine {
  constructor(
    private blender: BelnderFruite,
    private blender: BelnderVegetable,
  ) {}

  makeJuice(cup: number, type: string): Cup {
    const juice = super.makeJuice(cup, type)
    const friutAddedJuice = this.addIsVegetable(juice)

    return this.addIsVegetable(friutAddedJuice)
  }
}
```

하지만 위처럼 작성한 Composition은 밀접하게 Coupling 되어 있다는 단점이 있습니다.
`FruitJuiceMachine` 클래스와 `VegetableJuiceMachine` 클래스의 생성자를 보면 각각 전달받을 수 있는 클래스가 한정되어 있습니다.
즉, `FruitJuiceMachine` 클래스는 `BelnderFruite` 클래스와 `VegetableJuiceMachine` 클래스는 `BelnderVegetable` 클래스와 그리고 `FruitVegetableJuiceMachine` 클래스는 `BelnderFruite` 클래스와 `BelnderVegetable` 클래스와 밀접하게 연결이 되어있습니다.

이 때 발생할 수 있는 문제는 `FruitJuiceMachine` 클래스에서 에서 기존의 Blender 대신 다신 클래스를 Blender로 전달하고 싶은 경우입니다.
예를들어 얼음을 추가할 수 있는 Blender를 사용하고 싶다면 기존의 클래스에서 전달받는 Blender를 수정해주어야 합니다.
이처럼 클래스 사이에 상호작용을 하는 경우에는 클래스를 직접적으로 전달하는 것이 아니라 인터페이스를 통해서 서로 간의 상호작용을 할 수 있도록 해야하는데 이것이 Decoupling의 원칙입니다.

```ts
interface FruitBlenderMaker {
  blenderFruit(cup: number): Cup
}

class BlenderFruite implements FruitBlenderMaker {
  private blenderFruit(): void {
    console.log('Blender Fruite')
  }

  addIsFruite(cup: Cup): Cup {
    return {
      ...cup,
      isFruit: true,
    }
  }
}

class BlenderFruiteWithIce implements FruitBlenderMaker {
  private blenderFruit(): void {
    console.log('Blender Fruite witn ice')
  }

  addIsFruite(cup: Cup): Cup {
    return {
      ...cup,
      isFruit: true,
    }
  }
}
```

위 코드를 보면 `FruitBlenderMaker` 라는 Blender 위한 인터페이스를 정의한 다음 `BelnderFruite` 클래스와 `BelnderFruiteWithIce` 클래스에서 인터페이스를 구현해주었습니다.
이렇게 인터페이스를 정의하고 각각의 클래스에서 구현해준다면 `FruitJuiceMachine` 클래스에서는 blender의 타입을 인터페이스로 정할 수 있고, 해당 인터페이스를 구현하는 클래스를 전달받을 수 있습니다.
이를 통해 클래스 간의 밀접하게 Coupling 되어 있는 문제를 해결할 수 있습니다.

```ts
class FruitJuiceMachine extends JuiceMachine {
  constructor(private blender: FruitBlenderMaker) {}

  makeJuice(cup: number, type: string): Cup {
    const juice = super.makeJuice(cup, type)
    return this.addIsFruite(juice)
  }
}

const fruit = new FruitJuiceMachine(new BelnderFruite())
const fruitWithIce = new FruitJuiceMachine(new BelnderFruiteWithIce())
```
