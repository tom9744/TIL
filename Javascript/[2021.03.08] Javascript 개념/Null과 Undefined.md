# Null과 Undefined

Javascript에서 **'값이 없음'을 나타내기 위해 사용되는 Null 타입과 Undefined 타입**은 비슷하면서도 굉장히 다르기 때문에 그 차이점을 잘 알아야 한다.

<br>

## Undefined

### Undefined 타입의 정의

기본적으로 변수를 선언하고 아무런 값을 할당하지 않았을 때, 그 변수는 Undefined 타입이 된다.

**Undefined 타입의 변수는 `undefined`를 값**으로 가진다.

```javascript
var variable;

console.log(variable); // undefined
```

따라서 위의 예시 코드와 같이 `variable` 변수를 선언하고 아무런 값을 할당하지 않으면 `variable` 변수는 자동적으로 Undefined 타입이 되고, 값으로 `undefined`를 가지게 되기 때문에 `console.log()`로 출력하면 `undefined`가 출력되는 것이다.

즉, Undefined 타입은 Javascript에 의해 사용되며 **초기화 되지 않은 변수**를 나타내는 것이다.

여기서 **초기화 되지 않은 변수**는 다음과 같은 의미를 갖는다.

- 초기화되지 않은 변수
- 객체 내부에 존재하지 않는 속성
- 함수에 전달되지 않은 매개변수

### Undefined 타입의 예시

```javascript
var obj = {};

console.log(obj.prop); // undefined
```

```javascript
var arr = [1, 2, 3];

console.log(arr[10]); // undefined
```

```javascript
function func(arg) {
  console.log(arg); // undefined
}

func();
```

```javascript
console.log(typeof undefined); // undefined
```

<br>

## Null

### Null 타입의 정의

Null 타입은 **명시적으로 값이 비어있다는 것을 나타내기 위해 사용**되는데, Undefined 타입과 달리 변수가 **자동으로 Null 타입으로 설정되지는 않는다**는 것이다.

Null 타입도 Undefined 타입과 같이, **`null`을 유일한 값**으로 가진다.

[참고] Java, C++과 같은 정적 타입 언어에서의 Null은 실제적으로 아무런 값도 가지지 않지만, Javascript의 Null은 `null`이라는 값을 가진다는 점에서 다르다.

```javascript
var variable = null;

console.log(variable); // null
```

위의 예시 코드와 같이 변수를 Null 타입으로 설정하려면, **반드시 `null`이라는 값을 변수에 할당**해야 한다. 그렇지 않으면 Javascript 엔진에 의해 Undefined 타입으로 설정된다.

즉, Null 타입은 개발자에 의해 사용되며 **값이 비어있는 변수**를 나타내는 것이다.

### Null 타입의 예시

```javascript
var variable = null;

console.log(variable); // null
```

```javascript
var obj = {
  foo: null,
};

console.log(obj.foo); // null
console.log(obj.bar); // undefined
```

```javascript
console.log(typeof null); // object(!?)
```

<br>

## Undefined vs. Null

Undefined 타입과 Null 타입의 가장 큰 차이점은 **사용 주체**라고 할 수 있을 것이다. 앞의 각 타입의 정의에서 언급하였듯, Undefined 타입은 **Javascript 엔진에 의해 사용**되고 Null 타입은 **개발자에 의해 사용**된다.

Javascript 엔진이 스스로 어떠한 변수의 타입을 Null 타입으로 지정하는 일은 결코 없으며, 여기서 중요한 시사점을 도출할 수 있다.

### **개발자가 '값이 없음'을 표현하기 위해서는 Null 타입을 사용해야 한다.**

개발자가 '값이 없음'을 표현하기 위해 Undefined 타입을 사용하게 되면, Javascript 엔진이 '초기화되지 않은 변수' 또는 '존재하지 않는 객체 속성'을 표현하기 위해 **이미 Undefined 타입을 사용하고 있기 때문에 그 의미가 불분명**해진다.

```javascript
let foo;
let bar = undefined; // 개발자가 '값이 없음'을 표현하기 위해 Undefined 타입 사용

console.log(foo); // undefined
console.log(bar); // undefined (초기화되지 않은 것인지, 값이 없는 것인지 불분명)
```

```javascript
let objA = {};
let objB = {
  prop: undefined, // 개발자가 '값이 없음'을 표현하기 위해 Undefined 타입 사용
};

console.log(objA.prop); // undefined
console.log(objB.prop); // undefined (초기화되지 않은 것인지, 값이 없는 것인지 불분명)
```

위의 예시 코드는 '초기화되지 않은 변수'와 '값이 없음'을 나타내기 위해 모두 Undefined 타입을 사용하고 있어 그 의미가 불분명하다. 두 경우를 명확히 구분하기 위해서, **개발자는 명시적으로 '값이 없음'을 나타낼 때 반드시 Null 타입을 사용**해야 한다.

```javascript
let foo;
let bar = null; // 개발자가 '값이 없음'을 표현하기 위해 Null 타입 사용

console.log(foo); // undefined
console.log(bar); // null (초기화되지 않은 것인지, 값이 없는 것인지 구분 가능)
```

```javascript
let objA = {};
let objB = {
  prop: null, // 개발자가 '값이 없음'을 표현하기 위해 Null 타입 사용
};

console.log(objA.prop); // undefined
console.log(objB.prop); // null (초기화되지 않은 것인지, 값이 없는 것인지 구분 가능)
```

<br>

## Null Check

어떠한 변수의 값이 `null` 또는 `undefined` 인지 검사하는 것을 *Null Check*라고 한다.

*Null Check*는 **값의 존재 여부에 따라 코드의 실행 여부를 결정하기 위해 수행**되며, 아래의 예시 코드는 *Null Check*의 결과에 따라 `console.log()`의 실행 여부를 결정하고 있다.

```javascript
function printValue(input) {
  if (input !== null && input !== undefined) {
    console.log(input);
  }
}

printValue(10); // 10
printValue(); // Nothing
```

하지만 매번 `input !== null && input !== undefined`와 같이 길이가 긴 표현식을 사용하는 것은 비효율적이다. 따라서 아래와 같이 표현식을 줄여서 *Null Check*를 수행할 때 사용할 수 있다.

```javascript
// 아래 세 개의 표현식(Expression)은 완전히 같은 의미이다.
input !== null && input !== undefined;
input != null;
input != undefined;
```

`input !== null && input !== undefined` 표현식을 `input != null` 또는 `input != undefined`로 줄여서 사용할 수 있는 것은 Javascript의 `==` 연산자의 특성 때문이다.

`==` 연산자는 **두 피연산자의 타입이 다르면 한 쪽 피연산자의 타입을 변환**한 후 값만을 비교하는 데, `undefine`와 `null`을 비교하는 경우 `true`를 반환한다.

```javascript
null == undefined; // true
undefined == null; // true

null == 0; // false
null == ""; // false
undefined == false; // false
undefined == NaN; // false
```
