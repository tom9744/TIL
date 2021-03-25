# DOM (Document Object Model)

텍스트 파일로 만들어져 있는 웹 페이지를 브라우저에 렌더링하려면 웹 페이지를 브라우저가 이해할 수 있는 구조로 메모리에 올려야 한다.

브라우저의 **렌더링 엔진**은 웹 페이지를 로드한 후, 파싱하여 웹 페이지를 브라우저가 이해할 수 있는 구조로 구성하여 메모리에 적재한다. **이것을 문서 객체 모델, DOM(_Document Object Model_)이라 부른다.**

웹 페이지를 구성하는 모든 요소(_Element_)와 요소의 속성(_Attribute_), 문자(_Text_)를 하나의 객체로 만든다. 이러한 **객체들을 트리 구조를 사용해 부모-자식의 관계로 표현한 것**이 DOM Tree이다.

DOM은 Javascript 코드를 통해 동적으로 변경할 수 있으며, 변경된 DOM은 렌더링에 반영된다.

![클라이언트 서버 모델](./images/ClientServer.png)

> 브라우저는 웹 문서(HTML, XML, SVG)를 로드한 후, 파싱하여 DOM(문서 객체 모델: Document Object Model)을 생성한다.

웹 페이지의 동적 변경을 위해 **DOM은 프로그래밍 언어가 자신에 접근하고 수정할 수 있는 방법을 제공**한다. 이를 DOM API(_Application Programming Interface_)라고 부른다.

이러한 DOM API는 Javascript만 사용할 수 있는 것은 아니며, **다른 프로그래밍 언어에서도 사용 가능**하다. 다만 Javascript를 통해 사용되는 경우가 다른 경우에 비해 압도적으로 많을 뿐이다.

<br>

## DOM Tree

DOM tree는 브라우저가 웹 페이지를 다운로드한 후, 렌더링 엔진이 파싱하여 브라우저가 이해할 수 있는 형태로 나타낸 모델을 의미한다. **객체의 트리로 구조화**되어 있기 때문에 DOM tree라 부른다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .red {
        color: #ff0000;
      }
      .blue {
        color: #0000ff;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>Cities</h1>
      <ul>
        <li id="one" class="red">Seoul</li>
        <li id="two" class="red">London</li>
        <li id="three" class="red">Newyork</li>
        <li id="four">Tokyo</li>
      </ul>
    </div>
  </body>
</html>
```

![DOM Tree](./images/DOMTree.png)

DOM에서 웹 페이지의 모든 요소(_Element_), 요소의 속성(_Attribute_), 문자(_Text_)는 **하나의 객체이며, DOM Tree 최상단에 위치한 문서(_Document_) 객체의 자식**이다.

요소의 중첩(_Nested_) 관계는 **객체의 트리로 구조화하여 부모-자식 관계를 표현**한다. DOM tree의 진입점(_Entry Point_)는 Document 객체이며 최종점은 문자를 나타내는 Text 객체이다.

DOM tree는 다음 네 종류의 노드로 구성되어 있다.

- 문서 노드(_Document Node_)
  - DOM Tree의 최상단에 위치한다.
  - 다른 노드에 접근하기 위해 반드시 거쳐야 하며, 즉 **DOM Tree의 진입점**이다.
- 요소 노드(_Element Node_)
  - `<html>`, `<body>`, `<div>`와 같은 HTML 요소를 나타낸다.
  - 또한 HTML 요소 간의 중첩관계를 나타내며, 결과적으로 **문서의 구조를 표현**한다.
  - 모든 요소 노드는 `HTMLElement` 객체를 상속한 객체로 구성된다.
    - `HTMLDivElement`, `HTMLInputElement` 등...
- 속성 노드(_Attribute Node_)
  - HTML 요소에 부여된 속성을 나타낸다.
    - `<div data-role="None"></div>`에서 `data-role`이 속성이다.
  - 속성 노드는 해당 속성이 지정된 **요소 노드의 자식이 아닌, 일부로 표현**된다.
    - 따라서 요소 노드에 접근하면, 속성을 참조하거나 수정할 수 있다.
- 문자 노드(_Text Node_)
  - 문자 노드는 HTML 요소에 포함된 문자(_Text_)를 나타낸다.
  - 문자 노드는 **요소 노드의 자식으로 표현**되며, 자식 노드를 가질 수 없다.
  - 즉, 문자 노드는 **DOM Tree의 리프 노드이자 최종점**이다.

> DOM을 이용해 웹 페이지를 조작하기 위해서는 다음과 같은 과정이 필요하다.
>
> 1. 조작하고자 하는 웹 페이지의 요소를 선택 또는 탐색한다.
> 2. 선택된 요소의 내용(_Content_) 또는 속성(_Attribute_)을 조작한다.
