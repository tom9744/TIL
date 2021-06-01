# DOM Manipulation (조작)

## 문자 노드(_Text Node_) 접근 및 수정

HTML 요소의 문자(_Text_)는 문자 노드(_Text Node_)에 저장되어 있으며, 문자 노드에 접근하는 방법은 다음과 같다.

1. 문자 노드의 부모 노드(= 요소 노드)를 선택한다.
   - 문자 노드는 항상 요소 노드(_Element Node_)의 자식이다.
2. `firstChild` 속성을 사용해 문자 노드를 탐색한다.
3. 문자 노드의 유일한 속성, `nodeValue`를 통해 문자를 얻는다.
4. `nodeValue` 속성의 값을 변경해, 문자를 수정할 수 있다.

   - `nodeValue` (속성)
     - 노드의 값을 반환한다.
     - 문자 노드의 경우는 문자열, 요소 노드의 경우 null을 반환한다.
     - IE6 이상의 브라우저에서 동작한다.

```javascript
// 해당 텍스트 노드의 부모 요소 노드를 선택한다.
const one = document.getElementById("one");

// firstChild 속성을 사용하여 텍스트 노드를 탐색한다.
const textNode = one.firstChild;

// nodeName, nodeType을 통해 노드의 정보를 취득할 수 있다.
console.log(textNode.nodeName); // #text
console.log(textNode.nodeType); // 3: Text node

// nodeValue 속성을 사용하여 노드의 값을 취득한다.
console.log(textNode.nodeValue); // Seoul

// nodeValue 속성를 이용하여 텍스트를 수정한다.
textNode.nodeValue = "Busan";
```

<br>

## 속성 노드(_Attribute Node_) 접근 및 수정

속성 노드를 조작할 때, `className` 속성 또는 `classList`에서 제공하는 메서드를 사용할 수 있다.

- `className`

  - HTML 요소의 `class` 속성 값을 얻어 오거나, 변경할 수 있다.
  - `className` 속성(_Property_)에 값을 할당할 때, HTMl 요소에 `class` 속성(_Attribute_)이 존재하지 않으면 새로 생성한다.
  - HTML 요소의 `class` 속성 값이 여러 개인 경우, 공백으로 구분된 문자열이 반환된다.
    - `String.split(" ")`을 사용해, 배열로 변경하려 사용하면 된다.

- `classList`

  - `add()`, `remove()`, `item()`, `toggle()`, `contains()`, `replace()` 메서드를 제공한다.
  - IE10 이상의 브라우저에서 동작한다.

```javascript
const elems = document.querySelectorAll("li");

// className을 사용하는 방법.
[...elems].forEach((elem) => {
  // class 어트리뷰트 값을 취득하여 확인
  if (elem.className === "red") {
    // class 어트리뷰트 값을 변경한다.
    elem.className = "blue";
  }
});

// classList를 사용하는 방법
[...elems].forEach((elem) => {
  // class 어트리뷰트 값 확인
  if (elem.classList.contains("blue")) {
    // class 어트리뷰트 값 변경한다.
    elem.classList.replace("blue", "red");
  }
});
```

- `id` (속성)

  - HTML 요소의 `id` 속성(_Attribute_) 값을 얻어오거나, 변경한다.
  - `id` 속성(_Property_)에 값을 할당할 때, HTMl 요소에 `id` 속성(_Attribute_)이 존재하지 않으면 새로 생성한다.
  - 모든 브라우저에서 동작한다.

- `hasAttribute(attribute)` (메서드)

  - HTML 요소가 특정한 속성(_Attribute_)을 가지고 있는지 검사한다.
  - _Boolean_ 값을 반환한다.
  - IE8 이상의 브라우저에서 동작한다.

- `getAttribute(attribute)` (메서드)

  - 속성(_Attribute_) 값을 얻어온다.
  - 문자열을 반환한다.
  - 모든 브라우저에서 동작한다.

- `setAttribute(attribute, value)` (메서드)

  - 속성(_Attribute_)과 속성(_Attribute_)의 값을 설정한다.
  - `undefined`를 반환한다.
  - 모든 브라우저에서 동작한다.

- `removeAttribute(attribute)` (메서드)

  - 지정한 속성(_Attribute_)을 제거한다.
  - `undefined`를 반환한다.
  - 모든 브라우저에서 동작한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input type="text" />
    <script>
      const input = document.querySelector("input[type=text]");
      console.log(input);

      // value 속성이 존재하지 않으면
      if (!input.hasAttribute("value")) {
        // value 속성을 추가하고 값으로 'hello!'를 설정
        input.setAttribute("value", "hello!");
      }

      // value 속성의 값을 얻어온다.
      console.log(input.getAttribute("value")); // hello!

      // value 속성을 제거
      input.removeAttribute("value");

      // value 속성의 존재를 확인
      console.log(input.hasAttribute("value")); // false
    </script>
  </body>
</html>
```

<br>

## HTML 요소의 내용(_Content_) 조작

요소 노드(_Element Node_), 즉 HTML 요소를 조작하기 위해 아래의 속성 또는 메서드를 사용할 수 있다.

마크업이 포함된 내용을 추가하는 경우, **Cross-Site Scripting Attacks(XSS)에 취약**하게 되므로 주의가 필요하다.

- `textContent` (속성)

  - HTML 요소 내부의 **모든 문자로 작성된 내용**을 얻어오거나, 변경한다.
  - `textContent` 속성에 새로운 문자열을 할당하면 내용을 변경할 수 있다.
  - `<div>`와 같은 마크업을 포함시켜도, 모두 문자열로 인식되어 그대로 출력된다.
  - IE9 이상의 브라우저에서 동작한다.

- `innerText` (속성)

  - HTML 요소 내부의 **문자로 작성된 내용에 접근**할 수 있다.
  - 비표준이다.
  - CSS에 순종적이다. 예를 들어 CSS가 `visibility: hidden;`로 지정되어 있다면 텍스트가 반환되지 않는다.
  - 위와 같은 이유로 CSS를 고려해야 하므로 `textContent` 속성보다 느리다.

- `innerHTML` (속성)

  - 대상 HTML 요소의 **자식 요소를 포함하는 모든 내용을 하나의 문자열**로 얻어온다.
  - 문자열은 `<div>`와 같은 마크업을 포함한다.

    ```javascript
    const ul = document.querySelector("ul");

    // HTML 요소 사이의 공백 또는 줄바꿈 문자도 문자 노드(Text Node)로 취급한다.
    console.log(ul.innerHTML);
    /*
            <li id="one" class="red">Seoul</li>
            <li id="two" class="red">London</li>
            <li id="three" class="red">Newyork</li>
            <li id="four">Tokyo</li>
    */
    ```

  - `innerHTML`를 사용하여 마크업이 포함된 새로운 내용을 DOM에 추가할 수 있다.

    ```javascript
    const one = document.getElementById("one");

    // 마크업이 포함된 내용을 얻어온다.
    console.log(one.innerHTML); // Seoul

    // 마크업이 포함된 내용을 추가한다.
    one.innerHTML += '<em class="blue">, Korea</em>';

    // 마크업이 포함된 내용을 얻어온다.
    console.log(one.innerHTML); // Seoul <em class="blue">, Korea</em>
    ```

  - **Cross-Site Scripting Attacks(XSS)에 취약**하다.
    - `<script>` 태그를 포함한 내용을 주입하여, 프로그램을 실행할 수 있다.
    - *HTML5*에서 `innerHTML`로 삽입한 `<script>` 코드는 무시된다.

<br>

## DOM 조작 방식

XSS 공격에 취약한 `innerHTML` 속성을 사용하지 않고 HTML 요소에 새로운 내용을 추가하는 방법은 **DOM을 직접 조작하는 것**이며, 다음과 같은 순서로 진행된다.

1. `createElement(tagName)` 메서드를 사용해, 새로운 요소 노드를 생성한다.
   - 메서드 호출 시, 인수로 생성할 요소의 `tagName`을 전달한다.
2. `createTextNode(text)` 메서드를 사용해, 새로운 문자 노드를 생성한다.
   - 생략 가능하지만, 생략하는 경우 내용이 비어있게 된다.
3. `appendChild(node)` 메서드를 사용해, 생성한 노드를 DOM Tree에 추가한다.
   - `removeChild(node)` 메서드로 요소를 삭제할 수도 있다.

```javascript
// 태그명을 인수로 전달하여 요소 노드를 생성
const newElem = document.createElement("li");

// 문자 노드를 생성
const newText = document.createTextNode("Beijing");

// 문자 노드를 newElem(요소 노드)의 자식으로 DOM Tree에 추가
newElem.appendChild(newText);

const container = document.querySelector("ul");

// newElem을 container의 자식으로 DOM Tree에 추가. 마지막 요소로 추가된다.
container.appendChild(newElem);

const removeElem = document.getElementById("one");

// container의 자식인 removeElem 요소를 DOM Tree에 제거한다.
container.removeChild(removeElem);
```

<br>

## `insertAdjacentHTML()`

- `insertAdjacentHTML(position, string)`

  - 두번째 매개변수 `string`에 전달되는 문자열을 HTML로 파싱한다.
  - 그 결과 생성된 노드를 DOM Tree의 지정된 위치에 삽입한다.
  - 삽입 위치는 첫번째 매개변수 `position`을 통해 설정할 수 있다.
    - `beforebegin`
    - `afterbegin`
    - `beforeend`
    - `afterend`
  - 모든 브라우저에서 동작한다.

```javascript
const one = document.getElementById("one");

// 마크업이 포함된 요소를 DOM Tree에 추가한다.
one.insertAdjacentHTML("beforeend", '<em class="blue">, Korea</em>');
```

<br>

## `innerHTML` vs. DOM 조작 방식 vs. `insertAdjacentHTML()`

`innerHTML` 속성과 `insertAdjacentHTML()` 메서드를 사용하면 간편하게 HTML 요소를 조작할 수 있다는 장점이 있지만, **XSS 공격에 취약하다는 중대한 단점이 존재**한다.

DOM 조작 방식은 새로운 요소를 추가하거나 삭제하기 위해 `innerHTML` 속성과 `insertAdjacentHTML()` 메서드에 비해 **작성해야 하는 코드가 많지만 XSS 공격에 안전**하다.

따라서 HTML 요소의 문자로 구성된 내용(_Text Content_)을 추가하거나 수정할 때 `textContent` 속성을 사용하는 것이 좋다. 또한, 새로운 요소 노드를 추가하거나 요소 노드를 수정하는 경우 DOM 조작 방식을 사용하는 것이 좋다.
