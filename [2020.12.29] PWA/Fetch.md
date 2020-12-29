# Fetch

`fetch()`는 Javascript에서 기본으로 제공하는 API로, HTTP Request를 전송할 수 있도록 해준다.  

```
fetch('http://www.htmlbin.org/ip')
    .then((response) => {
        console.log(reponse);
    })
    .catch((error) => {
        console.log(error);
    });
```

하지만 **Axios**를 사용하는 경우와 달리, **Fetch API**를 사용하려면 추가적으로 수행해야 하는 작업이 존재한다.
그것은 바로 ```response.json();``` 함수를 사용해 *Resopnse Body*에 담긴 **Stream**을 **JSON** 형태로 바꾸는 것이다.

`fetch()` 메서드가 반환한 *Promise*에 최종적으로 도착하는 *Response*의 *Body*의 데이터는 완전히 받아진 것이 아니다.
따라서 **Fetch API**가 제공하는 `json()` 메서드를 사용해 완전한 데이터를 받아오게 되는데, `json()` 역시 *Promise*를 반환한다.
(**Axios**의 경우, 이러한 작업을 Background에서 자동으로 수행해 최종적인 데이터를 전달하는 것이다.)

자세한 내용은 **Fetch API**를 사용해 *Web Server*에서 데이터를 받아오는 아래의 예시 코드를 통해 확인하도록 한다. 

```
// HTTP GET Reqeust
fetch('http://www.httpbin.org/ip')
    .then((response) => {
        return response.json();  // Promise 반환
    })
    .then((json) => {
        console.log(json);  // IP 주소 출력
    })
    .catch((error) => {
        console.log(error);
    });
```

## HTTP POST Request


`fetch()` 메서드의 **두번째 매개변수로 JSON을 전달**할 수 있으며, 여기서 HTTP Reqeust에 대한  
다양한 설정을 정의하고 `fetch()` 메서드에 반영할 수 있다. 몇가지 중요한 설정은 다음과 같다.

- method
    - **문자열**을 이용해 HTTP Request의 종류를 정의한다.
    - 'GET', 'POST', 'PUT', ...
- headers
    - **JSON**을 이용해 HTTP Request의 Header에 포함될 정보를 정의한다.
    - { 'Content-Type': 'application/json' } : HTTP Request를 통해 JSON Format의 데이터 전달
    - { 'Accept': 'application.json' } : HTTP Response에 JSON Format의 데이터 요구
- body
    - **JSON**을 이용해 HTTP POST Request로 전달하려는 데이터를 정의한다.
    - { message: 'Does this work?' }


```
// HTTP POST Reqeust
fetch('http://www.httpbin.org/post', {
    method: 'POST',
    headers: {     
        'Content-Type': 'application/json'           
        'Accept': 'application.json'
    },
    body: {
        message: 'Does this work?'
    }
})
    .then((response) => {
        return response.json();  // Promise 반환
    })
    .then((json) => {
        console.log(json);  // IP 주소 출력
    })
    .catch((error) => {
        console.log(error);
    });
```

위의 코드에는 간과하기 쉬운 문제가 포함되어 있는데, 그것은 바로 `body: { message: 'Does this work?' }`에서  
서버로 전달하는 데이터는 서버가 기대하고 있는 **JSON** 형태가 아닌 **Javascript Object** 형태의 데이터라는 것이다. 

- { message: 'This is Ordinary Javascript Object' }
- { "message": "This is JSON" }

따라서, 정상적으로 **JSON** 형태의 데이터를 서버로 전송하기 위해서는 `JSON.stringify()` 메서드를 사용해
`body: JSON.stringify({ message: 'Does this work?' })`와 같이 **Javscript Object를 JSON으로 변환**해 주어야 한다.


## CORS (Cross-Origin Resource Sharing)

`GET`, `POST`, `PUT` 등의 모든 HTTP Request를 전송하기 위해 `fetch()` 메서드를 사용할 때,  
두번째 매개변수로 HTTP Request와 관련된 설정을 정의할 수 있다고 하였다. 

정의할 수 있는 다양한 설정 중 `mode`에 대해 알아볼텐데, 기본값은 `cors`로 설정되어 있다.  
이것은 HTTP **Response** Header에 ***CORS Header*를 반드시 포함**해야 한다는 설정이다.

HTTP Response Header의 *CORS Header*란, 다음 속성들을 의미한다.
- Acesss-Control-Allow-Credentials
- Access-Control-Allow-Origin
    - HTTP **Response에 접근할 수 있도록 허가된 도메인의 URL**의 목록이다.
    - 목록에 포함된 URL만 Response Body에 접근해 데이터를 조회할 수 있다.
    - Server에 의해 설정되는 값이며, 임의로 수정할 수 없다.

Access-Control-Allow-Origin에 등록되지 않은 URL에서 HTTP Request를 전송하는 경우,  
CORS Error가 발생하며 정상적으로 Response를 전달 받을 수 없다.

`mode: 'no-cors'`로 설정하면 Access-Control-Allow-Origin에 등록되지 않은 URL이라도  
Reponse를 전달 받을 수는 있지만, Body에 포함되어 있는 내용은 확인할 수 없다.


## Fetch vs. Ajax

기존의 Ajax 방식으로 `GET` Request를 전송하는 코드는 아래와 같다.

```
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://httpbin.org/ip'); // Connection Open
xhr.reponseType = 'json';  // Set the expected response type

xhr.onload = function() {
    console.log(xhr.response);  // Response EventHandler 
}

xhr.onerror = function() {
    console.log('Error!');  // Error EventHandler
}

xhr.send()  // Send a request
```

`fetch()`를 사용하는 방법과 비교했을 때, 굉장히 코드의 길이가 길다는 것을 한눈에 확인할 수 있다.
하지만 가장 중요한 것은, *Fetch API*와 *AJAX*의 **작동 방식에 차이가 존재**한다는 것이다.

*AJAX* 방식에서 사용된 XMLHttpRequest의 인스턴스 내부에는 **동기적으로 작동하는 함수**가 포함되어 있으며,  
이로 인해 **비동기적 처리를 목적**으로 하는 *Service Worker*에서 *AJAX* 방식을 사용할 수 없다.

**따라서, *Service Worker*를 구현할 때 반드시 *Fetch API*를 사용해야 한다.**

**[참고]** Javascript 파일에서 호출되는 `fetch()` 메서드도 *Service Worker*의 *Fetch EventListener*를 활성시킨다.