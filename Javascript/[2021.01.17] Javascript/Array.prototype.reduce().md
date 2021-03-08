 # `Array.prototype.reduce()`

자바스크립트 `Array` 전역 객체의 모든 인스턴스는 `Array.prototype`을 상속한다. `Array.prototype`에는 배열을 조작할 수 있는 다양한 내장 메서드가 포함되어 있으며, 굉장히 다양하게 사용될 수 있는 `reduce()`라는 메서드에 대해 알아본다.

<br>

## 순회 메서드

`Array.prototype`에 포함된 메서드는 크게 *변경자 메서드*, *접근자 메서드*, 그리고 *순회 메서드*의 세 가지 종류로 구분된다. `reduce()` 메서드는 이들 중 ***순회 메서드***에 포함되며, *순회 메서드는* 인자로 *Callback*을 받아 배열의 `length`만큼 반복하여 호출한다.

**[중요]** 처음 *Callback*을 호출하는 시점에서 배열의 `length`를 기억하므로 아직 순회가 종료되지 않았을 때 요소를 더 추가해도 해당 요소는 방문하지 않는다.

*순회 메서드*에 포함되며 자주 사용되는 메서드는 `forEach()`, `find()`, `every()`, `some()`, `map()` 등이 존재한다.

<br>

## `reduce()` 기본 사용법

`reduce()` 메서드는 배열의 각 요소에 대해 주어진 *Callback* (또는 *Reducer*) 함수를 실행하고, 하나의 결과값을 반환한다. `reduce()` 메서드를 호출할 때 매개변수로 제공되어야 하는 ***Reducer*** 함수는 총 네 개의 인자를 가지며, 각 항목은 다음과 같다.

1. 누적된 값 (*Accumulator*)
2. 현재 처리되고 있는 값 (*Current Value*)
3. 현재 인덱스 (*Current Index*)
4. 원본 배열 (*Source Array*)

`reduce()` 메서드에 제공된 *Reducer* 함수를 실행한 결과는 *Accumulator*에 누적되어 할당되며, *Accumulator*는 순회가 진행되는 동안 유지되므로 최종결과는 하나의 값 (*Accumulator*)이 된다.

`reduce()` 메서드는 *Reducer* 함수 이외에도 하나의 인자를 더 가지는데, 이는 *Reducer* 함수에 최초로 제공되는 **초기값**이다. 명시적으로 초기값을 설정하지 않으면 **주어진 배열의 첫 번째 요소를 초기값으로 사용**한다. 당연하게도 빈 배열에서 초기값 없이 `reduce()`를 호출하면 오류가 발생한다.

초기값을 지정하지 않으면 배열의 내용에 따라 나타날 수 있는 **출력 결과의 형태가 세 가지나 존재하므로, 초기값을 제공하는 것이 안전**하다고 할 수 있다.

**[참고]** 초기값을 제공하지 않으면, `reduce()`는 배열의 두 번째 인덱스부터 *Callback* 함수를 실행하며, 첫 번째 인덱스는 생략한다. 초기값이 제공되었다면, 배열의 첫번째 인덱스부터 실행한다.


<br>

## `reduce()` 작동 방식

`reduce()` 메서드의 가장 기본적인 예시는 배열에 존재하는 모든 숫자의 합을 구하는 것이다. 다음의 코드를 통해 `reduce()` 메서드가 작동하는 방식을 보다 자세히 확인한다.

```
const array = [0, 1, 2, 3, 4];

array.reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue;
});
```

위의 예시에서 **초기값이 제공되지 않았으므로, *Callback*은 인덱스 1부터 시작해 4까지 총 4회 호출**되게 된다. 

첫번째 *Callback* 호출 시 *Reducer*에 전달된 매개변수 `accumulator`, `currentValue`, `currentIndex`, `array`의 값은 각각 다음과 같다.

- `accumulator`: 0
- `currentValue`: 1
- `currentIndex`: 1
- `array`: [0, 1, 2, 3, 4]
- `return 1;`


마지막 *Callback* 호출 시 *Reducer*에 전달된 매개변수 `accumulator`, `currentValue`, `currentIndex`, `array`의 값은 각각 다음과 같다.

- `accumulator`: 6
- `currentValue`: 4
- `currentIndex`: 4
- `array`: [0, 1, 2, 3, 4]
- `return 10;`

`reduce()` 메서드가 최종적으로 반환하는 값은 마지막 *Callback* 호출에서의 반환값인 10을 사용한다. 즉, 배열 `[0, 1, 2, 3, 4]`의 모든 요소를 더한 값이 된다.


```
const array = [0, 1, 2, 3, 4];

array.reduce((accumulator, currentValue, currentIndex, array) => {
  return accumulator + currentValue;
}, 10);
```

위와 같이 **초기값을 제공하는 경우, *Callback*은 인덱스 0부터 4까지 총 5회 호출**되며, 첫번째 *Callback* 호출 시 *Reducer*에 전달된 매개변수 `accumulator`, `currentValue`, `currentIndex`, `array`의 값은 각각 다음과 같다.

- `accumulator`: 10
- `currentValue`: 0
- `currentIndex`: 0
- `array`: [0, 1, 2, 3, 4]
- `return 10;`

최종적으로는 **배열의 모든 요소를 더한 값 10에 초기값 10을 더한 결과로 20이 반환**된다.

<br>

## `reduce()` 응용 예제


**배열의 중복 요소 개수**
```
const votes = ["kim", "hong", "lee", "hong", "lee", "lee", "hong"];

const result = votes.reduce((accumulator, value, index, array) => {
  if (accumulator.hasOwnProperty(value)) {
    accumulator[val] = accumulator[val] + 1;
  } else {
    accumulator[val] = 1;
  }
  return accumulator;
}, {});

console.log(result);  // { kim: 1, hong: 3, lee: 3 }
```

`reduce()` 메서드의 초기값으로 빈 객체 `new Object()` 또는 `{}`를 제공하고, 배열을 순회하며 요소가 이미 객체의 속성(*Key* 또는 *Property*)으로 존재하면 현재의 값(*Value*)에 1을 더하고, 그렇지 않은 경우 1로 초기화하여 새로운 속성을 추가하는 방법으로 배열에 포함된 중복 요소의 개수를 구할 수 있다.

**[중요]** 위의 예제에서 초기값으로 빈 객체를 제공하는 것이 중요하다. 초기값이 주어지지 않으면 첫 번째 *Callback* 호출에서 `accumulator`의 값이 `{}`가 아니라 `"kim"`이 되어버리고, 로직이 정상적으로 작동하지 않게 된다.

**2차원 배열 펼치기**

```
const array2D = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

const flattened = array2D.reduce((accumulator, value, index, array) => {
  return accumulator.concat(value);
}, []); 

console.log(flattened);  // [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

이번에는 `reduce()` 메서드의 초기값으로 빈 배열을 제공하고 있으며, 2차원 배열에 대해 호출되었다. 따라서 인덱스 0부터 2까지 총 세 번 동안 `[1, 2, 3]`, `[4, 5, 6]`, `[7, 8, 9]`이 각각 *Reducer* 함수에 전달된다. `concat()` 메서드를 이용해 이들을 이어 붙이고, 결과적으로 2차원 배열을 1차원 배열로 만들 수 있다.  


<br>

## 결론

`reduce()` 메서드는 자바스크립트 `Array.prototype`에서 제공하는 대부분의 메서드를 대체할 수 있는 막강한 메서드이다. 하지만 모든 로직을 `reduce()` 메서드로 구현하는 것이 항상 효율적이지는 않으므로, 상황에 따라 적절한 메서드를 선택하여 사용할 수 있는 능력을 기르는 것이 중요할 것 같다. 