# React Lifecycle Hook (Creation)

클래스형 컴포넌트에서 지원하는 *Lifecycle Hook*은 **컴포넌트가 생성, 갱신, 삭제될 때 React에 의해 자동적으로 실행되는 일련의 함수**들을 말한다.

Vue.js에서도 `beforeCreate`, `created`와 같은 *Lifecycle Hook*을 이용해 컴포넌트가 생성되거나 변경, 또는 삭제 될 때 필요한 함수를 실행시키도록 구현하는 방법을 많이 사용하였다.

여기서는 **컴포넌트가 처음으로 생성될 때 React에서 실행하는 Lifecycle Hook**에 대해 알아본다.

<br>

## `constructor(props)`

새로운 컴포넌트가 생성될 때 가장 먼저 호출되는 것은 `constructor()`인데, 이것은 사실 React에 포함된 Lifecycle Hook은 아니고 **Javascript ES6의 기본 기능**이다.

`constructor(props)`와 같이 `props`를 인자로 전달 받으며, **기본 기능 이외에 별도의 기능을 추가하기 위해 `constructor()`를 수정하는 경우 `super(props)`를 반드시 호출**해 주어야 한다.  

### 사용 목적

`constructor()`는 컴포넌트의 상태를 초기화하기 위해 사용된다. `constructor()`를 사용할 때 주의할 점이 있는데, *Side Effect*를 발생시켜서는 안된다는 것이다.

*Side Effect*란 다소 추상적인 개념이지만, 쉽게 말해서 **HTTP 요청을 전송하거나 어떠한 정보를 LocalStorage에 저장하는 등의 행동**을 말한다.

[중요] `constructor()`에서 *Side Effect*가 발생하면, 어플리케이션의 성능에 악영향을 미칠 수 있다.

### 사용 용례

```
class App extends Component {
  constructor(props) {
    super(props);  // 필수!

    console.log("[App.js] Constructor");

    this.state = { ... };
  }

  this.state = { ... };
}
```

`constructor()`에서 `state`를 초기화 하는 경우, `setState()`를 사용하지 않고 `this.state`로 직접 초기화 해주어야 한다. 

이는 `setState()`는 기본적으로 **현재의 `state`와 변경된 `state`를 비교하여 변경된 부분만 수정**하며, `constructor()`가 호출되는 시점에서는 `state`가 아무런 값도 가지고 있지 않아 `setState()`가 정상적으로 작동하지 않기 때문이다.

<br>

## `getDerivedStateFromProps(props, state)`

다음으로는 실질적인 React Lifecycle Hook인 `getDerivedStateFromProps()`가 실행된다.

`getDerivedStateFromProps()`는 클래스형 컴포넌트의 `props`가 변화할 때, 이러한 변경 사항을 `state`와 동기화해주는 역할을 수행한다. 

### 사용 목적

`getDerivedStateFromProps()`는 사실 사용할 일이 굉장히 드문 Lifecycle Hook이지만, **` props`의 변경에 따라 컴포넌트 내부의 `state`가 변해야하는 상황**에서 사용된다.

`constructor()`와 마찬가지로 **HTTP 요청을 전송하는 등 *Side Effect*를 유발할 수 있는 로직을 포함해서는 안된다.**

### 사용 용례

```
class App extends Component {
  static getDerivedStateFromProps(props, state) {
    console.log("[App.js] getDerivedStateFromProps", props);

    const updatedState = state;

    return updatedState;  // 필수!  
  }
}
```

`getDerivedStateFromProps()`는 사실 정적 메서드이기 때문에, `static` 키워드를 앞에 추가해 주어야 한다. 또한, 위의 예시에서는 `state`가 변경되지는 않았지만, 반드시 `return updatedState`와 같이 변경된 `state`를 반환해야 한다.

<br>

## `render()`

이미 앞서 다루었던 Lifecycle Hook으로, `render()`는 `JSX`로 작성된 코드를 반환한다.

### 사용 목적

`render()`는 `JSX` 코드를 반환하기 이전에, 데이터를 필요한 형태로 가공하는 등 **Layout과 관련된 기능**을 수행하고 최종적으로 HTML 코드를 생성한다.

앞서 다루었던 두 개의 컴포넌트 생성 Lifecycle Hook과 동일하게, ***Side Effect*를 유발하거나 `setTimeout()`과 같이 렌더링 과정을 방해할 수 있는 함수를 포함해서는 안된다.**

<br>

## Render the Child Components

`render()`가 성공적으로 종료되면, 다음으로는 해당 **컴포넌트가 포함하고 있는 자식 컴포넌트의 렌더링을 진행**한다. 즉, 컴포넌트에 포함된 다른 컴포넌트에 대한 컴포넌트 생성 Lifecycle Hook이 실행되는 것이다.

[참고] 모든 자식 컴포넌트에 대한 렌더링이 종료될 때, 비로소 다음 Lifecycle Hook이 실행된다.

<br>

## `componentDidMount()`

`componentDidMount()`는 컴포넌트 생성 Lifecycle Hook 중 가장 마지막에 호출된다. 즉, **컴포넌트 생성이 완료되고 실제적으로 DOM에 마운트될 때 호출되는 Lifecycle Hook**인 것이다.

React.js 프로젝트에서 가장 많이 사용되는 `componentDidMount()`에서는, 드디어 *Side Effect*를 발생시키는 함수를 포함시킬 수 있다.

### 사용 목적

HTTP 요청을 전송해 서버로부터 새로운 데이터를 가져오거나, LocalStorage/Cookie/SessionStorage에서 데이터를 읽거나 쓰는 등 ***Side Effect*를 발생**시킨다. 

주의해야 할 것은 `fetch API` 또는 `axios`를 이용해 전송한 HTTP 요청에 대한 `Promise`의 내부에서 `setState()`를 호출하는 **비동기적인 `state`의 변경은 가능**하지만, `componentDidMount()` 내부에서 **직접 `setState()`를 호출하는 동기적인 `state` 변경은 불가능**하다는 점이다.

[참고] `setState()`를 동기적으로 호출하면, React가 컴포넌트를 다시 렌더링하게 되어 성능에 악영향을 미친다.

### 사용 용례

```
class App extends Component {
  componentDidMount() {
    console.log("[App.js] componentDidMount");

    // Send HTTP Requests...
  }
}
```