# CSS 전처리기

회사에서 진행하고 있는 Vue.js SPA 프로젝트의 프로토타이핑 작업이 완료되었고, 발주사와의 회의에서도 긍정적인 피드백을 들을 수 있었다. 아직 백엔드 개발이 완료되지 않고 있지만, 머지않아 본격적으로 *REST API Endpoint*에 접근해 데이터를 받아와 사용자 View에서 렌더링하는 작업을 시작할 것 같다.

백엔드 개발이 완료되기를 기다리면서, 평소 관심을 가지고 있었던 *CSS Preprocessor* 중 하나인 **Sass/SCSS**에 대해 공부하고 Vue.js SPA 프로젝트에 반영해보려고 한다.

<br>

## **CSS 전처리기가 왜 필요한가?**

CSS는 비교적 배우기 쉽지만, 프로젝트의 규모가 커지고 다수의 개발자가 함께 개발하는 상황에서는 엄청난 불편함을 유발한다.

선택자(Selector) 이름이 충돌하거나, 상위 DOM에 적용된 CSS 속성에 의해 하위 DOM에서 지정한 속성이 적용되지 않고 무시되는 등 문제가 될 수 있는 여지는 굉장히 많다. 이러한 CSS의 불편함과 문제점을 개선하기 위해 등장한 것이 CSS 전처리기이다.

 웹 브라우저는 오직 순수한 CSS만 동작시킬 수 있기 때문에, `Sass`, `Less`, `Stylus`와 같은 CSS 전처리기를 웹 상에서 직접 동작시킬 수는 없다. 따라서 CSS 전처리기에서 제공하는 다양한 기능(선택자 중첩, 조건 및 반복문 등)을 사용해 CSS 문서를 작성하고 최종적으로 웹 브라우저에서 실행하기 위해서는 CSS로 컴파일 해주어야 한다.

 [참고] CSS 컴파일 방법은 전처리기의 종류에 따라 약간씩 다르다.


<br>

 ## **Sass? SCSS?**

 Sass(Syntactically Awesome Style Sheets)의 세번째 버전에서 새롭게 등장한 SCSS는 **기존의 CSS 구문과 완벽히 호환되도록 새로운 구문을 도입해 만든 Sass의 모든 기능을 지원하는 전처리기**이다.

**Sass 구문**
```
.list
  width: 100px
  float: left
  li
    color: red
    background: url("./image.jpg")
    &:last-child
      margin-right: -10px
```

**SCSS 구문**
```
.list {
  width: 100px;
  float: left;
  li {
    color: red;
    background: url("./image.jpg");
    &:last-child {
      margin-right: -10px;
    }
  }
}
```

각각 Sass, SCSS로 작성된 위의 예시 구문은 정확히 동일한 내용의 CSS 파일로 컴파일된다. 나의 경우 기존의 CSS 구문과 유사한 형태를 가진 SCSS의 구문이 조금 더 사용하기 편해보였다.

Sass와 SCSS의 거의 유일한 차이점은 ***Mixins***를 사용하는 방법이다. Mixins는 거의 대부분 유사한 속성을 무한히 반복하는 CSS 코드의 재사용성을 높여주는 기능이다. 

**Sass 구문**
```
=border-radius($radius)
  -webkit-border-radius: $radius
  -moz-border-radius:    $radius
  -ms-border-radius:     $radius
  border-radius:         $radius

.box
  +border-radius(10px)
```

**SCSS 구문**
```
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

.box { @include border-radius(10px); }
```

개인적인 의견이지만, 확실히 이번에도 SCSS 방식의 구문이 훨씬 쉽게 읽히고 사용하기도 편리한 것 같다. 따라서 다음부터는 Sass 문법은 제외하고 SCSS 문법만 사용하겠다.

<br>

## Vue.js 프로젝트에 SCSS 추가하기

```
npm install —-save-dev sass-loader node-sass
```

먼저 개발용 종속성으로 `sass-loader`와 `node-sass`를 설치한다. 여기서 `node-sass`는 Sass와 SCSS로 작성된 내용을 웹 브라우저가 실행할 수 있는 CSS로 **컴파일**해주는 도구이다.

### 지역적으로 사용하기

Vue.js에 기본적으로 내장되어 있는 `vue-loader` 덕분에 SFC(Single File Component) 구성의 `.vue` 내에서 `<style lang="scss">`와 같이 작성하면 별도의 추가적인 설정없이 바로 SCSS를 사용할 수 있다.

```
<style lang="scss">
$backgroundColor: red;  // 변수 사용

.className: {
    background: $backgroundColor;
}
</style>
```

### 전역적으로 사용하기

처음 SCSS를 접해보는 입장이기 때문에 잘 모르겠지만, 주로 SCSS 사용 시 `variables.scss`, `mixins.scss`, 또는 `functions.scss`와 같이 기능별로 파일을 구분하여 작성한다고 한다. 이러한 파일을 모든 `.vue` 파일에서 `@import @/assets/scss/variables.scss`와 같이 매번 불러와 사용하는 것은 비효율적이며, 따라서 SCSS 파일을 전역으로 등록해 사용한다.

[참고] Vue CLI의 `@`는 `src/` 디렉토리를 의미한다.

SCSS 파일을 Vue.js 프로젝트에 전역으로 등록하기 위해서는 Webpack 설정파일에 이들 파일을 등록해 주어야 한다. Vue CLI 3.x 버전부터 Webpack 관련 설정파일인 `webpack.config.js` 파일이 사라졌으므로 SCSS 파일을 전역으로 등록하기 위해서는 루트 디렉토리에 `vue.config.js` 파일을 새롭게 생성해 그곳에서 등록해주면 된다.

```
//vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/mixins.scss";
        `
      }
    }
  }
}
```

## *SCSS 문법*

SCSS의 자세한 문법에 대해서는 시간 관계 상 다음에 더 추가하도록 한다.

