# `v-for`를 통한 객체 순회


## `v-for` 기본 정리 

Vue.js에서는 *Array*, *Object* 형태의 반복적인 데이터를 손쉽게 렌더링할 수 있도록 `v-for` 디렉티브를 지원한다.  
일반 프로그래밍 언어에서의 *For*와 거의 똑같은 기능을 수행하지만, 반복문 수행 도중에 `break`할 수 없다는 차이가 있다.

간단한 `v-for` 디렉티브를 사용해 배열과 객체를 렌더링하는 예제는 다음과 같다.

- **배열**

  HTML
  ```
  <div v-for="(item, index) in array" :key="Unique Value">
    {{ index }} : {{ item.message }}  
  </div>
  ```

  JS
  ```
  array: [
    { message: 'Foo' },
    { message: 'Bar' }
  ]
  ```

  Result
  ```
  0 : Foo
  1 : Bar
  ```

- **객체**

  HTML
  ```
  <div v-for="(value, key, index) in obejct" :key="Unique Value">
    {{ index }} : {{ key }} : {{ value }}
  </div>
  ```

  JS
  ```
  obejct: {
    lastName: "Yang",
    firstName: "Junyoung"
  }
  ```

  Result
  ```
  0 : lastName : Yang
  1 : firstName : Junyoung
  ```

## `v-for` 배열 필터링

*Array* 형태의 데이터 중 특정 조건에 해당하는 일부 원소만 `v-for` 디렉티브를 사용해 렌더링 하려고 할 때,  
Vue.js의 `computed` 속성과 자바스크립트 내장함수 `filter()`, `slice()`, `map()` 등을 이용해 데이터를 전처리 해야한다.

예를 들어 `[1, 2, 3, 4, 5]`와 같은 배열에서 짝수만 렌더링하고자 할 때, `v-for` 내부에서는 반복문을 중지할 수 없으므로  
`computed` 속성에 짝수 원소를 필터링해 반환하는 함수를 선언하고, 그 결과로 얻은 배열을 `v-for`에 사용해야 한다.

HTML
```
<div v-for="item in evenNumbers">
  {{ item }}
</div>
```

JS
```
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  // 'this'에 접근해야 하므로, 화살표 함수 사용 X
  evenNumbers() {
    return this.numbers.filter(number => {
      return number % 2 === 0
    })
  }
}
```

Result
```
2
4
```

## `v-for` 객체 필터링

객체의 경우 위의 배열처럼 데이터 전처리가 불가능하지만, Vue.js 개발 과정에서 종종 객체의 일부 프로퍼티만 렌더링 해야 하는 경우가 있다.  
이런 경우, 실제 DOM으로 렌더링 되지 않는 `<template>` 래퍼 엘리먼트를 사용해 조건부 렌더링을 구현할 수 있다.  

현재 회사에서 진행하고 있는 프로젝트에서도 백엔드 서버에서 날아오는 JSON 데이터를 파싱해 화면에 뿌려줘야 하는데,  
한 개 또는 두 개의 프로퍼티를 제외한 나머지 프로퍼티를 `v-for`를 사용해 렌더링해야 하는 상황이 자주 있었다.

자세한 사용법은 아래의 예시 코드로 대체한다.


Javscript Object
```
singleDeviceInfo: {
  cameraCode: "AJ378ZJ",  // 제외할 프로퍼티
  eventName: "과천 3단지 유지보수",
  installationDate: timeParser(new Date()),
  recentUpdate: timeParser(new Date()),
  signalStrength: -38,
  batteryStatus: 75,
},
```

HTML
```
<template v-for="(value, key, index) in deviceDetail">
  <div
    class="modal-content-detail"
    v-if="key !== 'cameraCode'"
    :key="key"
  >
    <div class="modal-content-detail-title">
      {{ headers[index] }}
    </div>
    <div style="flex: 1;">{{ value }}</div>
  </div>
</template>
```

위와 같이 실제로 렌더링되지 않는 래퍼 엘리먼트인 `<template>`에 `v-for` 디렉티브를 사용하지 않고  
실제로 렌더링되는 `<div>`와 같은 태그를 사용하면 아무런 데이터가 포함되지 않은 `<div>` 요소가 렌더링되게 된다.  

그다지 큰 문제가 되지 않을 수도 있지만, 쓸데 없는 태그를 추가한다는 점에서 그다지 좋아보이지는 않는다.