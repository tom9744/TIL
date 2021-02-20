# Function Overload

## 왜 필요한가?

```
type Combinable = string | number;  // Union Type

function getSum(a: Combinable, b: Combinable) {
    // Type Guard
    if (typeof a === 'string' || typeof b === 'string') {
        return a.toString() + b.toString();
    }
    return a + b;
}
```

위와 같이 `string` 또는 `number` 타입을 가질 수 있는 `Combinable` 타입이 존재하고, 이러한 `Combinable` 타입의 변수 두 개를 인자로 사용하는 `getSum()` 메서드가 있다.

VSCode와 같은 IDE에서 `getSum()` 메서드 위에 마우스를 가져가면, Typescript에 의해 자동 추론된  `getSum()` 메서드의 반환 타입을 아래와 같이 확인할 수 있다.

```
function getSum(a: Combinable, b: Combinable): Combinable
```

Typescript 타입 추론에 따르면, `getSum()` 메서드는 `Combinable` 타입의 변수를 반환한다고 되어있지만, 이는 **엄밀히 따지면 틀린 내용**이다. 

`getSum()` 메서드는 **`number` 또는 `string` 타입 둘 중 하나만을 가지는 값을 반환**할 뿐, `number`와 `string` 타입을 동시에 가질 수 있는 **`Combinable` 타입의 데이터는 반환하지 않기 때문이다.**

Typescript가 `getSum()` 메서드의 반환 타입을 `Combinable` 타입으로 추론함으로써 다음과 같은 문제가 발생할 수 있다.

```
const result = getSum("Junyoung", "Yang");
result.split("");  // 컴파일 에러, Combinable 타입에 `split()` 메서드 존재 X
```

두 개의 문자열 변수를 이용해 `getSum()` 메서드를 호출하면 **문자열 타입의 값이 반환되는 것을 개발자는 알 수 있지만**, Typescript는 `Combinable` 타입으로 추론하기 때문에 위와 같이 **문자열 내장 메서드 `split()`를 호출할 때 컴파일 에러를 발생**시킨다.

물론 이전에 학습한 *Type Casting*을 `getSum("Junyoung", "Yang") as string`과 같이 `result` 변수에 적용하여 컴파일 에러를 해결할 수도 있지만, **함수의 호출이 굉장히 잦다면 효율적인 해결 방법은 아닐 것**이다.

이러한 상황에서 ***Function Overloading*을 통해 문제를 쉽고 효과적으로 해결**할 수 있다.

<br>

## 사용법

*Function Overloading*은 단순히 **대상 함수의 선언부 상단에 인자와 반환 타입을 구체적으로 지정**하는 방식으로 수행할 수 있다.

[참고] *Function Overloading*과 관련된 문법은 Typescript에서만 유효하며, Javascript로 컴파일하면 사라진다.

```
function getSum(a: number, b: number): number;  // Function Overload
function getSum(a: Combinable, b: Combinable) {
    // Type Guard
    if (typeof a === 'string' || typeof b === 'string') {
        return a.toString() + b.toString();
    }
    return a + b;
}
```

위의 예시에서는 `function getSum(a: number, b: number): number`에서 `getSum()` 메서드에 대해 *Function Overloading*을 수행하고 있다.

*Function Overloading*에 의해 `getSum()` 메서드에 **전달된 두 개의 매개변수가 모두 `number` 타입인 경우, `Combinalbe` 타입 대신 `number` 타입이 반환 타입으로 지정**된다.

```
function getSum(a: string, b: string): string;  // Function Overload
function getSum(a: number, b: number): number;  // Function Overload
function getSum(a: Combinable, b: Combinable) {
    // Type Guard
    if (typeof a === 'string' || typeof b === 'string') {
        return a.toString() + b.toString();
    }
    return a + b;
}

const result = getSum("Junyoung", "Yang");
result.split("");  // 컴파일 에러 발생 X
```

위와 같이 *Function Overloading*을 여러번 적용할 수도 있으며, `function getSum(a: number): number`과 같이 **매개변수의 개수를 다르게 할 수도 있다.**

다만, 위 예시와 같은 경우 함수 구현부에서 매개변수 `a`와 `b`를 반드시 요구하고 있으므로 정상적으로 작동하지는 않을 것이다.


