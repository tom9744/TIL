# React 함수형(Functional) 컴포넌트

`react-srcipt` 버전 1.1.5를 사용해 새로운 React.js 프로젝트를 생성하면, 기본적으로 포함되어 있는 `App.js` 파일에서 *Root Component*를 아래와 같은 **클래스형 컴포넌트**를 이용해 구현하고 있다.

```
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

**클래스형 컴포넌트는** `react` 패키지의 `Component`를 상속하여 작성하며,
컴포넌트에서 필요로하는 기능을 **클래스의 속성 또는 메서드**로 작성한다.

하지만, 이러한 **클래스형 컴포넌트**는 React 16.X 이후 도태되기 시작하였으며, 최신 버전의 React에서는 *React Hooks*를 활용하는 **함수형 컴포넌트를 이용할 것을 권장**하고 있다.

<br>

## 함수형 컴포넌트 생성하기

함수형 컴포넌트는 아래의 예시와 같이 ES5 또는 ES6 문법에 따라 일반적인 함수를 선언하고, `JSX`를 반환하도록 작성하면 생성할 수 있다.

함수에서 반환한 `JSX` 문법은 자동적으로 `React.createElement()`로 컴파일 되어 실행되기 때문에, `React`(= `react` 패키지의 `default export`)를 반드시 `import` 해주어야 한다.

마지막으로, 생성한 **컴포넌트를 외부에서 사용할 수 있도록 하기 위해 `export default <함수 이름>`을 추가**해 주면 된다.

```
import React from 'react';

const functionalComponent = () => {
  return <div>함수형 컴포넌트입니다.</div>
};

export default functionalComponent;
```

[참고] `export default`를 사용하면 외부에서 해당 파일을 `import`할 때, 기본적으로 `functionalComponent`에 접근할 수 있도록 한다.

<br>

## 함수형 컴포넌트 사용하기

위에서 생성한 함수형 컴포넌트를 다른 파일에서 `import`하여 사용하는 예시는 다음과 같다.

```
import React, { Component } from 'react';
import './App.css';

import CustomComponment from '<컴포넌트 파일 경로>';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <!-- 함수형 컴포넌트 등록 -->
        <CustomComponment />
      </div>
    );
  }
}

export default App;
```

[참고] 여기서 사용하고 있는 `CustomComponment`라는 이름은 정해진 것이 아니며, `export default`를 통해 모듈을 내보내고 있기 때문에 **사용자가 원하는 이름으로 자유롭게 변경 가능**하다.
