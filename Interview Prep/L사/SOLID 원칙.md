# 객체지향 설계 원칙 (SOLID)

SOLID는 객체지향 설계에서 지켜야할 다섯가지 원칙이다.

실제 개발 과정에서 다섯가지 원칙을 모두 실현하기는 어렵지만, **예상하지 못한 변경사항에 유연하게 대처**하고 이후에 **확장성 있는 소프트웨어 아키텍처를 설계**하기 위해 알아두어야 한다.

> 좋은 소프트웨어 설계란, 새로운 요구사항이나 변경사항이 있을 때, 변경의 영향을 받는 범위를 최소화할 수 있는 구조를 말한다.

<br>

## SRP(Single Responsibility Principle), 단일 책임의 원칙

객체는 **단 하나의 책임**만을 가져야 한다.

객체지향 설계에서, **응집도는 최대화하고 결합도는 최소화**하는 설계를 해야 한다.

- 응집도 (Cohesion)
    - 모듈에 포함된 내부 요소들이 하나의 책임을 위해 연결된 정도이다.
    - 응집도가 높을 수록 좋은 설계이다. 
- 결합도 (Coupling)
    - 다른 모듈과의 의존성의 정도이다.
    - 결합도가 높은 경우, 한 모듈의 변경이 다른 모듈에 미치는 영향이 크다.
    - 결합도가 낮을 수록 좋은 설계이다.

<br>

## OCP(Open-Closed Principle), 개방-폐쇄 원칙

객체는 확장에는 열려있고 변경에는 닫혀있는, **기존의 코드를 변경하지 않으면서(= Closed) 기능을 추가할 수 있도록(= Open) 설계** 되어야 한다.

```javascript
const Person = function() {};

// 인스턴스에 상속되는 프로토타입 메서드.
Person.prototype.hello = function() {
    console.log("Hello!");
}

// 기존의 코드를 변경하지 않고, 기능을 추가 또는 변경할 수 있다.
const younger = new Person();
younger.hello = function() {
    console.log("What's up!");
}

// 기존의 코드를 변경하지 않고, 기능을 추가 또는 변경할 수 있다.
const older = new Person();
older.hello = function() {
    console.log("Nice to meet you.");
}
```

- 프로토타입 메서드를 인스턴스 메서드로 교체하여, 본래의 기능을 수정할 수 있다.
    - 이 때, 기존의 코드는 변경되지 않는다.

<br>

## LSP(Liskov Substitution Principle), 리스코프 치환 원칙

자식 객체는 언제나 자신을 생성한 **부모 객체의 역할을 대체**할 수 있어야 한다.

즉, 부모 클래스가 들어갈 위치에 자식 클래스를 배치해도 기능이 정상적으로 동작해야 한다.

> 자식 클래스는 부모 클래스의 책임을 무시하거나 재정의하지 않고, 확장만 수행해야 한다.

```javascript
class Car {
    constructor() { ... }

    drive() { ... }
}

class SuperCar extends Car {
    constructor() {
        super();
    }

    // 부모 클래스의 책임을 무시하거나 재정의하지 않고, 오직 확장만 한다.
    driveFaster() { ... }
}

const porsche = new SuperCar();
porsche.drive();  // 부모 클래스에서 가능한 행위는 자식 클래스에서도 가능하다.
```

<br>

## ISP(Interface Segregation Principle), 인터페이스 분리 원칙

클래스는 자신이 사용하지 않는 인터페이스는 구현하지 않는다.

하나의 일반적인 인터페이스보다, **여러개의 구체적인 인터페이스를 정의**하는 것이 좋다.

- 현실 세계의 핸드폰을 객체로 추상화하는 과정을 예시로 들어본다.
    1. `call()`, `sms()`, `calc()` 메서드를 모두 포함하는 `Phone` 인터페이스
    2. 각각의 기능 별로 정의된 `call()`, `sms()`, `calc()` 인터페이스
        - `Phone` 클래스는 `call()`, `sms()`, `calc()` 인터페이스를 구현한다.
- 첫번째 예시보다, 두번째 예시가 **인터페이스 분리 원칙을 준수**한 것이다.

> JavaScript는 `interface`를 지원하지 않는다. 

<br>

## DIP(Dependency Inversion Principle), 의존 역전 원칙

객체들은 의존 관계를 맺을 때, 자신보다 **추상성이 높은 객체와 의존** 관계를 맺는다.

즉, 변화하기 쉬운 것보다 **변화하기 어려운 것과 의존** 관계를 맺어야 한다.

대체적으로 `interface`를 사용하면 의존 역전 원칙을 지킬 수 있다.