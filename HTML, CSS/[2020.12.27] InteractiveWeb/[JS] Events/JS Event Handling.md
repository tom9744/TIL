# Javascript EventListenter

Javascript에서 `document.querySelector()` 또는 `document.querySelectorAll()` 메서드의 매개변수로  
CSS 선택자를 넘기는 방식으로 개발자가 필요로하는 DOM을 가져올 수 있다는 것을 이미 학습하였다.

예제
```
const image = document.querySelector('.image.one');   // 단일 항목 선택
const images = document.querySelectorAll('.image');   // 전체 항목 선택
```

위와 같이 가져온 DOM에서 발생하는 이벤트를 처리하기 위해 `addEventListener()` 메서드를 사용해  
개발자가 선언한 *Event Handler (or Listener)* 메서드를 추가할 수 있다.

예제
```
function clickImageHandler() {
    image.classList.add('new-class');   // 클래스 추가
}

image.addEventListener('click', clickImageHandler);
```


## 전역 변수 사용 피하기

Javascript 코드 작성 시, 전역 변수를 남용하게 되면 추후에 충돌이 발생해 악영향을 미칠 수 있다.
따라서 아래의 예시와 같이 `function`으로 감싸주어, 지역 변수로 선언되도록 해주는 것이 좋다.

```
<script>
    // 익명 함수를 선언하고, 바로 실행한다.
    (function() {
        const image = document.querySelector('.image.one'); 

        function clickImageHandler() {
            image.classList.add('new-class');   // 클래스 추가
        }

        image.addEventListener('click', clickImageHandler);
    })();
</script>
```


## this와 이벤트 객체

```
function clickImageHandler(event) {
    console.log(this);   // EventListener를 등록한 DOM 
    console.log(event);  // 발생한 Event에 대한 정보   
}

images.addEventListener('click', clickImageHandler);
```

`addEventListener()` 메서드를 통해 등록한 *Event Handler*에서 DOM에 접근하기 위한 방법은 두 가지가 있다.  

- `this`
- `Event Object`

첫번째로, `this`를 사용하면 해당 *Event Handler*가 등록되어 있는 DOM에 접근할 수 있다.
위의 예시 코드에서는 `clickImageHandler`가 등록된 `image`라는 변수에 저장된 DOM에 접근할 수 있다.

두번째로, *Event Handler*에 첫번째 매개변수로 넘어오는 ***이벤트 객체***를 사용하는 것이다.  
***이벤트 객체***에는 발생한 이벤트와 관련된 굉장히 다양한 정보가 포함되어 있는데,  
이 중 현재 이벤트가 발생한 DOM을 가르키는 `currentTarget`을 사용하면 DOM에 접근할 수 있다.

***이벤트 객체***에 `target`이라는 *property*도 포함되어 있는데,  
이것은 *Event Handler*가 등록된 DOM이 아니라 **실제로 클릭된 DOM에 접근**할 수 있도록 해준다.


## [중요] 이벤트의 위임

동일한 이벤트를 **많은 수의 반복되는 DOM**에 적용하려고 하는 경우, 반복문을 사용해 모든 DOM에 대해  
*Event Handler*를 추가하는 것은 굉장히 비효율적이고 최근 트렌드인 *Infinite Scroll*을 적용하기도 어렵다.

이때 적용할 수 있는 기법이 **이벤트 위임**인데, 이벤트를 등록해야하는 수많은 DOM을 감싸고 있는  
**부모 DOM에 *Event Handler*를 추가**하고 이벤트 객체의 `target` 속성을 사용해 DOM에 접근하는 것이다.

예를 들어 1,000개의 DOM에 대해 반복문을 수행하며 *Event Handler*를 추가하는 대신, 이들을 감싸고 있는  
Container DOM에 단 하나의 *Event Handler*를 추가하고, *Event Handler* 메서드에서 `event.tartget`를 통해 접근한다.

반복문 사용
```
const images = document.querySelectorAll('.image');

const clickHandler = () => {
    console.log(this);
}

for (let image of images) {
    imges.addEventListener('click', clickHandler);
}
```

이벤트 위임 적용
```
const imageContainer = document.querySelectorAll('.image-container');

const clickHandler = (event) => {
    console.log(event.target);
}

imageContainer.addEventListener('click', clickHandler);
```

위의 예시에서, 

하지만 이벤트 위임을 적용해 `event.target`을 사용하는 경우, **불필요한 DOM에 접근하게 되는 문제**가 있다.
예를 들어 버튼을 클릭하는 이벤트를 처리해야 하는데, 버튼을 구성하고 있는 `<img>` 또는 `<span>` 태그에 접근하게 된다.  

다음과 같은 방법을 사용해 문제를 해결할 수 있다.
- 버튼을 구성하는 요소들의 CSS 속성에 `pointer-events: none;` 추가

```
btn {
    /* Button CSS */
}
img, span {
    pointer-events: none;
}
```

- 현재 DOM의 *parentNode*를 하나씩 확인하며, `<body>` 태그가 나올 때까지 `.btn` 클래스를 찾는다.

```
const clickHandler = (event) => {
    let elem = event.target;
    while (!elem.classList.contains('.btn')) {
        elem = elem.parentNode;

        if (elem.nodeName == 'BODY') {
            elem = null;
            return;
        }
    }
}
```


## 리팩토링

```
let openedElem;

const doorHandler = ({ target }) => {
    const targetElem = target.parentNode;
    
    if (openedElem) {
        openedElem.classList.remove('door-opened');
    }

    if (target.classList.contains('door-body')) {
        targetElem.classList.add('door-opened');
        openedElem = targetElem;
    }
};
```

위와 같은 *Event Handler* 메서드의 코드는 간결하지만 이벤트를 처리하는 모든 로직을 포함하고 있다.  

하지만 이렇게 코딩하는 것은 유지보수의 어려움을 가져올 수 있으므로,  
*Event Handler*에서 세부적인 메서드는 추출하여 별도로 정의하고 **조건에 따른 분기**만 포함하는 것이 옳다.

```
let openedElem;

function activate(elem) {
    elem.classList.add('door-opened');
    openedElem = elem;
} 

function deactivate(elem) {
    elem.classList.remove('door-opened');
}

const doorHandler = ({ target }) => {
    const targetElem = target.parentNode;
    
    if (openedElem) {
        deactivate(openedElem);
    }

    if (target.classList.contains('door-body')) {
        activate(targetElem);
    }
};
```
 