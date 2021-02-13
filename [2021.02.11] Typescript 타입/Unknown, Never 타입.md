# `unknown`과 `never` 타입

자주 사용되지는 않지만, 알아두면 좋은 타입인 `unknown`과 `never` 타입에 대해 기술한다.

<br>

## `unknown` 타입

`unknown` 타입은 `any` 타입과 같이, 어떠한 데이터 타입도 할당할 수 있다. 예를 들어 REST API 서버에서 전달 받을 데이터의 타입이 확정되지 않았거나 매번 변경되는 경우 사용할 수 있다. 하지만 `unknown` 타입은 Typescript에 의한 그 어떠한 타입 검사도 수행하지 않는 `any`와 달리, 최소한의 타입 검사를 수행한다.

예를 들어, `string` 타입이 지정된 변수에 `unknown` 타입의 데이터를 할당하려고 하는 경우 컴파일 에러가 발생하지만, `any` 타입의 데이터를 할당하는 경우는 컴파일 에러가 발생하지 않는다.

```
let userInput: unknown;
let userName: string;

userInput = "Junyoung";
userName = userInput;   // 컴파일 에러!
```

```
let userInput: any;
let userName: string;

userInput = "Junyoung";
userName = userInput;   // 에러 발생 X
```

사실상 모든 타입 검사 기능을 중단하는 `any` 타입에 비해 최소한의 타입 검사가 수행된다는 점에서 유용하게 사용될 수 있다. 위의 예시에서 발생한 **컴파일 에러를 해결하려면 다음과 같이 조건문을 수행**하면 된다.

```
let userInput: unknown;
let userName: string;

userInput = "Junyoung";
if (typeof userInput === "string") {
    userName = userInput;   // 에러 발생 X
}
```

<br>

## `never` 타입

`never` 타입은 함수의 반환 타입으로 지정할 수 있는 또 하나의 타입이다.  

예를 들어, 아래와 같은 `Error` 객체를 생성한 뒤 `throw`하는 함수가 있다고 하자. 

```
function generateError(message: string, code: number) {
    const newError = new Error();
    newError.message = message;
    newError.code = code;

    throw newError; 
}
```

위의 함수는 `throw`문의 특성에 따라, 함수의 끝까지 실행을 마치지 못하고 중단된다. 따라서 아무런 값을 반환하지 않는 함수의 실행 결과를 출력할 때와 달리 `undefined` 조차 출력되지 않는다.

```
console.log(generateError("An Error!", 500));   // 아무것도 출력되지 않는다.
```

이러한 함수는 Typescript에 의해 `void` 타입으로 추론되지만, 보다 명확하게 타입을 지정하고자 한다면 `never` 타입으로 지정해 주어야 한다. 

`void` 타입이 지정된 함수는 **값을 반환할 수도 있지만 그 값을 사용하지 않는다**는 의미인 반면, `never` 타입은 **절대 어떠한 값도 반환되지 않는다**는 의미이기 때문이다. 

따라서, `while (True) {}`와 같이 무한 루프를 돌아 함수가 종료되지 않는 경우나 위의 예시처럼 `throw`문에 의해 실행이 중단되어 함수의 끝에 도달하지 못하는 함수의 경우에는 `never` 타입으로 지정하여 **해당 함수는 어떠한 값도 반환하지 않는다는 것을 명시적으로 표시해주는 것이 좋다.**

