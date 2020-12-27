# CSS Transform

*CSS Transform*은 **CSS3**에서 처음 등장하였고,  
'변형'과 관련되어 있는 CSS 속성으로서 대표적으로 다음과 같은 기능을 제공한다.   

- 크기 변경 (Scale)
- 회전 (Rotate)
- 위치 이동 (Translate) 
- 비틀기 (Skew)

기존에도 `position: absolute;`를 지정하고 `top, left` 또는 `width, height`값을 바꾸는 방법으로  
대상의 위치를 이동하거나 크기를 변경하는 것은 가능했지만, ***CSS Transform*는 훨씬 다양한 기능**을 포함한다.  

또한, `top, left` 또는 `width, height`값을 변경하는 방법은 변형의 **기준점이 왼쪽 상단**이지만  
*CSS Transform*이 제공하는 변형의 **기준점은 정중앙**으로 기본값이 지정되어 있으며,  
`transform-origin: left top;`과 같이 기준점을 변경하여 사용할 수도 있다. 

추가적으로 *CSS Transform*는 **하드웨어 가속**, 즉 GPU를 사용하므로 성능이 굉장히 좋다.  
예를 들어, 모바일 환경에서 `top, left` 또는 `width, height`값을 직접 조정해 수평 이동을 구현하는 것에 비해  
*CSS Transform*의 `transition`을 사용하면 굉장한 성능의 차이를 보여준다.

**Example CSS Code**
```
.box:hover{
    /* 다수의 Transform을 동시에 적용할 수 있다. */
    transform: scale(1.5) rotate(45deg);
}
```

```
.box:hover{
    /* translateX, translateY를 사용해 하나의 축만 변경할 수도 있다. */
    transform: translate(30px, 10px);
}
```