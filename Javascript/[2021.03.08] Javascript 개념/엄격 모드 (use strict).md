# 엄격 모드, `"use strict";`

3월 6일 토요일에 참여한 프로그래머스 데브 매칭에서 바닐라 JS에 대한 이해가 너무나 부족하다고 느껴졌고, 따라서 React, Vue 같은 프레임워크보다 그 모든것의 기저에 있는 Javascript 자체에 대해 처음부터 다시 공부하기로 했다.

가장 먼저 엄격 모드, `"use strict";`, 에 대해 공부한다.

<br>

## 엄격 모드란?

엄격 모드가 활성화되면 Javascript의 시멘틱에 변화가 발생하게 되며, 느슨한 모드(Sloppy Mode)에서는 **조용히 무시되던 에러들을 발생**시킨다.

엄격 모드를 통해 문제가 될 수 있는 가능성이 있는 코드를 쉽고 빠르게 감지할 수 있고, 결과적으로는 **디버깅 과정을 보다 편리**하게 해준다.

<br>

## 엄격 모드 활성화하기

엄격 모드는 _전체 코드_ 또는 *부분 함수*에 `"use strict";` 구문을 추가하여 활성화 할 수 있다.

엄격 모드를 활성화하기 위해 **특수한 예약어가 아닌 문자열을 사용**하는 것이 이상하게 느껴질 수 있다.

문자열이 아닌 특수한 예약어로 엄격 모드를 활성화하도록 했다면, *ECMAScript 5*부터 도입된 엄격 모드를 지원하지 않는 브라우저에서 엄격 모드를 사용하려고 할 때 에러가 발생할 수 밖에 없다.

Javascript는 100% 하위 호환(Backward Compatible)되도록 발전해 왔으므로, **엄격 모드를 지원하지 않는 브라우저에서는 단순한 문자열로 인식**하여 아무런 작업도 수행하지 않도록 한 것이다.

```javascript
// Sloppy Mode
function strictFunction() {
  // Strict Mode
  "use strict";
}
```

위와 같이 *전체 코드*는 느슨한 모드로 사용하고, *부분 함수 내부*에서만 엄격 모드를 사용도록 할 수도 있다.

<br>

## 엄격 모드 사용의 효과 (예시)

### 1. 선언되지 않은 변수에 값을 할당하지 못한다.

느슨한 모드에서는 선언되지 않은 변수에 값을 할당하는 것이 가능하다.

변수를 선언하지 않고 값을 할당하면, 실행 환경에 따른 **전역 객(`window` 또는 `global`)의 속성으로 해당 변수가 추가**된다.

예를 들어 브라우저 환경에서 변수의 선언 없이 `variable`이라는 변수에값을 할당하면, `window.variable`과 같이 전역 객체의 속성이 된다.

```javascript
variable = 10;
console.log(window.variable); // 10
```

이러한 Javascript의 동작은 편리할 수도 있지만, 아래와 같은 경우에는 문제가 된다.

```javascript
var theVal = 0;

thVal = 1; // 실수로 잘못 입력

if (theVal > 0) {
  console.log("Hello, World!"); // 작동되지 않음
}
```

개발자의 실수로 `theVal`이 아닌 `thVal`이라는 변수에 값을 잘못 할당했는데, Javascript의 **느슨한 모드에서는 아무런 에러가 발생하지 않으므로 디버깅 과정이 복잡**해진다.

```javascript
"use strict";

var theVal = 0;

thVal = 1; // 컴파일 에러 발생!

if (theVal > 0) {
  console.log("Hello, World!");
}
```

`"use strict";`를 코드의 상단에 추가하면, **엄격 모드에서는 선언되지 않은 변수에 값을 할당하는 것을 금지**하고 있기 때문에 `thVal = 1;` 위치에서 에러가 발생한다.

<br>

### 2. 차기 버전의 Javascript에서 사용되는 예약어를 사용할 수 없다.

엄격 모드에서는 **차기 버전의 Javascript에서 예약어로 사용되는 값을 변수명 등으로 사용**하는 경우 에러를 발생시킨다.

예를 들어 `ES6`부터 예약어로 사용되기 시작한 `const`와 `let`을 변수명으로 사용하려고 한다면, **느슨한 모드에서는 사용할 수 있지만 엄격 모드에서는 에러를 발생**시킨다.

```javascript
var let = 10;
```

```javascript
"use strict";

var let = 10; // 컴파일 에러 발생!
```

<br>

### 3. `delete` 연산자의 사용 제한.

엄격 모드가 활성화되어 있을 때 `delete` 연산자를 이용해 *변수*나 *함수*를 삭제하려고 하면, 에러를 발생시킨다.

```javascript
var foo = 10;
delete foo;

function bar() {}
delete bar;
```

느슨한 모드에서는 위의 예시 코드는 어떠한 에러도 발생시키지 않는다. 즉, *변수*와 _함수_ 모두 `delete` 연산자를 이용해 삭제할 수 있다.

```javascript
"use strict";

var foo = 10;
delete foo; // 컴파일 에러 발생!

function bar() {}
delete bar; // 컴파일 에러 발생!
```

반면 엄격 모드에서는 `delete` 연산자로 _변수_ 또는 *함수*를 삭제하려고 하면 에러를 발생시킨다. 또한, 함수에 *인자로 전달된 값*을 삭제하려고 하는 경우도 에러를 발생시킨다.

```javascript
"use strict";

function bar(arg) {
  delete arg; // 컴파일 에러 발생!
}
```

<br>

### 4. `eval` 연산자의 사용을 보다 안전하게 한다.

`eval` 연산자는 매개변수로 전달한 *Javscript 표현식*을 평가하고 수행하는데, 느슨한 모드에서는 **`eval`에서 선언된 변수가 외부 스코프로 유출**된다.

```javascript
eval("var foo = 10");

console.log(foo); // 10, eval에서 선언된 변수 사용 가능
```

이러한 경우, **개발자가 작성하지 않은 Javascript 코드가 외부에서 `eval` 연산자를 통해 주입되는 경우 보안상의 문제**가 될 수 있으며, 프로그램이 개발자가 의도한대로 작동하지 않게 된다.

하지만 엄격 모드에서는 `eval`에서 선언된 변수가 외부 스코프로 유출되지 않으며, 따라서 **`eval` 연산자의 사용을 보다 안전**하게 해준다.

```javascript
"use strict";

var foo = 5;

eval("var foo = 10");

console.log(foo); // 5, eval에서 선언된 변수 사용 불가능
```
