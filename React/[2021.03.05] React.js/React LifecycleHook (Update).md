# React Lifecycle Hook (Update)

여기서는 **컴포넌트가 수정될 때 React에서 실행하는 Lifecycle Hook**에 대해 알아본다.

<br>

## `getDerivedStateFromProps(props, state)`

이미 생성되어 화면에 표시되고 있는 컴포넌트에 수정사항이 발생하면, 컴포넌트 생성 Lifecylcle Hook에도 포함되어 있는 `getDerivedStateFromProps()`가 가장 먼저 호출된다.

역시 거의 사용할 일이 없는 Lifecycle Hook이지만, 전혀 사용하지 않는 것은 아니므로 알아두어야 한다.

### 사용 목적

`getDerivedStateFromProps()`는 컴포넌트에 전달된 `props`를 기반으로 수정될 컴포넌트의 내부 `state`를 변경하는 역할을 수행한다. 

예를 들어, 사용자 입력을 받기 위해 `<form>` 태그를 포함하는 컴포넌트가 외부 환경에 따라 상이한 초기 상태를 가지도록 하기 위해 `getDerivedStateFromProps()`를 사용할 수 있다.

마찬가지로 `getDerivedStateFromProps()` 내부에서 ***Side Effect*를 유발하는 함수를 실행해서는 안된다.**

### 사용 용례

```
class Update extends Component {
  static getDerivedStateFromProps(props, state) {
    const updatedState = state;

    return updatedState;  // 필수!  
  }
}
```

<br>

## `shouldComponentUpdate(nextProps, nextState)`

`shouldComponentUpdate()`는 **컴포넌트가 수정될 때 호출되는 Lifecycle Hook 중에서 가장 중요한 Hook**이라고 할 수 있으며, 개발자의 의도에 따라 컴포넌트를 다시 렌더링하는 것을 취소할 수 있도록 한다.

### 사용 목적

개발자는 `shouldComponentUpdate()`를 수정하여, **React가 컴포넌트를 지속적으로 평가하고 변경사항이 발생할 때 다시 렌더링해야 하는지 여부를 결정**할 수 있다.

`shouldComponentUpdate()`를 **잘못 사용하면 어플리케이션이 동작 자체를 멈춰버릴 가능성**이 있기 때문에 신중하게 사용해야 하지만, **불필요한 반복적인 렌더링을 방지하여 성능 최적화라는 목적을 달성**할 수 있도록 돕는다.

역시나 `shouldComponentUpdate()` 내부에서 ***Side Effect*를 유발하는 함수를 실행해서는 안된다.**

### 사용 용례

```
class Update extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return true or false;
  }
}
```

`shouldComponentUpdate()`는 반드시 `boolean` 타입의 값을 반환해야 하며, 이 값에 기반하여 컴포넌트의 렌더링 여부가 결정되게 된다. 

보통의 경우 현재의 `props`와 `nextProps`, 현재의 `state`와 `nextState`를 비교하여 개발자의 의도에 따라 컴포넌트의 렌더링 여부가 결정되도록 한다.


<br>

## `render()`

이미 앞서 다루었던 Lifecycle Hook으로, `render()`는 `JSX`로 작성된 코드를 반환한다.

[중요] React는 `render()` 메서드가 반환하는 `JSX` 코드를 분석 및 컴파일 하며, 최종적으로 **Virtual DOM**을 생성한다.
 
### 사용 목적

`render()`는 `JSX` 코드를 반환하기 이전에, 데이터를 필요한 형태로 가공하는 등 **Layout과 관련된 기능**을 수행하고 최종적으로 HTML 코드를 생성한다.

앞서 다루었던 두 개의 컴포넌트 생성 Lifecycle Hook과 동일하게, ***Side Effect*를 유발하거나 `setTimeout()`과 같이 렌더링 과정을 방해할 수 있는 함수를 포함해서는 안된다.**

<br>

## Updade the Child Components Props

`render()` 메서드의 실행이 종료되면, React는 `JSX` 코드에 포함된 모든 자식 컴포넌트를 평가한다.

만약 **자식 컴포넌트에 전달되는 `props`나 `state`가 변경된 경우, 해당하는 자식 컴포넌트에 대해 컴포넌트 수정 생명주기가 실행**된다.

모든 자식 컴포넌트의 컴포넌트 수정 생명주기가 수행 완료되면, 다음의 Lifecycle Hook이 호출된다.

<br>

## `getSnapshotBeforeUpdate(prevProps, prevState)`

`getSnapshotBeforeUpdate()`는 변경 이전의 `props`와 `state`를 인자로 전달 받는 역할을 수행하며, 컴포넌트 수정 생명주기에서 가장 먼저 호출되는 `getDerivedStateFromProps()`와 마찬가지로 거의 사용하지 않는 Lifecycle Hook이다.

### 사용 목적

`getSnapshotBeforeUpdate()`는 직접 DOM을 조작하기 위해서는 거의 사용되지 않는다.

컴포넌트가 수정되어 다시 렌더링되는 경우, **수정사항이 발생하기 이전의 사용자 스크롤 위치 등을 기억(= Snapshot)해 놓았다가 컴포넌트의 렌더링이 종료되면 해당 위치로 이동하는 것과 같은 작업을 수행**하기 위해 활용된다.

앞서 등장한 Lifecycle Hook과 동일하게, `getSnapshotBeforeUpdate` 내부에서도 *Side Effect*가 발생해서는 안된다.

### 사용 용례

```
class Update extends Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Do Something...

    return null;
  }
}
```

[참고] `getSnapshotBeforeUpdate()`는 반드시 *Snapshot Value* 또는 `null`을 반환해야 한다.

<br>

## `componentDidUpdate()`

컴포넌트 수정 생명주기에서 모든 Lifecycle Hook이 종료된 뒤 마지막으로 `componentDidUpdate()`가 호출된다.

### 사용 목적

컴포넌트 생성 주기의 `componentDidMount()`와 마찬가지로, ***Side Effect*를 발생시키기 위해 사용한다.**

즉, 서버에 HTTP 요청을 전송해 데이터를 불러오거나, LocalStroage 등에 접근하여 데이터를 저장하거나 읽어오는 등의 작업을 `componentDidUpdate()` 내부에서 수행하면 된다.

다만 `Promise` 내부가 아닌 `componentDidUpdate()` 내부에서 `useState()`를 동기적으로 호출하지 않아야 된다는 것과, HTTP 요청에 대한 응답을 이용해 컴포넌트를 변경할 때, **컴포넌트의 수정 생명주기가 무한히 반복**될 수 있다는 것을 주의해야 한다.

### 사용 용례

```
class Update extends Component {
  componentDidUpdate() {
    // Causing Some Side Effects...
  }
}
```

`componentDidUpdate()` 이전에 호출되는 Lifecycle Hook, `getSnapshotBeforeUpdate()`를 별도로 구현하지 않거나 `null`을 반환하는 경우, 위의 예시와 같이 사용한다.

하지만 `getSnapshotBeforeUpdate()`에서 *Snapshot Value*를 반환하는 경우 아래의 예시와 같이 사용한다.

```
class Update extends Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return {
      message: "Snapshot!"
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(snapshot);  // { message: "Snapshot!" }
  }
}
```

[참고] `componentDidUpdate()`는 기본적으로 `prevProps`, `prevState`, `snapshot` 세 가지의 인자를 가지며, `getSnapshotBeforeUpdate()`를 사용하지 않는 경우 생략할 수 있다.