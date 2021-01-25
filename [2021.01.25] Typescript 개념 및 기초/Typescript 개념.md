# Typescript 개념

최근 대부분의 IT 회사에서 프론트엔드 개발자 구직공고를 올릴 때, 지원자격 또는 우대사항에 Typescript 사용 경험을 포함한다. 대체 Typescript가 무엇이고 어떤 장점을 가지기에 이렇게 인기가 많은 것인지 궁금하여 한 번 알아보기로 하였다.

<br>

## Why Typescript?

다음의 예시 코드를 통해 Typescript가 필요한 이유를 간략히 알아본다.

```
const button = document.querySelector(".button");
const inputA = document.querySelector(".number-one");
const inputB = document.querySelector(".number-two");

const adder = (num1, num2) => {
    return num1 + num2;
};

button.addEventListener("click", () => {
    console.log(adder(inputA.value, inputB.value));
});
```

위의 코드는 얼핏 보기에는 아무런 문제가 없는 듯 보이지만, `querySelector`로 선택된 **Input DOM에 `.value`를 통해 접근하는 경우, 그 결과는 항상 문자열**이라는 점에서 기대와 다르게 작동하게 된다.

사용자가 입력으로 5와 10을 입력한 경우 원하는 결과는 15이지만, 문자열을 더하는 것으로 작동하기 때문에 결과는 510이 되는 것이다.

Typescript를 사용하면 **약한 타입(Weak Typing) 언어인 Javascript를 면 C++, Java와 같은 강한 타입(String Typing) 언어와 같이 사용**할 수 있다. 즉, 개발자의 실수 또는 엄격한 타입 검증의 부재로 인해 **개발자의 의도와 다르게 작동할 수 있는 코드를 *컴파일 환경*에서 잡아내어, 런타임 환경에서 에러가 발생하는 것을 방지할 수 있다.**

[참고] 물론 위와 같이 간단한 코드의 경우, Javascript의 `typeof`를 사용해 함수 호출 시 전달된 매개변수의 데이터 타입을 검사할 수 있다. 하지만, 프로젝트의 규모가 커지면 이러한 방법으로 모든 데이터 타입 검사를 수행하기는 굉장히 어려워진다.

<br>

## Typescript 설치하기

Typescript를 사용하려면 다음과 같이 NPM을 이용해 설치해야 한다. 

```
npm install typescript // 지역 설치

or

npm install -g typescript  // 전역 설치
```

위의 NPM 명령어를 통해 설치한 것은 ***Typescript Compiler***이며, Typescript로 작성된 코드를 Vanilla Javascript 코드로 컴파일 해준다. 이는 **웹 브라우저가 자체적으로 Typescript를 실행할 수 있는 기능을 가지고 있지 않기 때문이다.** 

즉, Typescript로 작성한 코드는 그 자체로 실행할 수 없으며, 반드시 **컴파일러를 이용해 Javascript 코드로 변환하여 사용**해야 한다. 컴파일은 위의 명령어를 통해 Typescript를 설치하면 사용할 수 있는 `tsc` 명령어를 이용해 다음과 같이 수행한다.

```
tsc <Path_To_Typescript_File>
```

<br>

## Typescript 사용하기

Typescript를 이용해 코드를 작성하려면, 단순히 `.ts` 확장자의 파일을 생성하고 VS Code, Web Storm과 같은 IDE로 해당 파일을 편집하면 된다.

앞서 Typescript의 필요성에 대해 설명하기 위해 사용했던 Javscript 코드를 Typescript 코드로 다시 작성한 결과는 다음과 같다.

```
const button = document.querySelector(".button");
const inputA = document.querySelector(".number-one")! as HTMLInputElement;
const inputB = document.querySelector(".number-two")! as HTMLInputElement;

const adder = (num1: number, num2: number) => {
    return num1 + num2;
};

button.addEventListener("click", () => {
    const numberOne = parseInt(inputA.value);
    const numberTwo = parseInt(inputB.value);

    console.log(adder(numberOne, numberTwo));
});
```

`const inputA = document.querySelector(".number-one")! as HTMLInputElement`에서 사용된 `!`는 해당 변수는 어떠한 경우에도 `null`이 되지 않는다는 것을 의미한다. 또한 `as HTMLInputElement`는 해당 변수에 할당되는 HTML Element가 항상 Input Element라는 것을 의미한다. 

[참고] `<input>`을 제외한 대부분의 HTML Element는 `.value` 속성을 가지지 않는다.

다음으로, `const adder = (num1: number, num2: number) => { ... };`에서 함수의 인자로 받을 수 있는 `num1`과 `num2`에 대해 타입을 지정하고 있다. 이 경우, 함수가 사용될 때 매개변수로 숫자가 아닌 값이 전달되면 Typescript는 에러를 출력한다.

마지막으로 함수를 호출하기 이전에 `parseInt()` 메서드를 이용하여 `<input>` 태그의 `value` 속성을 통해 얻은 문자열을 숫자로 바꿔준다. 이후 최종적으로 앞에서 선언한 함수를 호출하고 두 개의 값을 매개변수로 전달하면, 원하는 방식대로 작동한다.

<br>

## Typescript 사용의 이점

1. 타입 지정
    - 데이터의 타입을 지정할 수 있다.
    - 따라서, 데이터의 타입에 대해 보다 명확하게 코드를 작성해야 한다.
    - 이로써 런타임에서 예상하지 못한 에러가 발생하는 것을 방지할 수 있다.
2. 차세대 문법 사용 가능
    - 최신 Javascript 문법(ES6, ES9 등)을 사용할 수 있다.
    - 컴파일 시, Babel을 사용하는 것과 같이 하위 버전의 Javascript 문법으로 변환된다.
3. Typescript 전용 문법
    - `interface`, `generics`와 같은 Typescript 전용 문법을 사용할 수 있다.
    - Javascript로 컴파일 되지는 않으며, 오직 개발 과정에서만 적용된다.
    - 보다 명확하고 폭 넓은 에러를 통해 타입을 점검할 수 있게 해준다. 
4. 메타 프로그래밍 기능
    - *Decorator*와 같은 메타 프로그래밍 기능을 사용할 수 있다.
5. 다양한 설정값을 통한 Typescript 사용자화
    - 굉장히 다양한 설정값을 제공하며, 예를 들어 타입 검사를 더 강하게, 또는 더 약하게 할 수 있다.
    - 이와 같은 설정을 통해 개발환경에 최적화하여 Typescript를 사용할 수 있다.
6. Typescript를 명시적으로 사용하지 않아도, 일부 기능 활용 가능
    - VS Code, Web Storm과 같은 IDE에서 기본적으로 Typescript 기능의 일부를 제공한다.
    - Vanilla Javascript로 작성한 코드에서도, 데이터 타입을 확인할 수 있다.