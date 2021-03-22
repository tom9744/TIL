# Array

Javascript의 배열(_Array_)에 대해 알아보기에 앞서, *Iterables*와 *Array-like Objects*가 무엇인지 간략하게 짚고 넘어간다.

- _Iterables_
  - 정확한 정의는 아니지만, 일반적으로 `for-of`문에 사용할 수 있는 객체를 의미한다.
  - 모든 *Iterables*가 배열인 것은 아니다.
  - *Iterables*의 예시: `NodeList`, `String`, `Map`, `Set` 등...
- _Array-like Objects_
  - `length` 속성(_Property_)을 가지며, 원소에 접근하기 위해 인덱스를 사용하는 객체를 의미한다.
  - 마찬가지로, 모든 *Array-like Objects*가 배열인 것은 아니다.
  - *Array-like Objects*의 예시: `NodeList`, `String` 등...

_Iterables_, *Array-like Objects*와 실제 *Array*의 가장 큰 차이점은 **원소를 조작할 수 있는 메서드의 제공 여부**이다. 즉, *Iterables*와 *Array-like Objects*는 `Array.prototype`에 포함된 다양한 메서드를 사용할 수 없다.

> 배열(_Array_)은 `new Array()` 생성자를 통해 생성된 **Array 타입의 객체**이며, 따라서 프로토타입 객체는 `Array.prototype`이 된다.

<br>

## 배열의 생성

### 배열 리터럴

기본적으로 여타 프로그래밍 언어와 같이 대괄호 `[]`를 이용하며, 대괄호 사이에 **0개 이상의 값**을 쉼표로 구분해 새로운 배열을 생성할 수 있다.

```javascript
const emptyArr = [];
const array = [1, 2, 3];
```

Javascript는 배열(_Array_)도 객체(_Object_)이다. 하지만 객체의 프로토타입 객체는 `Object.prototype`이고, 배열의 프로토타입 객체는 `Array.prototype`이라는 차이점이 존재한다.

<center><img src="./images/ObjectArrayPrototype.png" width="350" height="300"></center>

<br>

### `Array()` 생성자 함수

배열을 생성하는 두번째 방법으로, `Array.prototype.constructor` 프로퍼티로 접근할 수 있는 `Array()` 생성자 함수를 사용하는 것이다.

> 배열은 일반적으로 배열 리터럴 방식으로 생성하지만, 결국 내장 함수 `Array()` 생성자 함수로 배열을 생성하는 것을 단순화시킨 것에 불과하다.

주의할 점은, `Array()` 생성자 함수는 매개변수의 갯수에 따라 다르게 동작한다는 것이다.

```javascript
const arrA = new Array(3);
console.log(arrA); // [empty × 3]

const arrB = new Array(1, 2, 3);
console.log(arrB); // [1, 2, 3]
```

`Array()` 생성자 함수를 호출할 때 단 하나의 숫자만 인수로 전달하면, **그 숫자를 `length` 속성의 값으로 가지는 빈 배열을 생성**한다.

그 외의 경우, 리터럴 방식과 동일하게 인수로 전달된 값을 요소로 가지는 배열을 생성한다.

> `Array()` 생성자 함수의 경우, `new` 키워드를 사용하지 않아도 정상 작동한다.

<br>

### `Array.from()` 메서드

`Array.prototype`에 포함된 메서드 `from()`을 사용해 배열을 생성할 수 있다. 다만, `Array.from()` 메서드는 앞에서 살펴본 방법들과는 사용법이 다르다.

`Array.from()` 메서드는 *Iterables*와 *Array-like Objects*를 실제 배열로 변환하며, 따라서 **단 하나의 _Iterables_ 또는 _Array-like Objects_ 형태의 매개변수만 허용**한다.

```javascript
const arrA = Array.from(1, 2, 3); // TypeError!

const arrB = Array.from("Hello!");
console.log(arrB); // ["H", "e", "l", "l", "o", "!"]
```

`querySelectorAll()` 메서드를 사용하면 반환되는 `NodeList`와 같은 _Array-like Objects_ 형태의 데이터를 배열로 변환하는 가장 큰 목적은, **`Array.prototype`에서 제공하는 다양한 메서드를 사용하기 위함**이다.

<br>

## 배열 요소의 추가와 삭제

### `push()`와 `pop()`

`Array.prototype`에 포함된 `push()`, `pop()` 메서드를 사용해 배열에 요소를 추가하거나 삭제할 수 있다.

`push()` 메서드는 **배열의 가장 마지막에 인자로 전달된 값을 요소로 추가**하며, `pop()` 메서드는 **배열의 가장 마지막 요소를 제거**한다. 즉, 스택(_Stack_) 자료구조와 동일한 방식으로 동작한다.

추가적으로 `push()` 메서드는 요소를 추가한 뒤 **배열의 길이를 반환**하며, `pop()` 메서드는 **제거한 요소를 반환**한다.

```javascript
const arr = ["A", "B", "C"];

arr.push("D"); // 4, 배열의 길이 반환
arr.pop(); // "D", 제거한 요소 반환
```

<br>

### `unshift()`와 `shift()`

`Array.prototype`에 포함된 또다른 메서드인 `unshift()`와 `shift()`를 사용해 배열에 요소를 추가하고 삭제할 수 있다.

`unshift()` 메서드는 배열의 **가장 첫번째 위치에 요소를 추가**하며, `shift()` 메서드는 배열의 **가장 첫번째 위치에 있는 요소를 삭제**한다.

```javascript
const arr = ["A", "B", "C"];

arr.unshift("D");
console.log(arr); // ["D", "A", "B", "C"]

arr.shift();
console.log(arr); // ["A", "B", "C"]
```

> `unshift()`, `shift()` 메서드는 배열의 가장 첫번째 위치에 요소를 추가하고 삭제하기 위해 배열의 모든 요소를 한 칸씩 이동시기 때문에, 배열의 마지막 위치에서 요소룰 추가하고 삭제하는 `push()`, `pop()` 메서드를 사용하는 경우에 비해 성능이 좋지 못하다.

<br>

### 인덱스를 사용하는 방법

Javascript의 배열은 엄밀히 따지면 배열이 아니기 때문에, 인덱스로 배열에 접근해 동적으로 요소를 추가할 수 있다.

```javascript
const arr = [];
arr[1] = 1;
arr[3] = 3;

console.log(arr); // (4) [empty, 1, empty, 3]
console.log(arr[0]); // undefined
```

하지만 이와 같은 방법은 거의 사용되지 않으므로, 가능하다는 것 정도만 알아두면 충분하다.

<br>

### `splice()`

`Array.prototype`에 포함된 `splice()` 메서드는 전달한 인수의 개수에 따라 다르게 작동한다.

- `splice(startIndex, deleteCount)`
  - `startIndex` 위치부터 시작해, `deleteCount` 개수의 요소를 배열에서 삭제한다.
- `splice(startIndex, deleteCount, ...items)`
  - 위와 마찬가지로, `startIndex` 위치부터 `deleteCount` 개의 요소를 삭제한다.
  - 이후, 요소가 삭제된 위치에 `...items`에 전달된 값을 새로운 요소로 추가한다.
  - `...items`는 전개 연산자(_Spread Operator_)로, 1개 이상의 매개변수를 의미한다.

```javascript
const arr = [1, 2, 3, 4];

arr.splice(1, 1); // 인덱스 1 위치에서 요소 한 개를 삭제한다.
console.log(arr); // (3) [1, 3, 4]

arr.splice(1, 0, 3); // 인덱스 1 위치에서 요소 0개를 삭제하고, 새로운 값 3을 추가한다.
console.log(arr); // (4) [1, 2, 3, 4]
```

또한 `splice()` 메서드는 삭제한 요소들을 배열의 형태로 반환한다.

<br>

## 유용한 배열 관련 메서드

### `slice()`

`slice()` 메서드 역시, 전달받은 인수의 개수에 따라 다르게 작동한다.

- `slice()`
  - 대상 배열을 복사해 새로운 배열을 반환한다.
  - `slice()`로 복사된 배열은 **기존의 배열과는 참조값이 다른, 완전히 새로운 배열**이다.
- `slice(startIndex, endIndex)`
  - `startIndex` 위치부터 시작해, `endIndex` 위치까지 잘라내어 새로운 배열을 반환한다.
  - `endIndex`에 위치한 요소는 포함되지 않는다.
  - `slice(2)`와 같이, `endIndex`를 명시하지 않으면 `startIndex`부터 배열의 끝까지 자른다.

```javascript
const arr = [1, 2, 3, 4];

const copiedArr = arr.slice();
console.log(copiedArr); // (4) [1, 2, 3, 4]
console.log(copiedArr === arr); /// false

const slicedArr = arr.slice(0, 2);
console.log(slicedArr); // (2) [1, 2], 인덱스 2 위치는 포함하지 않는다.
```
