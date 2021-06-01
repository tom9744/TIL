# 유용한 배열 관련 메서드

## `slice()`

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

<br>

## `indexOf()`와 `lastIndexOf()`

`indexOf()`와 `lastIndexOf()` 메서드는 인수로 전달받은 값이 배열 내에 존재하는지 확인하고, 존재하는 경우 그 요소의 인덱스 값을 반환한다.

만약 전달받은 인수값이 배열 내에 **존재하지 않으면 `-1`을 반환**하고, 일치하는 값이 **1개 이상이라면 가장 첫번째 요소의 인덱스 값만 반환**한다.

```javascript
const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];

console.log(arr.indexOf(2)); // 1
console.log(arr.lastIndexOf(2)); // 7
console.log(arr.indexOf(10)); // -1
```

마지막으로 주의해야할 점은, `indexOf()`와 `lastIndexOf()` 메서드는 오직 원시타입(_Primitive Type_)의 요소에만 적용할 수 있다는 점이다.

배열, 객체와 같은 참조 타입(_Reference Tyoe_)의 요소를 탐색하려고 하는 경우, 그러한 요소가 배열에 존재하더라도 항상 `-1`이 반환된다.

```javascript
const arr = [{ name: "Jun" }, { name: "Soo" }];

console.log(arr.indexOf({ name: "Jun" })); // -1
```

> 이러한 현상은 참조 타입(_Reference Tyoe_)의 데이터는 비록 생김새가 동일하더라도 완전히 같은 객체가 아닌 이상, 그 참조값이 모두 다르기 때문이다.

<br>

## `find()`

참조 타입(_Reference Tyoe_)의 요소를 탐색할 수 없는 `indexOf()`와 `lastIndexOf()`의 단점을 보완하기 위해 `find()` 메서드를 사용할 수 있다. `find()` 메서드는 앞서 소개한 메서드와 달리, 콜백 함수(_Callback Function_)를 매개변수로 받는다.

콜백 함수는 기본적으로 `elem`, `index`, `fullArr`과 같은 세 개의 매개변수를 전달 받을 수 있다. 각각은 _배열의 단일 요소_, _단일 요소의 인덱스_, *전체 배열*이며, 매개변수명은 마음대로 변경해 사용할 수 있다.

`find()` 메서드는 배열의 각 요소에 대해 전달받은 콜백 함수를 실행하며, 콜백 함수는 특정한 조건에 따라 `true` 또는 `false`를 반환한다. 만약 **조건에 부합하는 요소를 발견해 `true`가 반환되면, `find()` 메서드 해당 요소를 반환하고 종료**된다.

```javascript
const arr = [{ name: "Jun" }, { name: "Soo" }];

const junyoung = arr.find((elem, index, fullArr) => {
  return elem.name == "Jun";
});

console.log(junyoung); // { name: "Jun" }
```

여기서 주의할 점은, `find()` 메서드가 결과로 반환하는 객체는 **복사본이 아닌 객체의 원본**이라는 점이다. 즉, 반환받은 객체를 수정하면 배열 내부에 존재하는 객체의 내용도 함께 변경되는 것이다.

```javascript
const arr = [{ name: "Jun" }, { name: "Soo" }];

const junyoung = arr.find((elem, index, fullArr) => {
  return elem.name == "Jun";
});

junyoung.name = "Junyoung"; // 객체 원본 수정

console.log(arr); // (2) [{ name: "Junyoung" }, { name: "Soo" }]
```

> `find()` 메서드와 사용법이 완전히 동일한 `findIndex()` 메서드를 사용해, 일치하는 요소 자체를 반환받지 않고 해당 요소의 인덱스 값만 반환받을 수도 있다.

<br>

## `map()`

`map()` 메서드는 **반드시 `return`문을 통해 값을 반환하는 콜백 함수**를 매개변수로 갖는다. 콜백 함수에서 반환하는 값은 보편적으로 기존의 요소를 다른 형태로 가공한 결과이다.

이후 배열의 모든 요소에 대해 전달된 콜백 함수가 실행되고, **콜백 함수가 반환한 값을 요소로 가지는 새로운 배열이 생성**된다. 즉, 원본 배열은 변하지 않고 유지된다.

```javascript
const arr = [10, 20, 30, 40];

const multipliedByTen = arr.map((number, index, arr) => {
  return number * 10;
});

console.log(multipliedByTen); // (4) [100, 200, 300, 400]
console.log(multipliedByTen === arr); // false
```

<br>

## `sort()`와 `reverse()`

`sort()` 메서드는 배열 요소를 오름차순으로 정렬하며, `reverse()` 메서드는 배열 요소를 내림차순으로 정렬한다. 두 메서드 모두 **원본 배열을 직접 수정하며, 정렬된 상태의 배열을 반환**한다.

```javascript
const arr = [10, 2, 5, 4, 3];
const sortedArr = arr.sort();

console.log(sortedArr); // (5) [10, 2, 3, 4, 5]
console.log(sortedArr === arr); // true
```

주의해야할 점은, `sort()` 또는 `reverse()` 메서드를 호출할 때 인수를 전달하지 않으면 **배열 요소를 모두 문자열로 변환한 후 정렬**한다는 점이다. 따라서 위의 예시에서도 ASCII 문자열 정렬 방식에 따라 `[10, 2, 3, 4, 5]`과 같이 정렬 되었다.

위의 ASCII 문자열 정렬 방식을 따르지 않고 숫자의 크기에 따라 정렬하고자 하는 경우, **`sort()` 메서드를 호출할 때 콜백 함수를 전달**하면 된다. 콜백 함수는 현재 비교 대상인 두 개의 요소를 매개변수로 가지며, 개발자는 **배열 요소를 정렬하는 로직을 직접 구현**해야 한다.

```javascript
const arr = [10, 2, 5, 4, 3];

const sortedArr = arr.sort((numA, numB) => {
  if (numA > numB) return 1;
  else if (numA === numB) return 0;
  else return -1;
});

console.log(sortedArr); // (5) [2, 3, 4, 5, 10]
```

`reverse()` 메서드 역시, 아무런 인수가 주어지지 않으면 기본적으로 ASCII 문자열 정렬 방식을 따른다. 따라서 숫자 크기에 따른 내림차순 정렬을 위해서는 개발자가 직접 로직을 구현해야 한다.

> 위에서 작성한 `sort()` 메서드를 수정해 `reverse()` 메서드처럼 동작하도록 할 수 있다.
>
> ```javascript
> const arr = [10, 2, 5, 4, 3];
>
> const sortedArr = arr.sort((numA, numB) => {
>   if (numA > numB) return -1;
>   else if (numA === numB) return 0;
>   else return 1;
> });
>
> console.log(sortedArr); // (5) [10, 5, 4, 3, 2]
> ```

<br>

## `filter()`

앞서 살펴본 `indexOf()`, `find()` 메서드는 탐색 조건을 만족하는 요소가 1개 이상이더라도, 가장 먼저 마주친 요소 하나만을 반환하고 실행을 중단하였다. 반면 `filter()` 메서드는 특정한 조건을 만족하는 배열 요소를 모두 찾을 수 있게 해준다.

`filter()` 메서드는 내부에 정의된 조건에 따라 **`true` 또는 `false`를 반환하는 콜백 함수**를 매개변수로 가진다. 이후 조건을 만족하는, 즉 **`true`가 반환된 요소로 구성된 새로운 배열을 반환**한다. 새로운 배열을 생성해 반환하므로, **원본 배열은 본래의 상태로 유지**된다.

```javascript
const arr = [10, 20, 30, 40];

const filteredArr = arr.filter(number, index, arr) => {
  return number > 20;
});

console.log(filteredArr); // (2) [30, 40]
console.log(filteredArr === arr); // false
```

<br>

## `reduce()`

`reduce()` 메서드는 배열의 요소들을 **보다 단순한 형태**로 나타내기 위해 사용된다. 하지만 `reduce()` 메서드는 사용하기에 따라, 굉장히 다양한 방식으로 응용될 수도 있다.

지금까지 소개한 메서드와 달리, `reduce()` 메서드는 두 개의 매개변수를 갖는다.

- `callbackFn`: 콜백 함수는 다음 네 가지 인수를 받는다.

  - `accumulator`
    - 콜백 함수가 반환하는 값을 누적하기 위한 변수이다.
    - `reduce()` 메서드에 `initialValue`가 전달된 경우, 이 값을 초기값으로 갖는다.
  - `currentValue`
    - 콜백 함수가 현재 처리하고 있는 배열 요소의 값이다.
  - `currentIndex`
    - 콜백 함수가 현재 처리하고 있는 배열 요소의 인덱스이다.
  - `array`
    - `reduce()` 메서드를 호출한 배열 자체이다.

  콜백 함수는 `accumulator`와 `currentValue` 값을 이용해 연산을 수행하고, 그 결과를 `return`문을 통해 반환한다. 반환된 값은 콜백 함수의 다음 호출에서 `accumulator`의 값이 된다.

- `initialValue`
  - 콜백 함수의 최초 호출에서 첫 번째 인수인 `accumulator`에 제공하는 값이다.
  - 초기값을 전달하지 않은 경우, `reduce()`를 호출한 배열의 첫 번째 요소를 사용한다.
  - 반드시 배열일 필요는 없으며, 어떠한 자료형이라도 가능하다.

`reduce()` 메서드를 사용하는 간단한 예시로, 정수 값으로 구성된 배열의 총합을 구할 수 있다.

```javascript
const arr = [10, 20, 30, 40];

const sum = arr.reduce(prev, curr, currIndex, arr) => {
  // [1] 0 + 10 = 10, [2] 10 + 20 = 30, [3] 30 + 30 = 60, [4] 60 + 40 = 100
  return prev + curr;
}, 0);

console.log(sum); // 100
```
