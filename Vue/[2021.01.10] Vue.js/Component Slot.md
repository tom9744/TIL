# Slot

오늘은 커스텀 컴포넌트를 보다 자유롭고 유연하게 재활용할 수 있도록 해주는 Vue.js의 `slot`에 대해 알아보려고 한다.  

## *Props* 복습

Vue.js의 모든 **컴포넌트 인스턴스는 자체적으로 격리된 범위**를 가지므로 **상위 컴포넌트에 있는 데이터를 직접 참조할 수 없다.**  
따라서 컴포넌트를 사용할 때, 상위 컴포넌트에 존재하는 데이터가 필요하다면 *Props*를 통해 필요한 데이터를 전달받아 사용해야 한다.

상위 컴포넌트
```
<custom-component message="안녕하세요!"></custom-component>
```

하위 컴포넌트
```
Vue.component('custom-component', {
  props: ['message'],
  template: '<span>{{ message }}</span>'
})
```

물론 `v-bind` 디렉티브를 사용해 상위 컴포넌트의 데이터에 *Props*를 동적으로 바인딩 할 수도 있다.  
상위 컴포넌트에서 하위 컴포넌트로 전달할 *Props*를 컴포넌트 태그의 *Attribute*에서 정의할 때, `v-bind` 디렉티브를 사용한다.  

```
<custom-component v-bind:message="안녕하세요!"></custom-component>

또는 

<custom-component :message="안녕하세요!"></custom-component>
```

### Props 검증

컴포넌트가 전달받을 예정인 *Props*에 대한 요구사항을 다음과 같은 방법으로 정의할 수도 있다.  
정의된 요구사항이 만족되지 않으면 Vue.js에서 오류를 발생시키므로 **혹시라도 잘못된 데이터가 전달되는 것을 방지**할 수 있다. 

```
Vue.component('custom-component', {
  props: {
    propA: Number,
     // String, Number 타입 둘 다 가능
    propB: [String, Number],
    propC: {
      type: String,
      required: true
    },
    propD: {
      type: Number,
      default: 100
    },
    // 객체, 또는 배열의 기본값은 팩토리 함수에서 반환해야한다.
    propE {
      type: Object,
      default: () => {
        return { message: 'Hello!' };
      }
    }
  }
  template: '<span>{{ message }}</span>'
})
```

## `<slot>` 사용하기

`<slot>` 태그를 사용하면 상위 컴포넌트에서 하위 컴포넌트로 HTML 템플릿 코드를 전달할 수 있게 된다.  

상위 컴포넌트
```
<exmaple-component>
  <h1>안녕하세요!</h1>
</exmaple-component>
```

하위 컴포넌트
```
<div class="message">
  <slot></slot>
</div>
```

위의 예시에서, 하위 컴포넌트의 `<slot> </slot>` 사이에 상위 컴포넌트에서 입력한 `<h1>안녕하세요!</h1>`가 전달된다.

단순한 HTML 템플릿 코드만 전달할 수 있는 것은 아니며, 서드파티 또는 사용자 정의 컴포넌트도 `<slot>`에 전달할 수 있다.

```
<exmaple-component>
  <!-- 서드파티 컴포넌트를 슬롯에 전달 -->
  <font-awesome-icon name="user"></font-awesome-icon>
  <h1>안녕하세요!</h1>
</exmaple-component>
```

만약 `<exmaple-component>` 사용자 정의 컴포넌트가 `<slot>` 요소를 가지고 있지 않을 경우, 모든 내용은 무시된다.

**[중요]** `<slot>` 요소에 전달되는 템플릿 코드는 여전히 **상위 컴포넌트에서 컴파일**된다는 것을 기억해야 한다. 즉, 하위 컴포넌트의 데이터에는 접근할 수 없다.

### 기본값 지정하기

아무런 컨텐츠도 `<slot>` 요소에 전달되지 않는 경우 렌더링 되는 기본값을 지정해 놓는 것이 유용한 경우가 있다.  
예를 들어 버튼 컴포넌트를 작성할 때 기본적으로 '제출하기'라는 텍스트가 출력되도록 설정하는 경우를 가정해볼 수 있을 것 같다.

하위 컴포넌트
```
<button type="submit">
  <!-- 기본값 지정 -->
  <slot> 제출하기 </slot>
</button>
```

상위 컴포넌트
```
<!-- 기본값 '제출하기'가 렌더링 된다. -->
<custom-button></custom-button>

<!-- '저장하기'로 교체되어 렌더링 된다. -->
<custom-button>저장하기</custom-button>
```

## 이름이 있는 슬롯 (Named Slots)

다수의 `<slot>`을 사용하는 컴포넌트에서 각각의 `<slot>`에 이름을 지정하여 보다 직관적으로 사용할 수 있다.  
세개의 `<slot>`을 가지는 `<base-layout>`이라는 사용자 정의 컴포넌트를 작성하는 예시를 살펴보자. 

하위 컴포넌트
```
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

별도의 `name` 속성이 부여되지 않은 `<slot>`은 암묵적으로 "default"라는 값이 적용된다.  
즉, `<slot name="default"></slot>`과 같은 코드로 변환되는 것이다.

위와 같이 이름 지정된 `<slot>`에 내용을 전달하려면 실제로 렌더링되지 않는 가상요소 `<template>`에  
`v-slot` 디렉티브를 사용해 지정된 `name`을 입력하면 된다.

상위 컴포넌트
```
<base-layout>
  <template v-slot:header>
    <h1>헤더 영역입니다.</h1>
  </template>

  <p>메인 컨텐츠입니다.</p>

  <template v-slot:footer>
    <p>푸터 영역입니다.</p>
  </template>
</base-layout>
```

`<template v-slot:...>`으로 싸여있지 않은 내용물들은 이름이 지정되지 않은 `<slot>`에 해당되는 것으로 간주된다.  

하지만 보다 명시적으로 코드를 작성하기 위해 `<template v-slot=default>`와 같이 작성할 수도 있다.

상위 컴포넌트
```
<base-layout>
  <template v-slot:header>
    <h1>헤더 영역입니다.</h1>
  </template>

  <!-- 명시적으로 default 값을 지정한다. -->
  <template v-slot=default>
    <p>메인 컨텐츠입니다.</p>
  </template>

  <template v-slot:footer>
    <p>푸터 영역입니다.</p>
  </template>
</base-layout>
```

## 범위가 있는 슬롯 (Scoped Slots)

개인적으로 이러한 경우를 아직 직접 마주한 적은 없지만, 종종 하위 컴포넌트에서만 접근할 수 있는 데이터에서  
슬롯에 필요한 내용을 가져오는 것이 필요할 수도 있다. 그러한 경우, *Scoped Slot* 기능을 사용할 수 있다.

하위 컴포넌트
```
<template>
  <span>
    <slot>{{ user.lastName }}</slot>
  </span>
</template>

<script>
  exports default {
    data() {
      return {
        user: {
          fistname: "Junyoung"
          lastname: "Yang"
        }
      }
    }
  }
</script>
```

위의 하위 컴포넌트에서 `<slot>`의 기본값으로 하위 컴포넌트에 속한 데이터 `user.lastName`을 사용하고 있는데,  
아래와 같이 상위 컴포넌트에서 기본값을 `user.lastName`가 아닌 `user.fisrtName`으로 변경하고자 한다.

상위 컴포넌트
```
<current-user>
  {{ user.firstName }}
</current-user>
```

위의 코드는 당연하게도 작동하지 않는데, `<current-user>` 컴포넌트 내부에서만 `user` 데이터에 접근할 수 있기 때문이다.  

상위 컴포넌트에서 하위 컴포넌트의 데이터인 `user`에 접근하려면 `user`를 `<slot>` 요소에 속성으로 연결해야 한다.  

히위 컴포넌트
```
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

`<slot>` 요소에 연결된 속성을 *슬롯 속성(Slot Props)*라고 하며, 이제 상위 컴포넌트의 범위(Scope)에서  
`v-slot`에 연결한 *슬롯 속성(Slot Props)*을 통해 하위 컴포넌트의 데이터에 접근할 수 있다.

상위 컴포넌트
```
<current-user>
   <!-- slotProps는 사용자 정의로 마음대로 바꾸어 사용 가능하다. -->
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

`<slot>`에 대해 알아야 할 더 많은 내용이 있지만, 당장 사용하지 않을 것 같은 기능들이라 여기서 정리를 마친다.

혹시나 나중에 더 많은 정보가 필요하게 되면 [Vue.js 공식 문서](https://kr.vuejs.org/v2/guide/components-slots.html)에서 참조하도록 한다.

