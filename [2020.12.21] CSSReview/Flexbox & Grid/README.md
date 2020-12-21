# CSS Flexbox & Grid

#### Parent Element의 Children을 정렬하기 위한 CSS Layout 속성

## Flexbox
Flexbox는 `display: flex;`를 Parent Element에 적용하여 활성화할 수 있다.
기본적으로 Child Element는 좌측에서 우측으로 정렬되게 되며, `display: inline-block;`을 각각에 적용한 것과 같이 보이게된다. 

Child Element가 쌓이는 방향은 기본적으로 수평 방향이며, 이를 수직 방향으로 바꾸려면 기본 값 `flex-direction: row;`를 `flex-direction: column;`으로 변경하면 된다. 역방향으로 쌓는 것도 가능하지만, 잘 사용되지는 않는다.

`flex-wrap: nowrap`은 기본 값으로서, 브라우저 또는 Parent Element의 크기가 Chile Elements의 크기보다 작아지더라도 이들을 **다음줄로 분리하지 않는 것**이다. Child Elements가 떨어지게 하려면 `flex-wrap: wrap`을 적용한다.


## Flexbox의 정렬

### Parent Element

#### justify-content

Flexbox가 적용된 Parent Element의 Child Element들이 쌓여지는 방향으로 정렬을 수행하기 위한 속성이다. 

`justify-content: center;`를 적용해 요소들을 가운데로 정렬할 수 있으며, `flex-start, flex-end, space-between, space-around`와 같은 다양한 정렬 방식이 존재한다.

#### align-items

Flexbox가 적용된 Parent Element의 Child Element들이 형성하는 축의 수직방향으로 정렬을 수행하기 위한 속성이다.

`align-items: stretch`가 기본 값이며, 축의 수직방향으로 Child Element를 길게 늘어뜨린다. `flex-start, flex-end, center`와 같은 속성이 존재하고, 이들의 경우 **더 이상 Child Element가 자신의 크기만큼만 영역을 차지하고 늘어나지 않는다.**

#### align-content

`flex-wrap: wrap;`이 적용된 상태에서만 적용이 가능하다. **즉, 브라우저 화면이 작아져서 Child Elements를 한 줄에 표시할 수 없을 때, 아래쪽으로 이동되는 요소들을 정렬하는 것이다.** `align-content: flex-start;`를 적용하게 되면 Child Elements가 넘칠 때, 화면 상단에서 다음 줄로 이동하고 영역을 채우기 위해 늘어나지 않게 된다. `flex-end, center, space-between, space-around` 등의 속성이 존재한다.

### Child Element

#### flex-grow

Flexbox가 적용된 Parent Element의 Children에 적용되는 속성이다. 각각의 Child Element에 `flex-grow: 1;`을 적용하면, **여백 공간을 일정한 비율로** 채우게 된다. 즉, 완전히 1:1:1로 분할되는 것이 남은 여백 공간을 1:1:1로 각각의 Child Element에게 배정하여 빈 공간을 메우는 것이다.

예를 들어, 3개의 Children Elements가 있는 상황에서 첫번째 Child에만 `flex-grow: 1;`을 적용하면, 남은 공백 공간을 첫번째 Child만 늘어나면서 메우게 된다.

#### flex-basis

위의 속성은 **빈 공간을 일정한 비율로 나누는 것**이지만, 많은 경우 공간 자체를 일정한 비율로 나누려고 할 것이다. 이러한 상황에서 Parent Element에 적용할 수 있는 속성으로서, 기본 값은 `flex-basis: auto;`지만 `flex-basis: 0;`으로 수정하게 되면 각 Child Element가 **공간 자체를 일정하게 나누어 갖게 된다.**

#### flex-shrink (a.k.a. flex)

`flex-grow`의 반대 개념으로, 브라우저 화면이 Children Elements를 전부 표시할 수 없는 상황에서 **각 Element가 가지는 여유공간읰 크기를 일정한 비율로 줄이는 것**이다.

**`flex: 1;`은 `flex-shrink: 1;`의 축약형이며, `flex: 1;`로 사용하는 경우 `flex-basis: 0%`로 자동 설정**되어 각 Child Element는 공간 자체를 일정한 비율로 차지하며 여백이 줄어들게 된다. 

#### align-self

Flexbox의 Parent Element에서 `align-items`를 통해 일괄적으로 정렬하는 방법도 있지만, 각각의 Child Element에서 정렬이 필요한 경우도 있다.

`align-self: flex-start;`가 기본 값이며, `center, flex-end`와 같은 속성이 존재한다.

#### order

Flexbox에서 Children Elements가 쌓이는 순서를 지정하기 위한 속성으로, 단순히 `order: 1;`과 같이 설정하면 가장 첫번째로 쌓이게 된다. 실제 HTML 태그의 순서가 바뀌지는 않는다는 것을 주의해야 한다!


## Grid

단순히 Parent Element에 `display: grid;`만 설정하면 아무런 효과가 없다. 추가적으로 `grid-template-columns: 40% 60%;`와 같은 속성을 추가해주면 Children Elements가 4:6 비율로 정렬되게 된다.

이때, 비율에 기반한 설정의 사용을 최대한 지양하고 `grid-template-columns: 4fr 6fr;`와 같이 사용해야 한다. 이는, 각 Child Element 사이에 여백을 주기위한 속성인 `grid-gap: 1rem;`를 사용할때 **비율에 기반한 설정을 사용하면 가로 스크롤이 생성되는 문제**가 있기 때문이다.

`grid-template-columns: 1fr 1fr 1fr 1fr 1fr`과 같이 일정한 비율로 다수의  격자를 생성하고자 하는 경우, `grid-template-columns: repeat(5, 1fr)`와 같이 줄여서 사용할 수 있다. 

하나의 Column을 일정한 크기로 고정하고 나머지 Columns의 크기가 유동적으로 변하도록 하고 싶은 경우, `grid-template-columns: 300px 1fr`와 같이 사용한다.

각각의 Grid Cell에 포함된 내용의 크기가 모두 다르지만, 격자의 높이를 전체에 대해 일정하게 유지하고 싶은 경우 `grid-auto-rows: 300px;`를 적용하면 된다. 이떄, 어떠한 Cell의 내용이 지정된 크기(300px)를 초과하여 넘치는 것을 방지하려면 `grid-auto-rows: minmax(300px, auto);`를 적용하면 내용이 넘치는 경우 자동으로 내용의 크기게 맞게 Grid Cell이 늘어난다.

폰트의 크기게 맞추어 디자인 된 Layout인 경우, 픽셀 값을 사용하지 않고 **em** 단위로 설정하여 사용하는 것이 바람직하다.

## Grid의 정렬

### Grid Container

#### justify-items

각 Grid의 내용을 **수평 정렬**하기 위한 속성으로, `justify-items: center;`를 적용하면 Grid의 내용이 수평 방향으로 가운데 정렬된다. 이때, 각 Grid가 담고 있는 내용의 크기에 따라 크기가 변하게 된다.

#### align-items

각 Grid의 내용을 **수직 정렬**하기 위한 속성으로, `align-items: center;`를 적용하면 Grid의 내용이 수직 방향으로 가운데 정렬된다. 이때, 각 Grid가 담고 있는 내용의 크기에 따라 크기가 변하게 된다.


### Grid Cell

#### justify-self, align-self

전체 Grid Container에 대해 적용하지 않고, 각 Grid Cell에 개별적으로 적용할 수 있는 속성이다. 마찬가지로 `justify-self`는 수평 방향으로의 정렬, `align-self`는 수직 방향으로의 정렬이다.

#### grid-column, grid-row

각 Grid Cell이 하나의 Cell만 차지하는 것이 아니라, 다수의 Cell을 차지하도록 하여 보다 다양한 형태의 Layout을 작성할 수 있다.

예를 들어 Grid Container에 `grid-template-columns: 1fr 1fr 1fr`로 설정되어 있는 경우, 상단 전체를 차지하는 Header Layout을 작성하기 위해서는 해당 Grid Cell에 `grid-column: 1 / 4;`를 적용해주면 된다.

또 다른 예시로 Header Layout의 밑에 우측 방향에 고정된 광고 영역을 만들고 싶은 경우, 해당 Grid Cell에 `grid-column: 3;`과 `grid-row: 2 / 4;`를 적용해주면 된다.
