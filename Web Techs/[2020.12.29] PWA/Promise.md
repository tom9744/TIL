# Promise


## Callback

Javascript는 **단일 스레드에서 작동**하며, 여러개의 작업을 동시에 처리 할 수 없다.  
따라서 작업이 즉시 완료되지 않는 `fetch, setTimeout`과 같은 *비동기 작업*을 처리하기 위해  
**작업이 종료되어 어떠한 값이 반환되는 것을 기다리지 않고 다음 함수를 바로 실행**시킨다.  

이렇게 실행은 했지만 아직 결과를 받지 못한 함수들에 대해 ***Callback* 함수를 사용**하여   
**미래의 어느 시점에 작업의 실행결과가 도착하면 처리**하도록 하는 방식으로 여러개의 작업을 처리한다.

예시
```
setTimeout(() => {
    console.log('Callback');  // A
}, 3000);

console.log('Hi, there!')  // B
```

위의 코드에서, `setTimeout()` 함수의 첫번째 매개변수로 전달된 것이 *Callback* 함수이다.  

Javascript 실행 시 `setTimeout()`을 실행하지만, 3000ms 동안 작업이 완료되는 것을 기다리지 않고  
즉시 다음에 있는 `console.log('Hi, there!')`를 수행한다.

하지만, 다수의 비동기 작업을 처리하는 상황에서 흔히 발생하는  **Callback Hell**로 알려진 문제점으로 인해,  
*Callback* 함수를 대신하기 위한 *Promise*가 새롭게 등장하게 되었다.


## Promise

*Promise*를 사용하려면 아래의 코드처럼 *생성자*를 사용해 ***Promise Class*의 객체**를 만들어 주어야 한다.  

```
let promise = new Promise((resolve, reject) => {
    setTimeot(() => {
        resolve('setTimeout is triggered!');
    }, 3000);
});
```

*Promise Class*의 *생성자* `Promise()`는 즉시 실행되는 함수를 매개변수로 받으며,  
이 함수는 또 다시 `resolve`와 `reject`라는 두 개의 매개변수를 받는다. 

기존의 *Callback*과 다르게 ***Promise*는 작업 수행의 성공/실패 여부에 따라 두 가지의 결과를 반환**할 수 있다.  
하지만, 위와 같이 직접 *Promise*를 작성해 사용하는 일은 굉장히 드물고, 대부분의 경우 서비스 구현과정에서  
필요에 의해 **사용하려는 API에서 반환하는 *Promise*를 다루기 위해** 사용된다.


## then() vs. catch()

다음으로, 이렇게 작성한 Promise 객체가 가지고 있는 `then()` 또는 `catch()` 메서드를 사용해  
작업 처리의 종료되고 그 결과가 도착할 때 수행할 로직을 작성해야 한다.

- `then()`
    - *Promise*에서 `resolve()` 메서드가 호출되면 실행된다.
    - `resolve()` 메서드에 전달된 매개변수를 받아, 별도의 로직을 수행한다.
- `catch()`
    - *Promise*에서 `reject()` 메서드가 호출되면 실행된다.
    - `reject()` 메서드에 전달된 매개변수를 받아, 별도의 로직을 수행한다.


#### then()

```
let promise = new Promise((resolve, reject) => {
    setTimeot(() => {
        resolve('setTimeout is triggered!');
    }, 3000);
});

promise.then((message) => {
    console.log(message);
})
```

*Callback* 대신 *Promise*를 사용하는 경우, 서로 연결된 다수의 비동기 작업에 대한 코드를 다음과 같이 작성하여     
**Callback Hell 문제가 발생하는 것을 차단**할 수 있고, 동시에 보다 더 **가시성있는 코드**가 된다.

```
promise
    .then((message) => {
        return message;
    })
    .then((newMessage) => {
        return newMessage;
    })
    .then((newerMessage) => {
        return newerMessage;
    })  
    .then((newestMessage) => {
        console.log(newestMessage);
    });
```

`then()` 메서드의 두번째 매개변수로 함수를 전달하면, `reject()`가 호출되어 전달되는 메세지를 처리할 수 있다.

#### catch()

*Promise*에서 특정 조건에 따라 `reject()`가 호출되는 경우, 다음의 두가지 방법을 통해 처리할 수 있다.

- `then()` 메서드의 두번째 매개변수에 함수를 전달한다.
- `catch()` 메서드를 사용해 처리한다. **(추천)**

```
let promise = new Promise((resolve, reject) => {
    setTimeot(() => {
        reject({
            code: 500,
            errMsg: 'An Error Occured!'
        });
    }, 3000);
});

promise
    .then(
        (message) => { console.log(message); },
        (error) => { console.log(error.code, error.errMsg); },
    );

promise
    .then((message) => { 
        console.log(message); 
    })
    .catch((error) => {
        console.log(error.code, error.errMsg); 
    });
```

`then()` 메서드의 두번째 매개변수로 함수를 전달하는 방법 대신 `catch()` 메서드를 사용하는 이유는  
가독성이 개선된다는 장점도 있지만 ***Promise Chain*에서 발생하는 모든 `reject()`를 처리**할 수 있기 때문이다.

`then()` 메서드에 `reject()` 처리와 관련된 함수를 전달하는 경우, 해당 *Promise*에서 호출하는 `reject()`만 처리하는 반면,  
연결되어 있는 다수의 *Promise*에서 호출하는 모든 `reject()`를 `catch()` 메서드 하나만으로 처리할 수 있는 것이다.

**[참고]** `catch()` 메서드가 `reject()`를 처리하면, 해당 *Promise* 이후의 `then()` 메서드는 모두 무시된다.


## Handling Promises

Javascript 라이브러리 함수들의 대부분은 *Promise*를 반환하는 비동기(asyncronous) 함수이다.
예를 들어, *Promise* 기반의 *Axios* 라이브러리의 `get()`, `post()`, `patch()`, `put()` 메서드는 모두 *Promise*를 반환한다.

이렇게 *Promise*를 반환하는 함수를 사용할 때, 단순히 함수를 호출하는 문장 뒷부분에 `then()`과 `catch()`를 추가하면 된다.

```
axios.get('http://www.example.com')
    .then((response) => {
        // Success
    })
    .catch((error) => {
        // Fail
    });
```

