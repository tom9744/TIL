# DOM 자식 노드 탐색

`getElementById()`, `qeurySelector()` 등의 메서드를 호출해 원하는 요소 노드를 취득한 다음, 해당 노드를 기점으로 **DOM 트리를 옮겨 다니며 부모, 형제, 자식 노드 등을 탐색하는 작업**이 요구될 수 있다.

DOM API는 `Node.prototype`과 `Element.prototype`을 통해 연관된 DOM 요소 노드를 탐색할 수 있는 **접근자 프로퍼티**를 제공한다.

> 접근자 프로퍼티로 `getter`만 제공되며, `setter`는 제공되지 않는다.

<br>

## 공백 텍스트 노드

HTML 요소 사이의 스페이스, 탭, 줄바꿈 등의 공백 문자는 **텍스트 노드를 생성**한다.

```html
<!DOCTYPE html>
<html>
    <!-- 모든 공백 문자는 '텍스트 노드'를 생성한다. -->
    <body>
        <ul id="list">
            <li class="list-item">Hello!</li>
        </ul>
    </body>
</html>
```

따라서 DOM 트리의 노드를 탐색하거나 순회할 때, **공백 문자에 의해 생성된 공백 텍스트 노드에 주의**해야 한다. 눈에 보이지 않기 때문에, 실수를 유발하기 쉽다.

<br>

## 자식 노드 탐색

DOM 트리에서 자식 노드를 탐색하기 위해, `children` 프로퍼티 또는 `childNodes` 프로퍼티를 사용할 수 있다. 두 접근자 프로퍼티에는 **중요한 차이점이 존재**하므로, 잘 숙지하고 있어야 한다.

- `Node.prototype.childNodes` 프로퍼티
    - 자식 노드를 **모두 탐색**하여, `NodeList` 형태로 반환한다.
    - **텍스트 노드 포함**
    - 노드 객체의 상태 변경을 실시간으로 반영하지 않는다. ***Non-Live***
- `Element.prototype.children` 프로퍼티
    - 자식 노드 중 **요소 노드만 탐색**하여, `HTMLCollection` 형태로 반환한다.
    - **텍스트 노드 미포함**
    - 노드 객체의 상태 변경을 실시간으로 반영한다. ***Live***
