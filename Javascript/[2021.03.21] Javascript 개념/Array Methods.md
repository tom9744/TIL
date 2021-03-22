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
