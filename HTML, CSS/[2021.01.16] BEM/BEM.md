# CSS 방법론 - BEM

어제는 반복되는 특정한 CSS 구문을 `mixins`, `variables` 또는 `functions`으로 만들어 재사용하고, `Nesting`읉 통해 CSS 선택자 사이의 관계를 보다 쉽게 확인할 수 있게 해주는 Sass/SCSS에 대해 알아보았다. 이는 CSS 코드를 재사용할 수 있게하여 코드의 복잡도와 유지보수성을 개선해준다.

오늘은 CSS 코드의 가독성을 개선하고 유지보수성을 더욱 개선할 수 있도록 해주는 ***CSS 방법론*** 중 **BEM(Block, Element, Modifier)** 방법에 대해 알아보겠다.

<br>

## **CSS 방법론이란?**

프로젝트의 규모가 조금만 늘어나도 하나의 페이지에서 요구하는 디자인이 복잡한 경우, CSS 코드의 양은 폭발적으로 증가하게 된다. **CSS 코드가 늘어날 수록 점점 더 가독성이 떨어지고, 이는 추후 유지보수를 진행하는 과정에서 문제**가 될 수 있다. 

특히 HTML 문서 구조가 복잡하고 **CSS 선택자의 이름이 아무런 의미도 없는 값**이라면 CSS 구문을 수정하려고 할 때 선택자가 가르키고 있는 DOM을 찾는 작업부터 고통스러울 것이다. 

이러한 CSS 코드 작성간의 불편함을 해소하기 위해 제시된 것이 **CSS 방법론**이며, 다수의 사람이 동의한 방식으로 **CSS 코드의 작성 방법을 통일**하여 개발 과정에서 개발자 사이의 **의사소통 과정을  원활**하게 하고, 추후 프로젝트 **유지보수 과정에서 다른 개발자가 코드를 해석하는 과정도 편리**하게 된다.

<br>

## **BEM 방법론**

BEM 방법론은 CSS 구조를 개선하기 위해 제시된 많은 방법론 중 하나이며, **오직 클래스 이름에만 적용**할 수 있다. BEM 방법론은 사용자 인터페이스를 `block`, `element`, `modifier`로 구분하며, 다음 예시와 같은 방법으로 클래스 이름을 작성한다.

```
.block__element--midifier
```

### 클래스 이름 작명 규칙

- 해당 CSS 클래스가 수행하는 역할이 무엇인지 명확히 나타낼 수 있게 한다.
- 소문자와 숫자만을 이용한다.
- 여러 단어의 조합은 하나의 하이픈 `-`으로 나태난다.
- 예시:  `.header__company-logo--valid`

**[중요]**  BEM 방법론으로 클래스 이름을 작성할 때, **'어떻게 보이는지'가 아니라 '어떤 목적인지'에 따라 작명**을 해야 한다.

### **Block**

Block은 **재사용할 수 있는, 기능적으로 독립적인 페이지 구성요소**를 말한다. 즉, 구성요소을 현재의 위치에서 잘라내거나 복제하여 다른 곳에 가져다 놓아도 사용할 수 있는 요소를 말한다.

블럭은 하나 이상의 Element로 구성되며, 따라서 클래스 이름을 작성할 때 하위의 Element에서 사용될 클래스 이름의 *어근*을 정의해 주어야 한다. (`class="header"`, `class="nav"` 등...) 

Block 요소에 대해 반드시 기억하고 있어야 하는 내용은 다음과 같다.

- 재사용할 수 있는, 기능적으로 독립적인 페이지 구성요소이다.
- *어근*을 정의할 때 마찬가지로 **형태가 아닌, 목적에 맞게 작성**해야 한다. 
- 주변 환경에 영향을 받아서는 안된다.
  - 즉, Block 요소에 **여백이나 위치를 지정해서는 안된다.**
- `tag`, `id`를 사용하지 않고, 오직 `class`만 이용한다.
- Block 내부에 또 다른 Block을 사용할 수 있다. 
  - 예를 들어, `card` Block 내부에 `card-side` Block을 정의할 수 있다.

### **Element**

Element는 쉽게 말해 **Block을 구성하는 단위**이다. 따라서 자신 소속된 Block 내부에서만 의미를 가지며, Block처럼 다른 곳에서 **독립적으로 재사용될 수 없다.**

`.block__element`와 같이 더블 언더바 `__`를 이용해 소속된 Block에서 정의된 *어근*에 연결한다. 

- 역시, **형태가 아닌, 목적에 맞게 작성**해야 한다.
- Element는 중첩해서 작성할 수 있지만, 권장되는 방법은 아니다.
  - `.block > .block__element1 > .block__element2`와 같이 사용 가능하다.
- Block이 반드시 Element를 가질 필요는 없다.

BEM 방법론에서는 `.block > .block__element1 > .block__element2`와 같은 구조에서도 `block__element2`를 `block__element1`의 하위 Element로 취급하지 않는다. 두 개의 Element 모두 평등한 Block의 Element로 취급된다. 

따라서 BEM 방법론은 아래와 같이 코드를 작성하지 않는다.
```
<form class="search-form">
  <div class="serach-form__content">
    <input class="search-form__content__input" />
    <button class="search-form__content__button">Search</button>
  </div>
</form>
```

위의 예시에서 `input`과 `button`은 `serach-form__content`라는 클래스 이름을 가지는 `<div>` 태그의 자식이지만, BEM 방법론에서는 `input`과 `button`을 `serach-form__content`의 자식 Element로 취급하지 않는다는 것이다.

BEM에서는 각각의 모든 Element를 Block을 구성하는 구성단위로 치급하며, 따라서 `input`과 `button` 역시 `serach-form`라는 Block을 구성하는 Element인 것이다. 따라서 다음과 같이 작명한다.

```
<form class="search-form">
  <div class="serach-form__content">
    <input class="search-form__input" />
    <button class="search-form__button">Search</button>
  </div>
</form>
```

### **Modifier**

마지막으로 Modifier는 **Block이나 Element의 속성이나 상태의 변화를 나타내기 위해 사용**된다. 특정한 상황에 따라서 색상이 변화하거나, 전체와 다르게 동작해야 하는 Block이나 Element를 만들 때 사용하면 된다.

```
<ul class="list">
  <li class="list__item list__item--active">리스트 항목 A</li>  
  <li class="list__item">리스트 항목 B</li>
  <li class="list__item">리스트 항목 C</li>
</ul>
```

위의 예시에서 사용된 `--active`가 바로 Modifier로, `list__item` Element의 상태를 나타내고 있다.

Modifier의 클래스 이름을 작명하는 방법에는 크게 두 가지 방법이 있는데, `Boolean` 타입으로 가정하고 작명하는 방법과 `Key-Value`의 형태로 작명하는 방법이 존재한다.

- `Boolean Type`
  - Modifier의 클래스 이름이 불리언 타입의 변수이며, 변수의 값이 `true`라고 가정한다.
  - 예들 들어, `--disabled`는 현재 Block 또는 Element가 사용불가능 상태라는 것을 의미한다.
- `Key-Value Type`
  - Modifier의 클래스 이름을 `Key-Value`의 형태로 작명해 **속성-내용**을 나타낸다.
  - 예를 들어, `--color-red`, `--color-black`와 같이 사용할 수 있다.


당연하게도 Modifier는 독립적으로 사용될 수 없으며, **반드시 Block 또는 Element에 사용**해야 한다.

<br>

## BEM 방법론의 장점과 단점

### 장점

1. 클래스 이름만으로 HTML 마크업 구조를 파악할 수 있다.
2. Sass,SCSS의 부모 참조자 `&`과 사용하기 굉장히 편리하다.
3. 작성된 Sass,SCSS에서 요소를 쉽게 찾을 수 있다.
    - `header` 아래에 `&__logo`, `&__title`과 같이 작성하기 때문이다.
4. Block을 구성하는 모든 Element를 독립적로 취급하여, 깊게 `Nesting`되지 않는다.
    - `.header .nav .list .itme .link`와 같은 상황이 발생하지 않는다.

```
/* BEM */

.header {
  &__nav {
    position: absolute;
  }
  &__list {
    clor: red;
  }
  &__item {
    outline: 0;
  }
  &__link {
    color: red;
  }
}
```

### 단점

1. 클래스 이름이 너무 길어져, 오히려 가독성과 사용성이 저하될 수 있다.
2. 코드 편집기에서 *더블 클릭*을 사용해 손쉽게 선택할 수 없다.

<br>

## 참고한 블로그, 문서

[BEM 관련 참고문서 1](https://nykim.work/15)  
[BEM 관련 참고문서 2](http://getbem.com/introduction/)