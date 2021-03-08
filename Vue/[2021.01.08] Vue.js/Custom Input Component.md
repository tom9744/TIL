# 커스텀 컴포넌트로 나만의 `<Input>` 태그 만들기

웹 어플리케이션을 제작하다보면 사용자 인증, 게시물 작성 등 `<form>`과 `<input>` 태그를 사용할 일이 굉장히 많다.  
이와같이 사용자로부터 데이터를 입력받아 서버로 전송할 때, *Server Side*에서 검증(Validation)이 수행되기는 하지만,  
*Client Side*에서도 일차적인 데이터 검증을 수행하는 것이 바람직하다.

따라서 단순히 `<form>`, `<input>` 태그만 사용해 입력 폼을 작성하는 것이 아니라, 디자인적 요소를 추가하기 위한 아이콘,  
또는 데이터 검증을 위한 로직, 사용자 입력 과정의 오류를 최소화 하기 위한 도움 메세지 등 다양한 추가 요소가 필요하다.

특히 이번에 인턴으로 입사한 회사에서 진행하는 프로젝트에서는 *HTML*, *CSS*, *Javascript*에 대한 이해도를 높이기 위해  
학교에서 진행한 프로젝트에서 굉장히 유용하게 사용했던 UI 프레임워크 *Vuetify*를 사용하지 않기로 하였다.

다음은 사용자 로그인 화면에서 굉장히 간단한 데이터 검증 - 데이터 입력 유무 판별 - 을 진행하는 코드 중 일부이다.

```
<div class="input">
  <div
    class="input-wrapper"
    :class="emailMsg.length === 0 ? '' : 'invalid'"
  >
    <svg-icon
      class="input-icon"
      type="mdi"
      :path="accountIcon"
      :size="28"
    />
    <input
      v-model="email"
      class="input-content"
      placeholder="이메일"
      type="text"
    />
  </div>
  <div class="input-hint">
    <small class="hint">{{ emailMsg }}</small>
  </div>
</div>
```

단순히 사용자의 이메일을 입력 받고 빈 문자열인지 여부만 판별하는 것인데도 코드가 굉장히 길고 읽기 어렵다.  
이어서 제작할 예정인 회원가입 폼에서는 더 많은 데이터의 입력이 필요하기 때문에,  
위의 코드를 `<Input />`이라는 컴포넌트로 추출하여, 다양한 곳에서 재사용 가능하도록 만들고자 한다.  


## 컴포넌트에 필요한 데이터를 *Props*를 이용해 전달하기 

우선 새롭게 `Input.vue` 파일을 만들고, `<template>`에 위의 코드를 그대로 복사해 가져온다.  
그리고 부모 컴포넌트에서 전달 받아야 하는 정보들이 무엇이 있는지 다음과 같이 정리해 보았다.

1. `<input>` 태그에 사용할 속성값
    - `placeholder`, `type`, 그리고 `value`
    - 여기서 `value`는 커스텀 컴포넌트에 `v-model`을 사용하기 위해 필요하다.
2. `<svg-icon>` 컴포넌트에서 필요로 하는 값
    - `path`, `size` 등
3. *Hint* 영역에 표시할 문자열 데이터

[참고] `<svg-icon>`는 *Material Design Icon*을 사용하기 위한 모듈이다.

대략 어떤 데이터가 *Props*로 전달되어야 하는지 정의하였으니, 다음과 같이 코드를 작성한다.

```
<script>
export default {
  props: {
    value: {
      type: String // Custom Component v-model
    },
    inputType: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ""
    },
    errorMsg: {
      type: String,
      default: ""
    },
    iconPath: {
      type: String,
      required: true
    },
    iconSize: {
      type: Number,
      default: 28
    }
  },

  methods: {
    updateValue(value) {
      this.$emit("input", value);
    }
  }
};
</script>
```

*Props*의 `value` 속성과 *Methods*에 정의되어 있는 메서드 `updateValue()`는 커스텀 컴포넌트에 `v-model`을 사용하기 위해 필요하다.  

## 커스텀 컴포넌트에 `v-model` 적용하기

Vue.js는 `<input>` 태그에서와 같이 양방향 데이터 바인딩이 필요한 경우, `v-model`이라는 *디렉티브*를 사용한다.  

```
<input v-model="randomData"></input>
```

위의 코드는 `v-model`을 사용하는 아주 간단한 예시인데, `v-model`은 사실 아래의 코드를 함축해 놓은 것이다.  

```
<input
  v-bind:value="randomData"
  v-on:input="randomData = $event.target.value">
</input>
```

즉, `v-model`의 양방향 데이터 바인딩을 `v-bind`와 `v-on` 디렉티브를 이용해 구현할 수 있다는 것이다.  

- `v-bind`: 데이터를 **단방향**으로 바인딩한다.
- `v-on:input`: `<input>`, `<textarea>`와 같은 요소의 `value` 속성이 변할 때마다 발생하는 *Input Event*를 청취한다.

[참고] `$event`는 *Vanilla Javascript*를 이용해 DOM에 *이벤트 리스너*를 추가할 때 반환되는 이벤트 자체에 대한 객체이다. 

위의 내용을 종합하였을 때, `v-model`을 이용하는 컴포넌트는
- `value`를 *Props*로 가지며,  
- 새롭게 갱신된 값을 `input` 이벤트를 통해 내보낸다.

구현하고자 하는 커스텀 `<Input>` 컴포넌트에서도 사용자의 입력을 받은 데이터를 양방향 바인딩 해야하기 때문에,  
위의 내용을 반드시 잘 숙지하고 반영할 수 있도록 해야겠다.


## 기존 코드에 적용하기

위에서 알게된 내용을 바탕으로 나만의 `<Input>` 컴포넌트를 다음의 코드와 같이 구현하였다.

```
<template>
  <div class="input-container" :class="errorMsg.length === 0 ? '' : 'invalid'">
    <div class="input-wrapper">
      <svg-icon class="icon" type="mdi" :path="iconPath" :size="iconSize" />

      <input
        class="input"
        :type="inputType"
        :placeholder="placeholder"
        :value="value"
        @input="updateValue($event.target.value)"
      />
    </div>

    <div class="hint">
      <transition name="hint" appear>
        <small v-if="errorMsg.length === 0 ? false : true">
          {{ errorMsg }}
        </small>
      </transition>
    </div>
  </div>
</template>
```

전체 입력 폼이 존재하는 부모 컴포넌트에서 *Props*를 통해 전달한 데이터를 사용해 `<input>` 태그의 `type`과 `placeholder`를 결정하고,  
마찬가지로 `<svg-icon>` 태그에도 사용할 아이콘의 `path` 정보와 `size` 값을 설정한다.

부모 컴포넌트에서 `<Input v-model="email" />`과 같이 `v-model`을 사용하여 *Props*로 전달된 `value`를  
`<input>` 태그에 `v-bind`를 이용해 단방향 바인딩하고, 사용자의 입력이 발생해 *Input Event*가 발생하면  
`updateValue()` 메서드에 현재 `<input>` 태그의 `value`에 들어있는 값을 전달해 부모 컴포넌트로 `$emit()`한다.

부모 컴포넌트에서는 다음과 같이 커스텀 컴포넌트를 사용한다.

```
<Input
    v-model="email"
    inputType="email"
    placeholder="이메일"
    :iconPath="accountIcon"
    :iconSize="28"
    :errorMsg="emailMsg"
/>
```