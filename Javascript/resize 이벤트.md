# `resize` 이벤트

- `resize` 이벤트는 **윈도우(= 브라우저)의 크기 변화**할 때 발생한다.
- `resize` 이벤트는 오직 브라우저의 **전역객체, `window`에서만 발생**한다.
    - `window.onresize` 프로퍼티에 이벤트 핸들러를 등록할 수 있다.
    - `window.addEventListener('resize', ...)`를 통해서도 가능하다.
        - `addEventListener` 방식은 다수의 핸들러를 등록할 수 있다.


> `window` 객체는 DOM 트리의 최상위 노드이므로, 이벤트 전파가 되지 않는다.
>
> 따라서, 반드시 `window` 객체에 이벤트 핸들러를 등록해야 한다.