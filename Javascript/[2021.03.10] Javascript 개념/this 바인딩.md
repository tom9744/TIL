# `this` 바인딩

Javascript의 함수는 호출될 때 `()`를 통해 명시적으로 전달되는 매개변수 이외에, **`arguments 객체`와 `this`를 암묵적으로 전달** 받는다.

따라서 Javascript의 모든 함수 내부에서 `arguemnts`와 `this`를 통해 어떠한 값에 접근할 수 있다.

```javascript
function sum(numA, numB) {
  console.log(arguments); // 암묵적으로 전달된 값
  console.log(this); // 암묵적으로 전달된 값

  return numA + numB;
}

sum(10, 20); // 30
```

특히 `this`는 Java와 같은 언어에서의 `this`와 개념적으로 다르기 때문에, Javascript에서 `this`의 동작에 대해 명확히 알아둘 필요가 있다.

Java에서 `this`는 클래스의 생성자를 사용해 생성된 **인스턴스 자기자신을 가리키는 참조변수**이다. 주로 **전달된 매개변수와 인스턴스 내부에 가지고 있는 변수의 이름이 동일할 때, 이를 구분하**기 위해 사용된다.

```java
public Class Person {
    private String name;

    public Person(String name) {
        this.name = name;  // 매개변수와 내부변수(필드)의 이름을 구분
    }
}
```

하지만 Javascript의 `this`는 항상 객체 자기자신을 가리키지 않으며, **함수의 호출 방식에 따라 `this`에 바인딩되는 객체가 변화**한다.

<br>

## 함수 호출 방식과 `this`의 바인딩

Javascript의 경우 함수가 호출되는 방식에 따라 `this`에 바인딩되는 객체가 **동적으로 결정**된다. Java와 같이 `this`에 항상 동일한 객체가 바인딩되는 것이 아니라는 것이다.

[참고] 함수의 상위 스코프를 결정하는 방식인 *렉시컬 스코프*와는 다르다. *렉시컬 스코프*는 함수가 선언되는 위치에서 해당 함수의 상위 스코프를 결정하는 방식이다.

Javascript에서 함수를 호출할 수 있는 방법은 다음과 같다.

1. **함수 호출**
   - 일반적으로 `function()`과 같이 함수를 호출하는 것을 말한다.
2. **메서드 호출**
   - 메서드란, 객체 내부에 포함된 함수를 말한다.
   - 메서드 호출은 `object.function()`과 같은 형태이다.
3. **생성자 함수 호출**
   - 새로운 객체를 생성하기 위해 `new Object()`와 같이 호출하는 것을 말한다.
4. **`apply()`, `call()`, `bind()` 호출**
   - `Function` 객체의 `prototype`에 포함된 함수를 이용해 호출하는 것을 말한다.

```javascript
// 함수 표현식으로 함수 선언
var foo = function () {
  console.log(this);
};

// 1. 함수 호출
foo(); // window

// 2. 메서드 호출
var object = { foo: foo };
object.foo(); // object

// 3. 생성자 함수 호출
var instance = new foo(); // instance

// 4. apply(), call(), bind() 호출
var bar = { name: "bar" };
foo.call(bar); // bar
foo.apply(bar); // bar
foo.bind(bar)(); // bar
```

<br>

### 1. 함수 호출 시 `this` 바인딩

Javascript는 **모든 객체의 유일한 상위 객체인 전역 객체**를 가지는데, *브라우저*에서 실행되면 `window 객체`를, *Node.js*에서 실행되면 `global 객체`를 전역 객체로 가지게 된다.

전역 객체는 전역 스코프(= _Global Scope_ 또는 _File Scopre_)를 따르는 전역 변수(Global Variable)를 속성(Property)으로 소유한다.

전역 스코프에서 선언한 모든 함수는 전역 객체의 속성으로 접근할 수 있는 전역 객체의 메서드가 된다.

```javascript
var global = "Global";

console.log(global); // Global
console.log(window.global); // Global

function foo() {
  console.log("Global Object's Method");
}

window.foo(); // Global Object's Method
```

Javascript는 **기본적으로 `this`에 전역 객체를 바인딩**한다. 전역 스코프에서 선언된 함수는 물론, 그 함수의 내부에 선언된 **내부 함수에서도 `this`는 전역 객체**가 된다.

```javascript
function outer() {
  console.log(`outer's this: ${this}`);

  function inner() {
    console.log(`inner's this: ${this}`);
  }

  inner(); // inner: window
}

outer(); // outer: window
```

[중요] 또한, 객체의 **메서드의 내부 함수인 경우에도 `this`에 전역 객체가 바인딩**된다. 이 부분은 헷갈릴 수 있으므로 꼭 정확히 기억해 놓아야 한다.

```javascript
var value = 10;

var object = {
  value: 100,

  method: function () {
    console.log(`method's this: ${this}`); // object
    console.log(`method's this.value: ${this.value}`); // 100

    function methodInner() {
      console.log(`methodInner's this: ${this}`); // window
      console.log(`methodInner's this.value: ${this.value}`); // 10
    }

    methodInner();
  },
};

object.method();
```

[중요] 콜백 함수에서도 `this`에 전역 객체가 바인딩 된다.

```javascript
var value = 10;

var object = {
  value: 100,

  method: function () {
    setTimeout(function () {
      console.log(`callback's this: ${this}`); // window
      console.log(`callback's this.value: ${this.value}`); // 10
    }, 1000);
  },
};

object.method();
```

요약하자면 내부 함수는 일반 함수, 메서드, 콜백 함수 등 **선언된 위치와 관계없이 항상 `this`에 전역 객체(`window` 또는 `global`)가 바인딩** 된다.

내부 함수에서 `this`에 전역 객체가 바인딩되는 것을 방지하기 위해 `var that = this;`와 같이 **변수에 외부의 `this`를 저장하여 사용**하기도 한다.

```javascript
var value = 10;

var object = {
  value: 100,

  method: function () {
    var that = this; // that === object

    console.log("method's this: ", this); // object
    console.log("method's this.value: ", this.value); // 100

    function methodInner() {
      console.log("methodInner's this: ", this); // window
      console.log("methodInner's this.value: ", this.value); // 10

      console.log("methodInner's that: ", that); // object
      console.log("methodInner's that.value: ", that.value); // 100
    }

    bar();
  },
};

object.method();
```

위의 예시 코드를 그림으로 나타내면 다음과 같다.

<br>

![함수 호출 방식에 따른 this](./FunctionInvocationPattern.png)

<br>

### 2. 메서드 호출 시 `this` 바인딩

함수가 객체의 속성인 경우, 특별히 *메서드*라고 부른다.

객체에 포함된 메서드의 `this`에는 **해당 메서드를 소유한 객체**가 바인딩 된다. 즉, **해당 메서드를 호출한 객체**가 바인딩되는 것이다.

```javascript
var objectA = {
  name: "Lee",

  sayHello: function () {
    console.log(this.name);
  },
};

var objectB = {
  name: "Kim",
};

// objectB에 objectA의 "메서드에 대한 참조"만 복사된다.
objectB.sayName = objectA.sayName;

objectA.sayName(); // Lee
objectB.sayName(); // Kim
```

[주의] `objectA` 객체의 `sayHello` 속성은 함수이며, 함수는 *참조 타입*이므로 **함수에 대한 참조만 전달**될 뿐, 실제 함수가 복사되어 `objectB`에 전달되지는 않는다.

<br>

![메서드 호출 방식에 따른 this](./MethodInvocationPattern.png)

<br>

### 3. 생성자 함수 호출 시 `this` 바인딩

생성자 함수는 말 그대로 **새로운 객체를 생성하는 함수**를 말한다.

ES6에서 `constructor()`가 등장하기는 했지만, 그 이전까지 Javascript에는 별도의 생성자 함수가 존재하지 않았으며, **일반 함수에 `new` 키워드를 붙여서 호출하면 생성자 함수로 동작한다.**

이러한 특성 때문에 ES6 이전의 Javascript에서 생성자 함수를 선언할 때, **첫 문자를 대문자로 작성하는 방식으로 일반 함수와 생성자 함수를 구분**하였다.

```javascript
// 생성자 함수 (대문자)
function Person(name) {
  this.name = name;
}

var me = new Person("Lee");
console.log(me); // Person {name: "Lee"}

// new 키워드를 사용하지 않으면 생성자 함수로 동작하지 않는다.
var you = Person("Kim");
console.log(you); // undefined
```

`new` 키워드를 사용해 함수를 호출하면 `this` 바인딩이 일반 함수나 메서드를 호출하는 경우와는 다른 방식으로 일어난다.

<br>

#### **생성자 함수의 동작 방식**

`new` 키워드와 함께 생성자 함수를 호출하면 다음과 같은 순서로 작동한다.

1. 빈 객체 생성 및 `this` 바인딩
   - 생성자 함수의 내부 로직을 수행하기에 앞서, 비어있는 객체가 생성된다.
   - 생성자 함수 내부에서 사용되는 `this`는 이 빈 객체를 가리킨다.
   - 생성된 빈 객체는 **생성자 함수의 `prototype` 속성이 가리키는 객체**를 자신의 프로토타입 객체로 설정한다.
2. `this`를 이용한 속성/메서드 생성
   - 생성된 빈 객체에 `this`를 통해 동적으로 속성/메서드를 추가한다.
3. 생성된 객체 반환
   - 반환문이 없는 경우, `this`에 바인딩된 새로 생성한 객체가 반환된다.
   - 명시적으로 `return this;`를 해도 위와 같이 작동한다.
   - 다른 것을 반환하는 경우, 해당 함수는 생성자로 사용되지 못한다.

```javascript
function Person(name) {
  // -------------------- 1. 빈 객체 생성 및 `this` 바인딩
  this.name = name; //--- 2. `this`를 이용한 속성/메서드 생성
  // -------------------- 3. 생성된 객체 반환
}

var person = new Person("Lee");
console.log(person.name); // Lee
```

<br>

![생성자 함수 작동방식](./Constructor.png)

<br>

### **객체 리터럴 방식과 생성자 함수 방식의 차이**

```javascript
// 1. 객체 리터럴 방식
var personA = {
  name: "Yang",
};

// 2. 생성자 함수 방식
function Person(name, gender) {
  this.name = name;
}

var personB = new Person("Lee");
```

객체를 생성하는 과정에서 객체 리터럴 방식과 생성자 함수 방식의 **차이는 프로토타입 객체**에 있다.

- 객체 리터럴 방식
  - 생성된 객체의 프로토타입 객체는 `Object.prototype`이다.
  - 암묵적으로 `Object()` 생성자 함수를 호출하기 때문이다.
- 생성자 함수 방식
  - 생성된 객체의 프로토타입 객체는 `Person.prototype`이다.
  - 명시적으로 `Person()` 생성자 함수를 호출하기 때문이다.

<br>

## 4. apply(), call(), bind() 호출 시 `this` 바인딩

`this`에 바인딩 될 객체는 함수를 호출하는 방식에 의해 결정되는 것을 앞의 1, 2, 3번 경우를 통해 알았다. 이러한 `this`의 바인딩은 *Javascript Engine*에 의해 **암묵적**으로 수행된다.

Javascript는 개발자가 `this`를 **명시적**으로 바인딩할 수 있는 방법도 제공하고 있으며, 그것은 `Function.prototype` 객체에 포함된 `apply()`, `call()` 메서드이다.

```javascript
/**
 * @param {Object} thisArg 함수 내부의 this에 바인딩할 객체
 * @param {Array} argsArray 함수에 전달할 인자(Argument)들의 배열
 */
func.apply(thisArg, [argsArray]);
```

중요한 점은 `apply()` 메서드를 **호출하는 주체는 함수**이며 `apply()` 메서드는 `this`에 특정 객체가 바인딩 되도록 할 뿐, **본질적인 기능은 함수 호출**이라는 것이다.

```javascript
var Person = function (name) {
  this.name = name;
};

var person = {};

// 생성자 함수 Person()을 호출하며, 이때 this에 객체 person를 바인딩한다.
Person.apply(person, ["Lee"]);

console.log(person); // { name: "Lee" }
```

`apply()` 메서드의 대표적인 용도는 `arguments` 객체와 같은 **유사 배열 객체**에 배열 메서드(= `Array.prototype`에 포함된 메서드)를 사용해야 하는 경우이다.

`arguments` 객체는 배열같은 모양을 하고 있을 뿐, 실제 배열은 아니기 때문에 `slice()` 같은 배열 메서드를 사용할 수 없으나 **`apply()` 메서드를 이용하면 가능**하다.

```javascript
function convertArgsToArray() {
  // arguments 객체를 배열로 변환
  var arr = Array.prototype.slice.apply(arguments); // arguments.slice()와 동일

  console.log(arr); // 1 2 3
  return arr;
}

convertArgsToArray(1, 2, 3);
```

`call()` 메서드는 `apply()`와 동일한 기능을 수행하지만, `apply()`의 두번째 인자에서 **배열 형태로 넘긴 것을 각각 하나의 인자로 전달**한다.

```javascript
Person.apply(foo, [1, 2, 3]); // 인자를 배열의 형태로 전달

Person.call(foo, 1, 2, 3); // 단일 인자로 전달
```

`apply()`와 `call()` 메서드는 콜백 함수의 `this`에 원하는 객체를 바인딩하기 위해 사용되기도 한다.

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.doSomething = function (callback) {
  if (typeof callback == "function") {
    callback.call(this); // callback의 this에 Person 객체가 바인딩되게 한다.
  }
};

function foo() {
  console.log(this.name); // foo()의 this에는 전역 객체가 바인딩 되어있다.
}

var p = new Person("Lee");
p.doSomething(foo); // 'Lee'
```

ES5에 추가된 `Function.prototype.bind`를 사용하는 방법도 가능하다.

`Function.prototype.bind`는 함수에 인자로 **전달한 `this`가 바인딩된 새로운 함수를 반환**한다.

간단히 말해서 `bind()`는 대상 함수의 `this`에 인자로 전달한 객체를 바인딩 하지만, `call()` 또는 `apply()`와 달리 즉시 실행하지 않는다.
