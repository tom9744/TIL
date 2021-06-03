# DocumentFragment를 이용한 성능 최적화

```javascript
function addElem() {
    const $list = document.querySelector(".list");

    for (let i = 0; i < 100; i++) {
        const $div = document.createElement("div");

        $div.innerText = "임의의 텍스트";

        $list.appendChild($div); // 매번 DOM에 새로운 요소를 추가한다.
    }
}
```

DOM API를 이용해 DOM을 조작하면 브라우저는 다음과 같은 작업을 시작한다.

1. 렌더 트리를 재구성한다.
2. 요소의 위치와 크기를 다시 계산한다. ***Reflow*** 
3. 변경사항을 화면에 반영한다. ***Repaint***

이때, ***Reflow***와 ***Repaint***는 비용이 굉장히 큰 작업이며, 빈번히 발생할 경우 어플리케이션의 성능이 저하될 수 있다. 따라서 자바스크립트를 이용해 **DOM 트리에 직접 접근하는 횟수를 최소화** 하는 것이 중요한다.

<br>

## `DocumentFragment`를 이용하자

```javascript
function addElem() {
    const $list = document.querySelector(".list");
    // 새로운 DocumentFragment를 생성한다.
    const $frag = document.createDocumentFragement();

    for (let i = 0; i < 100; i++) {
        const $div = document.createElement("div");

        $div.innerText = "임의의 텍스트";

        // DocumentFragment에 새로운 요소를 추가한다. (Reflow X)
        $frag.appendChild($div);
    }

    // 실제 DOM에 단 한번만 접근하여, 성능이 개선된다.
    $list.appendChild($frag.cloneNode(true)); 
}
```

`DocumentFragment`는 활성화된 DOM 트리 구조의 일부가 아니기 때문에, Fragement를 변경해도 실제 문서에는 아무런 영향을 미치지 않는다.

즉, `createDocumentFragment()`로 생성한 Fragment 객체에 `appendChild()` 메서드를 호출해 자식 노드를 추가해도 ***Reflow***와 ***Repaint***가 발생하지 않고, 성능에 어떠한 영향도 없다는 것이다.
