# React JSX 이해하기

```
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Hello, World!
        </p>
      </div>
    );
  }
}

export default App;
```

위의 *Class-Based Component*를 작성한 코드 예시를 확인하면, `render()` 메서드가 **HTML 코드같이 생긴 것**을 반환하고 있다. 생김새가 HTML과 너무나 유사하기 때문에 HTML 코드일 것이라 생각할 수 있지만 이것은 **HTML도, Javascript 코드도 아닌 `JSX` 코드**이다.

<br>

## JSX란?

`JSX`는 React.js에서 제공하는 기능 중 하나로, **HTML 문법을 사용해 Javascript 코드를 작성**할 수 있도록 한다. 

`JSX`는 코드를 작성할 때 **비교적 친숙한 HTML 문법을 사용**할 수 있도록 하여 개발 과정의 편의성을 제공하고, **최종적으로 Javscript 코드로 변환**되어 브라우저 상에서 실행된다.

예를 들어, `JSX` 문법을 이용해 *Root Component*를 작성한 코드는 아래와 같은 Javascript 코드로 변환된다.

```
render() {
  return React.createElement(
    "div", 
    { className: "App" }, 
    React.createElement(
      "h1",
      { className: "App-intro" },
      "Hello, World!"
    )
  );
}
```

개발자가 `JSX`를 이용해 작성한 모든 코드는 위와 같은 형태로 최종 변환되어 실행되기 때문에, 실제 사용하지 않더라도 반드시 `import React, { Component } from 'react'`와 같이 `React` 패키지를 `import` 해주어야 한다.

<br>

## JSX의 제약사항

`JSX`는 개발자에가 HTML 문법을 사용해 코드를 작성할 수 있는 편의를 제공하지만, 아무래도 **"진짜 HTML"은 아니기 때문에 몇가지 제약사항이 존재**한다. 

<br>

### `class` 속성 대신 `className`을 사용

그 중 가장 대표적인 것이 HTML의 `class` 속성을 사용할 수 없어 `className`을 대신 사용해야 하는 점이다.  이는 `class`가 이미 Javascript에서 클래스를 선언하기 위해 사용되는 예약어이기 때문이다.


<br>

### 다수의 HTML Element 반환 불가

다음으로 중요한 제약사항은 `render()` 메서드의 `return` 부분에서 2개 이상의 HTML Element를 반환할 수 없다는 점이다. 즉, `render()` 메서드가 `JSX` 코드의 길이에 상관없이 **모든 하위 Element들을 감싸는 단 하나의 Root HTML Element만을 반환**해야 한다는 것이다.

Vue.js에서도 `<template>` 내부에 하나의 Root Element만 사용할 수 있다는 것을 상기하면 기억하기 좋을 것 같다.

[참고] 최신 버전의 React.js에서는 단일 Root Element 반환에 대한 제약사항이 다소 약화되었지만, 여전히 이러한 제약사항을 따르는 것은 권장되고 있다. Vue 3에서 `<template>`에 2개 이상의 HTML Element를 사용할 수 있도록 변경된 것과 같은 맥락으로 보인다.
