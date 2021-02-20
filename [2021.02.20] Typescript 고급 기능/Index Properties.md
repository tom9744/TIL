# Index Properties


## 왜 필요한가?

Typescript에서는 객체 타입을 단순히 `object` 타입으로 사용할 수도 있지만, 해당 객체가 **어떠한 속성(Properties)을 가지고 있는지 세부적으로 정의**할 수 있다.

```
const exampleObj: {
    name: string;
    age: number;
} = {
    name: "Junyoung",
    age: 26
};
```

하지만, 종종 **객체가 가지는 속성(Propeties)의 개수와 `key` 값을 사전에 미리 알 수 없는 경우도 존재**한다. 

예를 들어 사용자가 `<form>` 태그 내부의 `<input>` 태그들에  입력한 데이터를 검증(Validation)하려고 할 때, 각 필드에 대한 에러 메세지를 저장할 **`ErrorContainer` 객체의 속성(Properties)은 사용자 입력에 따라 그 개수와 `key`, `value` 값이 변화**할 수 있다.

**CASE 1**
```
interface ErrorContainer {
    email: string;      // 에러 필드: 에러 메세지
    username: string;   // 에러 필드: 에러 메세지
}
```

**CASE 2**
```
interface ErrorContainer {
    password: string;      // 에러 필드: 에러 메세지
}
```

위의 두 예시는 사용자의 입력에 따라 **`ErrorContainer` 객체가 가지는 속성들(Properties)이 매번 다른 `key` 이름을 갖거나, 그 개수가 달라지는 상황**을 가정한 것이다. 이러한 상황에서 유용하게 사용할 수 있는 것이 ***Index Property***이다.

<br>

## 사용법

```
interface ErrorContainer {
    [key: string]: string;
}
```

우선 *Index Property*를 사용하기 위해서는, `[]`를 사용해 속성(Property)의 `key` 값에 대한 타입 지정부터 진행한다.

예시에서는 `[key: string]`와 같이 `key` 값으로 '문자열' 형식만 사용할 수 있도록 하였는데, `key` 값의 타입으로는 **`boolean`을 제외한 `number`, `stirng`, 또는 `Symbol`을 사용**할 수 있다.

[참고] `[key: string]`에 포함된 `key`는 임의의 값이며, 아무 값이나 사용할 수 있다.

다음으로는 `[key: string]: <Type>;`과 같이 `value` 값에 대한 타입 지정을 진행하며, 예시에서는 `[key: string]: string;`를 통해 **`value`의 값으로 역시 '문자열' 형식만 사용**할 수 있도록 하였다.

```
interface ErrorContainer {
    [key: string]: string;
    id: string;
}
```

*Index Property*에서 지정하고 있는 형식 **`[key: string]: string;`을 따른다면, 위의 예시의 `id: string;`처럼 사전 정의 속성을 추가**할 수 있다.

```
interface ErrorContainer {
    [key: string]: string;
    id: number;  // 컴파일 에러
}
```

만약 *Index Property*에서 지정하고 있는 형식이 아닌 속성을 추가하려고 하면 위와 같이 컴파일 에러가 발생한다.

<br>

## 예제

```
interface ErrorContainer {
    [key: string]: string;
}

const errorBag: ErrorContainer = {
    email: "Not a valid email!",
    1: "This works!"
};
```

위는 *Index Property*를 가지는 `ErrorContainer Interface`를 사용해 새로운 객체를 생성하는 예시이다.

`1: "This works!"`는 `key`의 값으로 숫자 1을 설정하였지만, **문자열로 자동 형변환**되어 컴파일 에러가 발생하지 않는다. 

```
interface ErrorContainer {
    [key: number]: string;
}

const errorBag: ErrorContainer = {
    email: "Not a valid email!",    // 컴파일 에러!
    1: "This works!"
};
```

반대로 *Index Property*가 `[key: number]: string`과 같이 `key` 값으로 오직 숫자만을 허용한다면, `email: "Not a valid email!"`에서 컴파일 에러가 발생한다.

<br>

## 결론

*Index Property*는 객체가 가질 수 있는 **속성의 개수**와 **각 속성의 `key` 값**을 한정하지 않으므로 객체에 **굉장히 높은 수준의 유연성을 제공**한다.

