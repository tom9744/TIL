# DOM Query / Traversing

## [DOM Query] 하나의 요소 노드(_Element Node_) 선택

- `document.getElementById(idAttr)`
  - HTML 요소의 `id` 속성 값으로 요소 노드를 한 개 선택한다.
  - (`id` 값은 유일해야 하지만) 만약 한 개 이상이 선택되는 경우, 첫번째 요소만 반환한다.
  - `HTMLElement` 객체를 상속받은 객체가 반환된다.
    - `HTMLDivElement`, `HTMLListElement` 등...
  - 모든 브라우저에서 동작한다.
- `document.querySelector(cssSelector)`
  - CSS 선택자를 기준으로 요소 노드를 한 개 선택한다.
    - `#id`, `.class`, `tagName` 등 모든 CSS 선택자를 사용할 수 있다.
  - 만약 한 개 이상이 선택되는 경우, 첫번째 요소만 반환한다.
  - `HTMLElement` 객체를 상속받은 객체가 반환된다.
    - `HTMLDivElement`, `HTMLLIElement` 등...
  - IE8 이상의 브라우저에서만 동작한다.

```javascript
// id로 하나의 요소를 선택한다.
const elem = document.getElementById("one");
// 클래스 속성의 값을 변경한다.
elem.className = "blue";

console.log(elem); // <li id="one" class="blue">Seoul</li>
console.log(elem.__proto__); // HTMLLIElement
console.log(elem.__proto__.__proto__); // HTMLElement
console.log(elem.__proto__.__proto__.__proto__); // Element
console.log(elem.__proto__.__proto__.__proto__.__proto__); // Node
```

<center>
  <img src="./images/HTMLElement.png">
</center>

<br>

## [DOM Query] 여러 개의 요소 노드(_Element Node_) 선택

- `document.getElementsByClassName(className)`
  - HTML 요소의 `class` 속성의 값을 기준으로, 일치하는 요소 노드를 모두 선택한다.
  - 공백으로 구분하여 여러 개의 `class`를 지정할 수 있다.
  - `HTMLCollection`을 반환한다.
    - `Array.prototype` 메서드를 사용할 수 없는 유사 배열(_Array-like_)이다.
    - **실시간으로 노드의 변경 상태를 반영한다.**
  - IE9 이상의 브라우저에서 동작한다.
- `document.getElementsByTagName(tagName)`
  - HTML 요소의 태그명을 기준으로, 일치하는 모든 요소 노드를 선택한다.
    - `<li>`, `<ul>`, `<div>` 등...
  - `HTMLCollection`을 반환한다.
  - 모든 브라우저 환경에서 동작한다.
- `document.querySelectorAll(cssSelector)`
  - CSS 선택자를 기준으로, 일치하는 요소 노드를 모두 선택한다.
  - `NodeList`을 반환한다.
    - `Array.prototype` 메서드를 사용할 수 없는 유사 배열(_Array-like_)이다.
    - **노드의 변경 상태를 실시간으로 반영하지 않는다.**
  - IE8 이상의 브라우저에서 동작한다.

<br>

### `NodeList` vs `HTMLCollection`

`HTMLCollection`과 `NodeList`는 유사 배열 객체(_Array-like Object_)이며, DOM Query의 결과가 한 개 이상일 때 **HTMLElement의 리스트를 담기 위해 사용**된다는 공통점이 있다.

하지만 가장 중요한 것은 `HTMLCollection`과 `NodeList`의 차이점이며, 요소 노드의 변경사항이 실시간으로 반영되는지 여부이다.

- `NodeList`: 노드의 변경사항을 실시간으로 반영하지 않는다. (_Non-live_)
- `HTMLCollection`: 노드의 변경사항을 실시간으로 반영한다. (_Live_)

다음은 `HTMLCollection`의 동작 방식을 보여주는 예시이다.

```javascript
// HTMLCollection을 반환한다. (변경사항을 실시간으로 반영한다.)
const elems = document.getElementsByClassName("red");

for (let i = 0; i < elems.length; i++) {
  // 클래스 어트리뷰트의 값을 변경한다.
  elems[i].className = "blue";
}
```

```html
<ul>
  <li id="1" class="blue">Seoul</li>
  <!-- 두 번째 요소는 class가 변경되지 않았다. -->
  <li id="2" class="red">London</li>
  <li id="3" class="blue">Newyork</li>
  <li id="4">Tokyo</li>
</ul>
```

`elems.length`의 값(= 3)만큼 반복하며 모든 요소의 `class` 속성을 `red`에서 `blue`로 변경하려 하였으나, 두번째 요소의 `class` 속성은 변경되지 않았다.

이러한 현상은 `HTMLCollection`이 요소 노드에 발생한 변경사항을 실시간으로 반영하기 때문에 발생하며, 위 예제가 정상적으로 동작하지 않은 이유는 다음과 같다.

1. `i`가 0일 때, 첫번째 요소 `<li id="1" class="blue">Seoul</li>`의 `class` 속성(_Attribute_) 값이 `className`속성(_Property_)에 의해 `blue`로 변경된다.
   - 이때, `getElementsByClassName` 메소드에 인수로 전달한 선택 조건(= `red`)과 더이상 부합하지 않게 된다.
   - 따라서,`<li id="1" class="blue">Seoul</li>`는 반환값에서 실시간으로 제거된다.
2. `i`가 1일 때, 첫번째 요소가 제거되었으므로 `elems[1]`은 세번째 요소 `<li id="3" class="blue">Newyork</li>`를 가리키게 된다.
   - 세번째 요소의 `class` 속성 값도 `blue`로 변경되고, `HTMLCollection`에서 제외된다.
3. `i`가 2일 때, `HTMLCollection`에는 두번째 요소 하나만 남아있게 된다. 이때 `elems.length`의 값이 1이므로, `for`문이 종료된다.
   - 따라서 `HTMLCollection`에 남아 있는 두번째 요소 `<li id="2" class="red">London</li>`의 `class` 값은 변경되지 않는다.

이처럼 `HTMLCollection`는 **실시간으로 요소 노드의 상태 변경을 반환값에 반영**하기 때문에 반복문을 수행하는 경우 주의가 필요하며, 이를 회피하는 방법은 다음과 같다.

- `while`문을 사용한다.
  - 이때, `index` 값을 항상 0으로 유지한다.
- `HTMLCollection`을 *Array*로 변경한다. **(추천)**
  - `[...elems]`와 같이 전개 연산자를 사용하거나,
  - `Array.from()` 메서드로 유사 배열을 배열로 변경할 수 있다.
- `querySelectorAll` 메서드를 사용해, `NodeList`를 반환받는다.

<br>

## DOM Traversing, 노드 탐색

- `parentNode` (속성)

  - 부모 노드를 탐색한다.
  - `HTMLElement`를 상속한 객체를 반환한다.
  - 모든 브라우저에서 동작한다.

- `firstChild`, `lastChild` (속성)

  - 가장 첫번째 또는 마지막 자식 노드를 탐색한다.
  - `HTMLElement`를 상속한 객체를 반환한다.
  - IE9 이상에서 동작한다.

    주의할 점은, 대부분의 브라우저에서 HTML 요소 사이의 **공백과 줄바꿈 문자를 문자 노드(_Text Node_)로 취급**한다는 점이다.

    이를 회피하려면 `firstElementChild`, `lastElementChild`를 사용하면 된다.

- `hasChildNodes()` (메서드)

  - 자식 노드의 존재 여부를 확인한다.
  - _Boolean_ 값을 반환한다.
  - 모든 브라우저에서 동작한다.

- `childNodes` (속성)

  - 자식 노드의 모음을 반환한다. **문자 노드(_Text Node_)를 포함한 모든 자식 노드를 탐색**한다.
  - `NodeList`를 반환한다. (_Non-live_)
  - 모든 브라우저에서 동작한다.

- `children` (속성)

  - 자식 노드의 모음을 반환한다. **요소 노드(_Element Node_) 형태의 자식 노드만 탐색**한다.
  - `HTMLCollection`를 반환한다. (_Live_)
  - IE9 이상의 브라우저에서 동작한다.

- `previousSibling`, `nextSibling` (속성)

  - 현재 노드의 형제 노드를 탐색한다. **문자 노드를 포함한 모든 형제 노드를 대상**으로 한다.
  - `HTMLElement`를 상속받은 객체를 반환한다.
  - 모든 브라우저에서 동작한다.

- `previousElementSibling`, `nextElementSibling` (속성)

  - 형제 노드를 탐색한다. **요소 노드(_Element Node_) 형태의 형제 노드만을 대상**으로 한다.
  - `HTMLElement`를 상속받은 객체를 반환한다.
  - IE9 이상의 브라우저에서 동작한다.
