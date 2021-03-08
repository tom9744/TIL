# React State

## State 란?

앞서 공부한 `props`는 **외부의 데이터**를 컴포넌트에 전달하기 위한 방법이었다. 하지만 프로젝트의 규모가 성장하면, **컴포넌트 내부에 데이터를 두고 관리해야 하는 상황이 존재**한다.

이와 같이 컴포넌트 내부에 존재하며, 컴포넌트 스스로가 관리하거나 조작하는 데이터를 **State**라고 부른다.

지난번 회사에서 Vue.js를 이용해 구현했던 프로젝트의 사용자 인증 페이지를 예시로 생각해보면, **사용자 인증 컴포넌트**에서 `isLogIn`이라는 `boolean` 변수를 통해 **로그인 컴포넌트**와 **회원가입 컴포넌트** 중 어떠한 컴포넌트를 표시할 것인지 결정한다.

이 때, **사용자 인증 컴포넌트**의 `isLogIn` 변수를 **State**라고 부를 수 있는 것이다.

<br>

## 클래스형 컴포넌트 vs 함수형 컴포넌트

이러한 **State**라는 것은 `react` 패키지의 `Component`를 상속받아 구현된 클래스형 컴포넌트만 사용할 수 있었지만, React 16.8 버전 이후부터 **React Hooks**라는 것이 도입되면서 **함수형 컴포넌트에서도 State를 사용할 수 있게 되었다.**

<br>

### 클래스형 컴포넌트에서 State 사용하기

클래스형 컴포넌트의 경우, 상속받고 있는 `Component` 클래스(?)에 이미 `state`라는 필드가 포함되어 있다.

따라서 아래의 예시와 같이, `state = {}`에 해당 컴포넌트에서 관리하고자 하는 **State**를 **Javascript Object**의 형태로 정의하면 된다.

```
class SmartComponent extends Component {
    state = {
        personList: [
            { name: "Junyoung", age: 27 },
            { name: "Thomas", age: 22 },
            { name: "Linetti", age: 25 }
        ],

        showList: false
    }

    render() {
        return <div>Hi, My name is {this.state.personList[0].name}</div>
    }
}
```

컴포넌트 내부에서 **State**에 접근하기 위해서는 `this.state`와 같이 사용하면 된다.

<br>

### 클래스형 컴포넌트에서 State 변경하기

```
class SmartComponent extends Component {
    state = {
        personList: [
            { name: "Junyoung", age: 27 },
            { name: "Thomas", age: 22 },
            { name: "Linetti", age: 25 }
        ],

        showList: false
    }

    // ES6 Arrow Function의 'this'는 '함수 선언부', 즉 클래스이다.
    clickHandler = () => {
        ...
    }

    render() {
        return (
            <div onClick={this.clickHandler}>
                Hi, My name is {this.state.personList[0].name}
            </div>
        )
    }
}
```

**State**는 시간의 흐름에 따라 지속적으로 변경되는데, 일반적인 Javascript Object의 속성을 변경하듯 `clickHandler()` 메서드에서 `this.state.showList = true`와 같이 **State**의 값을 직접적으로 변경하면 `Do not mutate state diretly`라는 경고 문구가 출력된다.

이는 **React**가 외부에서 직접적으로 수정된 **State**를 감지하지 못하기 때문이며, 이로 인해 Virtual DOM이 개발자가 기대한 바와 같이 작동하지 않을 수 있다.

따라서, **State**를 변경하기 위해서는 **반드시 `Component` 클래스에 포함되어 있는 `setState()` 메서드를 사용해 변경**해야 한다.

```
clickHandler = () => {
    this.setState({
        showList: true
    })
}
```

위의 코드는 `setState()` 메서드를 사용해 **State**의 일부를 변경하는 예시이다.

`setState()` 메서드를 사용하면 React는 매개변수로 전달된 Object와 현재 **State**를 비교하여, 수정이 발생한 부분만 반영한다.

즉, 위의 코드를 실행하면 **State는 아래와 같이 변경**된다.

```
state = {
    personList: [
        { name: "Junyoung", age: 27 },
        { name: "Thomas", age: 22 },
        { name: "Linetti", age: 25 }
    ],

    showList: true  // [중요]수정이 발생한 속성만 변경된다!
}
```

<br>

### 함수형 컴포넌트에서 State 사용하기

함수형 컴포넌트에서 State를 사용하기 위해서는 React 16.8 버전부터 도입된 **React Hooks**라는 것을 사용해야 하는데, 아직 React의 기본을 공부하는 단계이므로 생략하고 추후에 다시 공부하는 것이 좋을 것 같다.
