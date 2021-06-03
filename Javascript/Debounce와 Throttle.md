# 디바운스와 스로틀

`scroll`, `resize`, `input`, `mousemove`와 같은 이벤트는 짧은 시간 간격으로 연속해서 발생한다. 이러한 이벤트에 바인딩한 **이벤트 핸들러는 과도하게 호출되어, 성능에 문제**를 일으킬 수도 있다.

따라서, 잠재적인 성능 문제를 해결하기 위해 디바운스 또는 스로틀을 적용하여 **짧은 시간동안 연속적으로 발생한 이벤트를 그룹화하여 처리**하는 것이 필요하다.

## 디바운스

```javascript
const $input = document.querySelector("input");

const debounce = (callback, delay) => {
  let timerId;  // 자유변수

  // Closure
  return event => {
    // 이미 타이머가 작동 중인 경우, 타이머를 해제한다.
    if (timerId) clearTimeout(timerId);
    
    // 새로운 타이머를 설정한다. (세번재 인수는 콜백 함수에 인수로 전달된다.)
    timerId = setTimeout(callback, delay, event);
  };
};

// 클로저를 반환한다.
$input.oninput = debounce(event => {
  // Event Handling...
}, 300);
```

디바운스는 짧은 간격으로 연속되어 발생한 모든 이벤트를 단 하나의 그룹으로 처리하여, **마지막에 단 한번만 이벤트 핸들러를 호출**한다.

비용이 큰 AJAX 요청을 수행해야 하는 이벤트 핸들러에 디바운스를 적용하면 효과적으로 서버의 부하를 낮출 수 있다.

## 스로틀

```javascript
const $wrapper = document.querySelector(".wrapper");

const throttle = (callback, delay) => {
  let timerId;  // 자유변수

  // Closure
  return event => {
    // 이미 타이머가 작동 중인 경우, 무시한다.
    if (timerId) return;

    // 새로운 타이머를 설정하고, 콜백 함수 실행 시 timerId를 초기화한다.
    timerId = setTimeout(() => {
      callback(event);
      timerId = null;
    }, delay, event);
  };
};

$wrapper.addEventListener("scroll", throttle(() => {
  // Event Handler...
}, 200));
```

스로틀은 **이벤트 핸들러의 호출 횟수에 제한을 거는 것**으로, 주로 성능 문제를 개선하기 위해 사용된다.

특히, `scroll` 이벤트의 경우 연속적으로 호출되는 속도가 굉장히 빠르기 때문에, **브라우저가 버벅이거나 멈춰버리는 현상을 유발**할 수 있다.

이처럼 굉장히 빠른 속도로 발생하는 이벤트에 제한을 걸어, 이벤트 핸들러가 과도하게 호출되는 것을 방지하는 것이 스로틀이다.