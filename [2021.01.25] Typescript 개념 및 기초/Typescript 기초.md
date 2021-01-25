# Typescript 기초

Javscript 스스로도 `number`, `string`, `boolean`와 같은 기본적인 데이터 타입을 제공하기는 하지만, Typescript는 더욱 다양한 데이터 타입을 추가적으로 제공한다. 또한, 지금 당장 다루지는 않겠지만 사용자 정의 데이터 타입을 정의하여 사용할 수도 있다.

<br>

## 기본 데이터 타입

### `number`

Javascript와 Typescript 모두 지원하는 데이터 타입으로서, 숫자를 의미한다. 다른 프로그래밍 언어와 같이 *Integer*, *Float*, *Double* 등으로 세부 데이터 타입으로 구분되지 않으며, 모든 숫자는 `number` 타입이다.

### `string`

마찬가지로 Javascript와 Typescript 모두 지원하는 데이터 타입으로서, 문자를 의미한다. 작은 따옴표 또는 큰 따옴표를 이용해 나타낼 수 있으며, ES6의 템플릿 리터럴에 사용되는 백틱을 이용하는 방식도 지원한다.

### `boolean`

Javascript와 Typescript 모두 지원하는 마지막 데이터 타입으로서, 참 또는 거짓을 의미한다. `true`, `false`로 나타내며, 두 가지 값 이외의 값은 가질 수 없다.

다만 기억해야할 점은, `if`를 사용한 **조건문에서는 숫자 1과 0을 참거짓 판별에 사용**할 수 있지만, **데이터 타입으로서의 `boolean`에는 오직 `true`와 `false`만 해당**한다는 것이다. 

<br>

## Javscript 타입 vs. Typescript 타입

Javascript의 기본 데이터 타입을 Typescript에서도 동일하게 지원하기는 하지만, **데이터 타입을 특정한 변수에 반영하는 시점에 있어서는 굉장히 큰 차이점이 존재**한다.

먼저 Javascript는 *동적 타입 언어*이며, 따라서 변수 초기화 시점에서 `number` 타입으로 선언되더라도 추후에 `string`, `boolean` 또는 그 외의 타입의 데이터를 언제든 해당 변수에 할당할 수 있다. 즉, **변수에 값이 할당되는 과정에서 변수의 데이터 타입이 결정**되는 것이다.

반면 Typescript는 C++, Java와 같은 *정적 타입 언어*이며 **변수를 처음 초기화하는 시점에서 변수의 데이터 타입이 결정**된다. 따라서 `nunber` 타입으로 초기화 된 변수에 `number`가 아닌 다른 타입의 값을 할당하려고 하면 에러를 발생시킨다.

<br>

## 타입 할당(Assignment)과 추론(Inference)

```
const add = (num1: number, num2: number, showResult: boolean, phrase: string) => {
    const result = num1 + num2;

    if (showResult) {
        console.log(phrase + result);
    } else {
        return result;
    }
};

const numberOne = 5;
const numberTwo = 2.8;
const printResult = true;
const resultPhrase = 'The Result is: ';

add(numberOne, numberTwo, printResult, resultPhrase);
```

위의 코드에서, `add()`라는 함수를 정의할 때 `num1: number`와 같이 함수의 각 인자에 대해 **데이터 타입을 명시적으로 할당**하고 있다. 이러한 데이터 타입의 할당(*Type Assignment*)과 관련된 코드는 Typescript에서만 유효하며, Javascript로 컴파일하는 과정에서 모두 제거된다.

여기서 주목해야할 부분은, **변수를 초기화하는 코드(ex. `const numberOne = 5;`)에서는 데이터 타입을 명시적으로 할당하지 않는다**는 점이다. 이것은 Typescript에 내장되어 있는 **타입 추론(*Type Inference*)이라는 기능** 덕분인데, 쉽게 말해서 Typescript가 **변수에 할당된 값을 기반으로 해당 변수의 데이터 타입을 스스로 판단하여 할당**하는 것이다.

Typescript는 앞에서 설명한 것과 같이 ***정적 타입 언어***이다. 따라서 `const numberOne = 5;`와 같은 코드에서 `numberOne`이라는 변수에 숫자 5를 할당하고 있기 때문에 **`numberOne` 변수는 이미 `number` 타입으로 결정**된 것이다. 따라서 명시적으로 타입을 할당하지 않아도 Typescript는 해당 변수에 `number` 타입이 할당된다는 것을 자체적으로 파악할 수 있다.

물론 Typescript에서 제공하는 타입 추론 기능을 사용하지 않고, 다음과 같이 모든 변수에 대해 명시적으로 타입을 할당할 수도 있다.

```
const numberOne: number = 5;
const numberTwo: number = 2.8;
const printResult: boolean = true;
const resultPhrase: string = 'The Result is: ';
```

하지만 이는 중복된 내용의 코드를 작성하는 것이며, *Best Practice*로 간주되지 않기 때문에 될 수 있으면 **Typescript에 내장된 타입 추론 기능을 활용하는 것이 바람직하다.**

다만 명시적으로 변수의 데이터 타입을 할당해 주어야하는 경우가 존재하는데, **변수를 선언만 하고 초기화하지 않는 경우**이다. 다음의 예시와 같은 상황에서는 반드시 변수의 데이터 타입을 명시적으로 할당해야 한다.

```
let numberOne: number;

...

numberOne = 5;  // Correct!
numberOne = "5";  // Error!
```

**[중요]** `const` 예약어를 이용해 상수로 선언한 변수의 경우, 이후에 값이 변경되지 않기 때문에 단순히 `number` 타입으로 할당되지 않고 할당된 숫자 그 자체가 데이터 타입으로 할당된다. 예를 들어 `const numberOne = 5;`에서 `numberOne`의 데이터 타입은 `number`가 아니라 `5` 그 자체이다. `let` 예약어를 사용해 값이 추후에 변경될 수 있는 변수인 경우, `let numberOne = 5;`와 같이 변수에 숫자 값을 할당하면 `numberOne`의 데이터 타입은 `number`가 된다.

<br>

## `object` 타입

Javascript와 Typescript의 `object` 타입은 기본적으로 동일하지만, Typescript는 `object`를 구성하고 있는 각각의 `key`에 대해서도 타입을 명시적으로 지정할 수 있도록 특별한 `object` 타입을 제공한다.

```
const person = {
    name: "Junyoung",
    age: "25"
};

console.log(person.nickname);
```

Typescript 파일에서 객체를 선언한 뒤, `console.log(person.nickname);`와 같이 해당 객체에 존재하지 않는 속성에 접근하려고 시도하면 에러가 발생한다. 이는 Typescript가 앞서 설명한 타입 추론(Type Inference) 기능을 통해 **객체 자체와 해당 객체에 포함된 모든 `key-value`에 대해 타입을 할당**하기 때문이다. 

Typescript에서는 다음 세 가지의 방법으로 객체 데이터에 `object` 타입을 할당할 수 있다.

### 타입 추론에 의한 타입 할당

위에서 확인한 것과 같이 Typescript에 의해 **추론된 `object` 타입은 Javacsript의 순수 `object` 타입과 같지 않다.** Typescript에 의해 추론된 `obejct` 타입은 다음과 같은 `key-type`의 형태를 갖는다. 

```
const person : {
    name: string;
    age: number;
}
```

### 순수 `obejct` 타입 할당

Javascript의 `object` 타입과 같은 순수한 `obejct` 타입을 할당하고자 한다면 다음과 같이 변수에 `object` 타입을 명시적으로 할당하면 된다.

```
const person: object = {
    name: "Junyoung",
    age: "25"
};
```

이러한 경우, Typescript는 **`person` 변수가 `object` 타입인지 여부만 검사하고, 내부의 `key-value` 구조에 대해서는 검사하지 않는다.** 따라서 `console.log(person.name);`과 같이 객체에 실제로 존재하는 속성에 접근하더라도 Typescript는 에러를 발생시킨다.
 

### 구체적인 `obejct` 타입 할당

변수에 `object` 타입을 명시적으로 할당하되, Typescript의 타입 추론에 의한 할당 결과와 같은 형태를 갖도록 할 수도 있다.

```
const person: { name: string; age: number;} = {
    name: "Junyoung",
    age: "25"
};
```

하지만 앞에서도 언급하였듯, 이러한 타입 할당 방식은 **타입 추론 기능을 사용할 수 있음에도 중복된 코드를 작성하는 것**이므로 되도록 사용하지 않는 것이 좋다.

<br>

## 중첩된 `object` 타입

중첩된 객체(*Nested Obejct*)도 역시 Typescript에 의해 타입 추론이 가능하다.

```
const product = {
    id: 'RC-102',
    price: 12.99,
    tags: ['top-ten', 'on-sale'],
    details: {
        title: 'Red Carpet',
        description: 'A Grate Brand-New Carpet!'
    }
};
```

위의 중첩된 객체(*Nested Obejct*)는 Typescript의 타입 추론에 의해 아래와 같이 데이터 타입이 할당된다.

```
const product: {
    id: string;
    price: number;
    tags: array<string>,
    details: {
        title: string;
        description: string;
    }
}
```
