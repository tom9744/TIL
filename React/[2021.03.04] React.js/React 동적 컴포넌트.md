# React 동적(Dynamic) 컴포넌트

여기부터는 **클래스형 컴포넌트**와 **함수형 컴포넌트** 모두에 해당되는 내용이지만, 함수형 컴포넌트에 대한 이해를 돕기 위해 함수형 컴포넌트를 예시로 사용한다.

앞서 생성했던 함수형 컴포넌트는 다음과 같다.

```
import React from 'react';

const functionalComponent = () => {
  return <div>함수형 컴포넌트입니다.</div>
};

export default functionalComponent;
```

<br>

## 동적 컴포넌트

동적(Dynamic) 컴포넌트란, **일정한 하나의 값만 출력하지 않고 조건의 변화에 따라 상이한 값을 출력하는 컴포넌트**를 말한다. 실제 웹 어플리케이션에서도 대부분의 컴포넌트는 동적 컴포넌트이며, 정적 컴포넌트는 잘 사용되지 않는다.

가장 간단한 동적 컴포넌트의 예시는 다음과 같다.

```
import React from 'react';

const dynamicComponent = () => {
  return <div>Random Value: {Math.random() * 30}</div>
};

export default functionalComponent;
```

[참고] `JSX`에서 `{}` 사이에 Javascript 코드를 사용할 수 있다.

<br>

## 컴포넌트에 동적으로 데이터 전달하기

앞의 예시에서는 단순히 컴포넌트 내부에서 `Math.random()` 함수를 사용해 임의의 값을 출력하도록 하였다. 하지만 대부분의 경우 **하나의 컴포넌트에서 데이터를 가지고 있으며, 그 외의 컴포넌트는 데이터를 전달받아 사용하도록 하는 방식**이 선호된다.

<br>

### 컴포넌트에 props 전달하기

Vue.js에서와 같이, React.js에서도 `props`라는 개념을 사용해 컴포넌트 간의 데이터 전송을 가능하게 하고 있으며, 사용 방법은 아래의 예시와 같다.

```
import React, { Component } from 'react';
import './App.css';

import CustomComponment from '<컴포넌트 파일 경로>';

class App extends Component {
  render() {
    return (
      <div className="App">
        <!-- HTML Attribute의 형태로 props 전달 -->
        <CustomComponment name="Thomas" age="27" />
        <CustomComponment name="Stephanie" age="24" />

        <!-- HTML ChildNode의 형태로 props 전달 -->
        <CustomComponment>
          Hello World!
        </ CustomComponment>
      </div>
    );
  }
}

export default App;
```

React.js에서 컴포넌트에 `props`를 전달하는 방법은 아래의 두 가지이다.

1. **HTML Attribute**와 같은 형태로 전달
2. **HTML ChildNode**와 같은 형태로 전달

두 번째 방법은 Vue.js에서 `slot`을 사용하던 것과 비슷한 개념으로 생각된다.

[참고] 데이터를 가지고 있으며 종종 가공하기도 하는 것을 **Smart Component**, 데이터를 전달 받아 사용하기만 하는 것을 **Dumb Component**라고 한다.

<br>

### 전달 받은 props 사용하기

함수형 컴포넌트를 생성하는 예시 코드에서는 인자(Argument)를 사용하지 않았지만, 사실 **React는 기본적으로 전달 받은 `props`에 해당하는 인자를 전달**하고 있다.

따라서 컴포넌트에 전달된 `props`에 접근하기 위해서는 함수 선언부에 인자를 추가해 주면 되는데, 특별히 고정된 이름은 없지만 **통상적으로 아래 예시와 같이 `props`라는 이름을 사용**한다.

```
import React from 'react';

const dynamicComponent = (props) => {
  return <div>Hello, I'm {props.name} and I'm {props.age} years old!</div>
};

export default functionalComponent;
```

컴포넌트에 `props`를 전달하는 방법 중 **HTML Attribute** 형태로 전달된 `props`의 경우, 해당 Attribute의 이름을 통해 접근 또는 사용할 수 있다. 예를 들어, `<CustomComponent name="Thomas"/>`와 같이 전달된 `props`는 컴포넌트에서 `props.name`을 통해 접근할 수 있다.

```
import React from 'react';

const dynamicComponent = (props) => {
  return (
    <div>
      <p>Hello, I'm {props.name} and I'm {props.age} years old!</p>

      <p>{props.children}</p>
    </div>
  )
};

export default functionalComponent;
```

**HTML ChildNode**의 형태로 전달된 `props`의 경우, React에 의해 예약되어 있는 `props.children`을 통해 접근 및 사용할 수 있다. 만약 **HTML ChildNode** 형태로 전달된 `props`가 존재하지 않는다면, 해당 영역은 출력되지 않는다.

<br>

## props 사용의 장점

컴포넌트의 재사용성을 증대시키는 것은 React.js, Vue.js와 같은 모든 Web Frontend Framework의 목표이다.

이러한 `props`를 사용하면 컴포넌트의 내용을 동적으로 변경할 수 있게 되어, 컴포넌트의 재사용성이 증대된다.

컴포넌트를 재사용할 수 있는 방법은 여러가지가 있지만, `props`를 사용하는 것은 그 중 가장 기초가 되는 내용이다.
