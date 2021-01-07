# Spread Operator

`const updatedCart = { items: [{ ...product, qauntity: 1 }] };`에서 사용된 ES6 문법 중 하나인  
*Spread Operator*는 배열 또는 문자열과 같은 *Iterable*을 분해해서 개별요소로 만들어준다.  

위의 코드에서 `product`가 `['itemA', 'itemB', 'itemC']`와 같은 내용의 배열이었다면,  
`...product`는 배열의 요소를 분해하여 `'itemA', 'itemB', 'itemC'`를 반환한다.

```
const product = ['itemA', 'itemB', 'itemC'];

console.log(...product);  // 'itemA', 'itemB', 'itemC'
```

추가적으로 ES9에서 자바스크립트 객체에도 이러한 *Spread Operator*를 사용할 수 있게 되었는데, 주요기능은 다음과 같다.

- 객체 복사
    ```
    const product = { name: 'Cheese', price: '30' };

    console.log({ ...product });  
    // { name: 'Cheese', price: '30' }
    ```

- 객체 병합
    ```
    const objA = { name: 'Cheese', price: '30' };
    const objB = { quantity: 1 };

    console.log({ ...objA, ...objB });  
    // { name: 'Cheese', price: '30', quantity: 1 }
    ```

- 객체 속성 추가 및 수정
    ```
    const product = { name: 'Cheese', price: '30' };

    console.log({...product, quantity: 1 });  
    // { name: 'Cheese', price: '30', quantity: 1 }
    ```