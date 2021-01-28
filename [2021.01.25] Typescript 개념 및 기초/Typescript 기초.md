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

`object`, `array`와 같은 타입은 다소 분량이 많아, 추후에 다시 기록하기로 한다.

<br>

## Javscript와 Typescript의 타입 결정 시점

Javascript의 기본 데이터 타입을 Typescript에서도 동일하게 지원하기는 하지만, **데이터 타입을 특정한 변수에 반영하는 시점에 있어서는 굉장히 큰 차이점이 존재**한다.

먼저 Javascript는 *동적 타입 언어*이며, 따라서 변수 초기화 시점에서 `number` 타입으로 선언되더라도 추후에 `string`, `boolean` 또는 그 외의 타입의 데이터를 언제든 해당 변수에 지정할 수 있다. 즉, **변수에 값이 지정되는 과정에서 변수의 데이터 타입이 결정**되는 것이다.

반면 Typescript는 C++, Java와 같은 *정적 타입 언어*이며 **변수를 처음 초기화하는 시점에서 변수의 데이터 타입이 결정**된다. 따라서 `nunber` 타입으로 초기화 된 변수에 `number`가 아닌 다른 타입의 값을 지정하려고 하면 에러를 발생시킨다.

<br>

## 타입 지정(Assignment)과 추론(Inference)

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

위의 코드에서, `add()`라는 함수를 정의할 때 `num1: number`와 같이 함수의 각 인자에 대해 **데이터 타입을 명시적으로 지정**하고 있다. 이러한 데이터 타입의 지정(*Type Assignment*)과 관련된 코드는 Typescript에서만 유효하며, Javascript로 컴파일하는 과정에서 모두 제거된다.

여기서 주목해야할 부분은, **변수를 초기화하는 코드(ex. `const numberOne = 5;`)에서는 데이터 타입을 명시적으로 지정하지 않는다**는 점이다. 이것은 Typescript에 내장되어 있는 **타입 추론(*Type Inference*)이라는 기능** 덕분인데, 쉽게 말해서 Typescript가 **변수에 지정된 값을 기반으로 해당 변수의 데이터 타입을 스스로 판단하여 지정**하는 것이다.

Typescript는 앞에서 설명한 것과 같이 ***정적 타입 언어***이다. 따라서 `const numberOne = 5;`와 같은 코드에서 `numberOne`이라는 변수에 숫자 5를 지정하고 있기 때문에 **`numberOne` 변수는 이미 `number` 타입으로 결정**된 것이다. 따라서 명시적으로 타입을 지정하지 않아도 Typescript는 해당 변수에 `number` 타입이 지정된다는 것을 자체적으로 파악할 수 있다.

물론 Typescript에서 제공하는 타입 추론 기능을 사용하지 않고, 다음과 같이 모든 변수에 대해 명시적으로 타입을 지정할 수도 있다.

```
const numberOne: number = 5;
const numberTwo: number = 2.8;
const printResult: boolean = true;
const resultPhrase: string = 'The Result is: ';
```

하지만 이는 중복된 내용의 코드를 작성하는 것이며, *Best Practice*로 간주되지 않기 때문에 될 수 있으면 **Typescript에 내장된 타입 추론 기능을 활용하는 것이 바람직하다.**

다만 명시적으로 변수의 데이터 타입을 지정해 주어야하는 경우가 존재하는데, **변수를 선언만 하고 초기화하지 않는 경우**이다. 다음의 예시와 같은 상황에서는 반드시 변수의 데이터 타입을 명시적으로 지정해야 한다.

```
let numberOne: number;

...

numberOne = 5;  // Correct!
numberOne = "5";  // Error!
```

**[중요]** `const` 예약어를 이용해 상수로 선언한 변수의 경우, 이후에 값이 변경되지 않기 때문에 단순히 `number` 타입으로 지정되지 않고 지정된 숫자 그 자체가 데이터 타입으로 지정된다. 예를 들어 `const numberOne = 5;`에서 `numberOne`의 데이터 타입은 `number`가 아니라 `5` 그 자체이다. `let` 예약어를 사용해 값이 추후에 변경될 수 있는 변수인 경우, `let numberOne = 5;`와 같이 변수에 숫자 값을 지정하면 `numberOne`의 데이터 타입은 `number`가 된다지정
<br>

