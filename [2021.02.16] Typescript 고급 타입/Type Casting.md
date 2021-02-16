# Type Casting (타입 단언)

## Type Casting 이란?

Typescript가 **타입 추론을 통해 변수의 타입을 판단할 수 없지만, 개발자가 그 변수의 타입에 대해 이미 알고 있는 경우 *Type Casting*을 수행**할 수 있다.

*Type Casting*이란 **"변수가 반드시 특정한 타입만을 가진다"고 단언하는 것**이며, 따라서 Typescript는 더 이상 해당 변수에 대한 타입 추론을 하지 않는다.  

가장 좋은 예시는 `querySelector` 또는 `getElementById`와 같이 HTML DOM에 접근하는 경우이다. 

Typescript는 라이브러리를 통해 `HTMLElement` 타입을 사용하고 어느정도 추론할 수는 있지만, ***Tag Name*이 아닌 *Class Name* 또는 *ID*를 이용하는 경우 세부적인 타입 추론은 불가능**하다.

```
const paragraph = document.querySelector("p");      // HTMLParagraphElement 타입
const someElem = document.querySelector(".card");   // HTMLElement 타입 
```

`document.querySelector("p")`와 같이 ***Tag Name*을 이용하는 경우, Typescript는 대상 DOM의 세부 종류(= Paragraph)까지 추론**할 수 있다.

하지만, 두 번째 예시와 같이 *Class Name*을 이용하면 `HTMLParagraphElement`처럼 세부적인 DOM의 종류는 알지 못하고 `HTMLElement` 타입까지만 추론이 가능하다.

[참고] `HTMLElement` 타입은 사실상 `any` 타입과 같으며, 의미가 없다.

<br>

## Type Casting 수행하기

```
const someElem = document.querySelector(".card");   // HTMLElement 타입

someElem.value = "Hi, there!"   // 컴파일 에러!
```

[참고] `.value` 속성은 `<input>` 태그와 같은 일부 DOM만 가지고 있다.

위에서 Typescript는 타입 추론을 정상적으로 수행하지 못하지만 개발자는 HTML 코드를 확인해 대상 DOM의 종류를 파악할 수 있다. 즉, **개발자가 Typescript 보다 변수의 타입에 대해 더 잘 알고 있는 상황**인 것이다.

예를 들어 `.card` 클래스를 가지는 DOM의 종류가 `<input>`인 경우, `someElem`이라는 변수가 **`HTMLInputElement` 타입만을 가진다고 확인할 수 있기 때문에 *Type Casting*을 수행**할 수 있다.

*Type Casting*을 수행하는 방법에는 아래의 두 가지가 있다.

```
const someElem = <HTMLInputElement>document.querySelector(".card");

const someElem = document.querySelector(".card")! as HTMLInputElement;
```

`document.querySelector(".card")! as HTMLInputElement;`에서 사용된 `!`는 특별한 의미를 가지는데, **`!` 앞의 변수는 절대 `null`이 되지 않는다는 것을 의미**한다.

즉, `const someElem = document.querySelector(".card")! as HTMLInputElement;`는 변수 `someElem`가 **`null`이 될 수 없으며 항상 `HTMLInputElement` 타입**이라는 뜻이다.

만약 `document.querySelector(".card")! as HTMLInputElement;`가 `null`이 되지 않는다고 확실할 수 없는 경우, `!`를 제거하고 다음과 같이 사용하면 된다.

```
const someElem = document.querySelector(".card") as HTMLInputElement;

if (someElem) {
    someElem.value = "Hi, there!"   // 컴파일 에러!
}
```

또는

```
const someElem = document.querySelector(".card");

if (someElem) {
    (someElem  as HTMLInputElement).value = "Hi, there!"   // 컴파일 에러!
}
```


[참고] `<HTMLInputElement>document.querySelector(".card");`와 같이 `<>`를 사용하는 문법의 경우 ***React.js*의 *JSX* 문법과 충돌**할 수 있다. 

