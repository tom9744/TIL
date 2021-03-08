# CSS Transition

`transition` 속성은 CSS로 Animation을 구현할 수 있도록 하는 속성이다.

```
.box:hover{
    transform: scale(1.5) rotate(45deg);
}
```

Animation이란, 위와 같이 `transform` 속성만 사용하는 경우 도형 또는 객체가  
시작 상태에서 종료 상태로 변형될 때 **부드럽게 변형되는 것처럼 보이게 하는 것**이다.

```
.box{
    /* 생략 */
    transition: 1s;
}
.box:hover{
    transform: scale(1.5) rotate(45deg);
}
```

`transition` 속성은 다음과 같은 하위 속성을 가지고 있다.

- `transition-property` - 적용 대상
- `transition-duration` - 재생 시간
- `transition-timing-function` - 가속도
- `transition-delay` - 지연 시간

Animation을 적용할 대상을 지정하는 `transition-property` 속성의 기본값은 `all`이며,  
따라서 `transform`에만 적용되는 것은 아니다. 즉, `transition` 속성이 추가되어 있는 HTML 태그의  
***숫자로 된 속성***이 변경되는 모든 경우에 대해 적용되는 것이다.

```
.box{
    /* 생략 */
    width: 100px;
    backgroud: rgba(255, 255, 0, 0.7);
    transition: 1s;
}
.box:hover{
    /* 아래의 모든 속성에 대해 transition 적용 가능 */
    width: 200px;  
    backgroud: rgba(255, 0, 0, 0.7);
}
```

여기서 ***숫자로 된 속성***에만 `transition`이 적용될 수 있다는 것을 꼭 기억해야 한다.
다음과 같이 `width: auto;`로 설정되어 있으면, 숫자가 아니므로 `transition` 속성이 적용되지 않는다.

```
.box{
    /* 생략 */
    width: auto;
    transition: 1s;
}
.box:hover{
    /* transition 적용 불가능 */
    width: 200px;  
}
```
