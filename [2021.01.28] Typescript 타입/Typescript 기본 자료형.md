# Typescript의 타입들

## `object` 타입

Typescript의 `object` 타입은 기본적으로 Javascript의 `typeof` 연산자가 `"object"`를 반환하는 모든 타입을 나타낸다. 

하지만 **이러한 `object` 타입은 `array`, `function`, `object` 등 여러 타입의 상위 타입**이기 때문에, 그다지 유용하게 사용되지 않는다.

따라서 Typescript에서는 보다 정확한 타입 지정을 위해 객체의 속성, 즉 **`property`에 대해 타입을 개별적으로 지정할 수 있는 개선된 `object` 타입**을 지원한다.

```
const person = {
    name: "Junyoung",
    age: "25"
};

console.log(person.nickname);
```

Typescript 파일(`.ts`)에서 임의의 객체를 선언한 뒤, `console.log(person.nickname);`와 같이 해당 객체에 존재하지 않는 속성에 접근하려고 시도하면 에러가 발생한다. 이는 Typescript가 앞서 설명한 타입 추론(Type Inference) 기능을 통해 **객체 자체와 해당 객체에 포함된 모든 `property`에 대해 타입을 지정**하기 때문이다. 
 
Typescript에서는 다음 세 가지의 방법으로 객체 데이터에 `object` 타입을 지정할 수 있다.

### 타입 추론에 의한 타입 지정

앞에서 확인한 것과 같이 **Typescript에 의해 추론된 `object` 타입은 Javacsript의 순수 `object` 타입과 같지 않다.** Typescript에 의해 추론된 `obejct` 타입은 다음과 같이 객체의 속성(`property`)에 대한 타입도 지정된다. 

```
const person : {
    name: string;
    age: number;
}
```

### 순수 `obejct` 타입 지정

Javascript의 `object` 타입과 같은 순수한 `obejct` 타입을 지정하고자 한다면 다음과 같이 변수에 `object` 타입을 명시적으로 지정하면 된다.

```
const person: object = {
    name: "Junyoung",
    age: "25"
};
```

이러한 경우, Typescript는 **`person` 변수가 `object` 타입인지 여부만 검사하고, 객체의 `property`에 대해서는 검사하지 않는다.** 따라서 `console.log(person.name);`과 같이 객체에 실제로 존재하는 속성에 접근하더라도 Typescript는 에러를 발생시킨다.
 

### 구체적인 `obejct` 타입 지정

변수에 `object` 타입을 명시적으로 지정하되, Typescript의 타입 추론에 의한 지정 결과와 같은 형태를 갖도록 할 수도 있다.

```
const person: { name: string; age: number;} = {
    name: "Junyoung",
    age: "25"
};
```

하지만 앞에서도 언급하였듯, 이러한 타입 지정 방식은 **타입 추론 기능을 사용할 수 있음에도 중복된 코드를 작성하는 것**이므로 되도록 사용하지 않는 것이 좋다.

### 중첩된 `object` 타입

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

위의 중첩된 객체(*Nested Obejct*)는 Typescript의 타입 추론에 의해 아래와 같이 데이터 타입이 지정된다.

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

<br>

## `array` 타입

Typescript의 `array` 타입은 Javascript의 `array` 타입과 같이 서로 다른 타입의 데이터를 포함(*Flexible*)할 수도 있고, 또는 지정된 하나의 타입만 포함(*Strict*)할 수도 있다.

```
const array = [`Hello`, `World!`];
```

위와 같이 문자열로만 이루어진 배열은 **Typescript의 타입 추론 기능에 의해 `string[]` 타입으로 지정**되며, 이것은 배열에 문자열을 제외한 다른 타입은 포함될 수 없다는 것을 의미한다. 즉, Typescript는 배열에 대해 기본적으로 *Strict*한 타입 지정을 수행한다.

```
let activities = string[];
activities = ["Game", 1];  // Type Error!
```

만약 위의 예시처럼 `Type[]` 리터럴을 사용해 Javascript의 기본 `array` 타입과 같이 **서로 다른 타입을 가질 수 있는 배열을 선언하려면, 배열의 타입을 `any[]`로 지정**하면 된다.

[참고] `any` 또는 `any[]` 타입을 자주 사용하는 것은 Typescript를 사용하는 의미를 퇴색 시키기 때문에, 최대한 사용을 자제하는 것이 옳다.

### `for` 문에서의 타입 추론

```
const hobbies = ["Game", "Sports", "Dance"];

for (const hobby of hobbies) {
    console.log(hobby.toUpperCase());
    console.log(hobby.map());   // Error!
}
```

위와 같이 Typescript로 작성된 `for` 문에서, **`hobby`의 타입이 문자열일 것으로 추론**되기 때문에, IDE에서 `toUpperCase()`와 같이 `String.prototype`에 존재하는 모든 메서드에 쉽게 접근할 수 있게 된다.

마찬가지로 `Array.prototype`에 존재하는 메서드인 `map()`을 사용하려고 하면 문자열인 `hobby`는 해당 메서드를 `prototype`에 가지고있지 않기 때문에 에러가 발생한다.

이와 같이 **Typescript는 타입 추론 하나만으로도 개발 과정에서 엄청난 이점**을 가져다 준다.

### `union array` 타입

`union` 타입에 대해서는 [문서의 아래쪽](##-`union`-타입)에서 별도로 기록한다.

<br>

## `tuple` 타입 (Typescript Only)

Typescript에서는 Javscript에 존재하지 않는 새로운 타입도 제공하는데, 그 중 하나가 `tuple` 타입이다. `tuple` 타입은 기존의 `array` 타입과 유사하지만, **고정된 길이와 각 위치에 지정된 타입만 가질 수 있다**는 점에서 다르다.

다음은 첫번째 위치에 숫자를, 두번째 위치에 문자열을 가지는 길이 2의 `tuple`의 예시이다.

```
let tuple: [number, string];
tuple = [1, "ABC"];
tuple = ["ABC", 1];  // Error!
tuple = [1, "ABC", "EFG"];  // Error!
```

`tuple` 타입은 Typescript의 타입 추론 기능에 의해 자동 지정되지 못하므로, 사용할 때 반드시 명시적으로 타입을 지정해 주어야 한다. 타입을 지정하지 않으면 Typescript는 **기본적으로 `union array` 타입으로 지정**한다.

또한, `tuple`은 정해진 타입의 고정된 길이 배열을 표현하지만, 이는 **데이터 할당(*Assign*)에만 국한**된다. 즉, `push()`나 `splice()` 등의 메서드를 통해 값을 삽입하는 행위는 방지할 수 없다.

```
let tuple: [number, string];
tuple = [1, "ABC"];

tuple[1] = 5;  // Error!
tuple.push("EFG");  // Not an Error!
```

<br>

## `enum` 타입 (Typescript Only)

`enum`은 Javscript에 존재하지 않는 또 다른 Typescript 전용 타입이다. `enum`은 **숫자 또는 문자열 값 집합에 **이름**을 부여**할 수 있는 타입으로, 값의 종류가 일정한 범위내에 존재하는 경우 유용하게 사용될 수 있다.

가장 대표적으로, 7개의 값으로 범위가 한정되는 요일을 `enum` 타입으로 선언해 사용하면 편리하다. 

[참고] `enum`의 변수명은 대문자로 시작한다.

```
enum Week {
    Sun,
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat
};

console.log(Week.Mon);  // 1
console.log(Week.Thu);  // 4
```

`enum` 타입의 재미있는 점은, **역방향 매핑(*Reverse Mapping*)을 지원**한다는 것이다. 열거된 이름(`Sun`, `Mon`, ...)으로 값(`0`, `1`, ...)에 접근할 수 있고, 반대로 값을 이용해 이름에도 접근할 수 있다는 것을 의미한다. 

추가적으로, 다음과 같이 부여된 이름에 특정한 값을 배정할 수도 있다. 

```
enum Week {
    Sun = 5,
    Mon,
    Tue,
    Wed = 100,
    Thu,
    Fri,
    Sat
};
```

이 경우, 숫자 5부터 시작하여 `Mon`에는 숫자 6, `Tue`에는 숫자 7이 각각 배정되게 된다. `Wed`부터는 다시 숫자 100부터 시작하고, `Thu`, `Fri`, `Sat`에는 각각 101, 102, 103이 배정된다.

<br>

## `any` 타입  

`any` 타입은 가장 유연한 타입으로, Typescript에게 데이터 형식에 대해 그 어떠한 정보도 제공하지 않는다. 즉, `any` 타입이 지정된 변수에는 모든 데이터 타입을 할당할 수 있다.

위에서 잠시 언급하였듯, `any` 타입을 남용하는 것은 Typescript 사용의 이점을 퇴색시키기 때문에 가급적 사용하지 말아야 한다. REST API 서버 등 외부에 접근해 데이터를 받는 경우와 같이, **데이터에 대한 타입 체크가 어려운 특별한 상황에 한정하여 `any` 타입을 사용**해야 한다.

<br>

## `union` 타입 (Typescript Only)

예를 들어 **두 숫자가 매개변수로 전달되면 두 수를 합한 결과를 반환하고, 두 문자열이 전달되면 두 문자열을 연결한 결과를 반환하는 함수**가 필요하다고 가정한다. 

이와 같이 **하나의 변수에 하나 이상의 데이터의 타입을 지정**해야 하는 경우, `union` 타입을 사용할 수 있다. 

변수에 `union` 타입을 지정하기 위해서는 `:Type` 리터럴을 작성할 때, 원하는 타입들을 `|` 연산자로 연결해주면 된다. 

```
const combine(inputA: number | string, inputB: number | string) {
    const result = inputA + inputB;  // Error!
    return reulst;
}
```

다만, 위와 같이 `union` 타입으로 지정된 변수에 `+` 연산을 하면 Typescript는 에러를 발생시킨다. 이는 Typescript가 **해당 변수가 `union` 타입인지만 검사하고, 내부에서 어떤 데이터 타입을 허용하고 있는지는 검사하지 않기 때문**이다.

따라서 `typeof` 연산자를 이용한 조건문 분기를 통해 허용한 타입들에 대해 적절한 로직을 수행할 수 있도록 코드를 작성해야 한다.

```
const combine = (inputA: number | string, inputB: number | string) => {
    
    let result;

    if (typeof inputA === "number" && typeof inputB === "number") {
        result = inputA + inputB;
    } else {
        // 명시적으로 문자열 연산임을 표시한다.
        result = inputA.toString() + inputB.toString();
    }  

    return reulst;
}
```

<br>

## `literal` 타입 (Typescript Only)

기본 자료형 `number`와 `string`에 대해 알아볼 때, `const number = 5;`와 같이 더 이상 값이 변하지 않는 *Constant* 변수의 경우 **데이터 타입이 `number`가 아닌 할당된 값 그 자체인 `5`가 된다**는 것을 확인했다. 

이렇게 타입이 특정한 값으로 지정된 경우를 `literal` 타입이라고 하며, `number` 또는 `string`과 같은 기본 타입에서 파생된 타입이라고 생각하면 된다.

```
let mode: "customer" | "admin";
```

위와 같은 경우, 변수 `mode`에는 **정확히 `"customer"` 또는 `"admin"` 두 개의 문자열만 할당**될 수 있으며, 그 외의 문자열을 할당하면 에러가 발생하게 된다. 

<br>

## 타입 별칭 (Type Aliases)

`type` 키워드를 사용해 **사용자 지정 타입**을 생성할 수 있으며, 한 개 이상의 타입을 조합하여 별칭(이름)을 부여할 수 있다. 일반적으로는 **반복되어 사용되는 `union` 타입에 대해 타입 별칭을 설정해 사용**한다.

```
type StringAndNumber = string | number;
type modeIdentifier = "customer" | "admin";

let mode: modeIdentifier;  // Only accepts "customer" or "admin"
```


위와 같이 `union` 타입의 조합에 대한 별칭을 부여하는 것 이외에도, **복잡한 형태의 객체에 별칭을 부여**해 새로운 데이터 타입으로 사용할 수 있다.

```
type User = { name: string; age: number };

const me: User = { name: "Junyoung", age: 26 };  // this works!
```