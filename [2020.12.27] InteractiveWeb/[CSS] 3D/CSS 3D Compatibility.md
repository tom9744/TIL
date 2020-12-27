# CSS 3D Compatibility

앞에서 작성한 *3D 카드 뒤집기* 예제는 Chrome에서 정상 작동하지만,  
Safari, IE와 같은 다른 브라우저에서는 정상적으로 작동하지 않는다.

## Verdor Prefix
 
`backface-visibility`와 같이 비교적 새로운 - 아직 표준으로 등록되지 않은 - 속성의 경우,  
각 브라우저 개발사들이 이러한 속성을 사용할 때 특정한 접두어(Prefix)를 사용하도록 정해 놓았다.

- `-webkit-` : Safari, Chrome
- `-moz-` : Mozilla
- `-ms-` : IE
- `-o-` : Opera

*Vendor-Prefix*가 붙은 속성을 사용하는 경우, *Vendor-Prefix*가 붙지 않은 **표준 속성**을 마지막에 추가하여  
해당 속성을 표준 속성으로 지원하는 브라우저에서는 표준 속성을 사용할 수 있도록 해야한다.  
이때, **표준 속성**을 가장 앞에 위치시키면 **그 밑의 속성이 이를 덮어쓰기 때문에 표준 속성이 정상적으로 적용되지 않는다.**

## Safari

Safari에서 대부분의 기능이 정상적으로 작동하며 `backface-visibility` 속성도 지원하기는 하지만,
속성 이름에 *Vendor Prefix*를 추가해 `-webkit-backface-visibility`와 같이 사용해야 한다.

이때, 단순히 `backface-visibility`를 `-webkit-backface-visibility`로 변경하기 보다  
다음과 같이 두 가지 모두를 병행하여 적용하는 것이 좋다.

```
.card-side {
    -webkit-backface-visibility: hidden;    /* Webkit 속성 */
    backface-visibility: hidden;    /* 표준 속성 */
}
```

```
.card-side {
    backface-visibility: hidden;    /* 표준 속성 */
    -webkit-backface-visibility: hidden;    /* Webkit 속성이 표준 속성을 덮어쓴다 */
}
```

## Internet Explorer

Internet Explorer는 자식의 자식 요소까지 `perspective: 500px;` 속성이 적용되도록 해주는  
`transform-style: preserve-3d;` 속성을 지원하지 않는다.

기존에는 카드의 앞, 뒷면을 감싸고 있는 Container를 회전시키는 방법으로 두개의 면을 회전 시켰지만,  
`transform-style: preserve-3d;` 속성이 지원되지 않으므로 Container를 제거하고 두개의 면을 각각 회전시켜야 한다.

이때 주의해야 할 점은, 앞면과 뒷면이 회전하는 방향이 다르다는 것이다.

- 앞면은 0도에서 180도로 회전한다.
- 뒷면은 **180도에서 360도**로 회전한다.

```
<div class="container">
    <div class="card-side card-side-front">Front</div>
    <div class="card-side card-side-back">Back</div>
</div>
```

```
.card-side-ie {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    /* 가운데 정렬 */
    left: 50%;
    top: 50%;
    margin: -90px 0 0 -60px;  

    width: 120px;
    height: 180px;

    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 1.2rem;

    border-radius: 0.5em;

    backface-visibility: hidden;

    transition: 1s;
}
```

```
/* 앞, 뒷면에 별개의 Transform 적용 */
.world:hover .card-side-front {
    transform: rotateY(180deg);
}
.world:hover .card-side-back {
    transform: rotateY(360deg);
}
```