# Access Token과 Refresh Token

## Introduction

얼마전 일반적인 웹 서버에서 사용되는 *Session* 인증 방식과 REST API 서버에서 사용되는 *JWT* 인증방식에 대해 알아보았다.  
특히 *JWT* 인증 방식의 경우, *Express* 프레임워크를 사용해 토큰을 생성하고 검증하는 방법까지  직접 진행해보았다.

*JWT* 인증 방식에서 사용되는 *Token*은 일정한 시간이 지나면 만료되며, 유효기간이 만료된 토큰은 더이상 인증에 사용할 수 없다.  
토큰의 유효기간에 따른 **사용자의 사용편의성**과 **서비스 자체의 보안성**은 아래와 같이 일종의 *Trade Off* 관계에 있다고 할 수 있다.

- 토큰의 유효기간이 짧은 경우,
  - 토큰 또는 사용자 기기가 탈취되어도 빠르게 만료된다. (보안성 개선)
  - 사용자는 토큰이 만료될 때마다 계속 로그인해야 한다. (편의성 저하)

- 토큰의 유효기간이 긴 경우,
  - 사용자가 자주 로그인을 할 필요가 없다. (편의성 개선)
  - 토큰 또는 사용자 기기가 탈취된 경우, 이를 제지할 방법이 없다. (보안성 저하)

보안성과 편의성 두 가지 모두를 잡기위해 많은 대안이 제시되었고, 그 중 하나인 *Refresh Token*을 사용하는 방법에 대해 알아본다. 

## Refresh Token이란?

기존의 *JWT* 인증 방식과 가장 큰 차이점은 **서로 다른 두 개의 토큰을 사용**한다는 것이다.

- Access Token
  - 기존의 방식에서 발급하던 Token으로, 사용자 인증에 사용된다.
  - 서비스의 특성에 따라 상이하지만, 주로 30분 이내의 유효기간을 가진다.

- Refresh Token
  - 추가적으로 발급하는 토큰으로, Access Token을 갱신하는데 사용된다.
  - 마찬가지로 서비스의 특성에 따라 다르지만, 2주에서 4주 정도의 유효기간을 가진다.

사용자가 로그인할 때 Access Token과 Refresh Token을 동시에 발급하게 되며, 사용자는 이러한 토큰을 안전한 곳에 보관한다.  
모바일 기기에서는 *Key Chain*에 안전하게 보관할 수 있으나 브라우저에서는 *LocalStorage*ㄷ 또는 *Cookie*가 최선이다.  
*Cookie*는 *XSS* 공격을 차단할 수 있는 `http-only` 플래그를 사용할 수 있으므로 *LocalStorage*보다는 *Cookie*에 저장하는 것이 낫다.

이렇게 저장된 토큰 중 사용자는 *Access Token*을 사용해 인증을 필요로 하는 서비스에 접근할 수 있고, *Access Token*의 유효기간이 만료되면 *Refresh Token*을 사용해 새로운 *Access Token*을 발급 받아 사용한다.  
만약 사용자가 제출한 *Refresh Token*의 유효기간도 만료된 경우, 오류를 출력하고 로그인 화면으로 강제 라우팅한다.

*Access Token*과 달리 *Refresh Token*을 검증과는 과정은 Token의 마지막 영역인 *Signature*를 검사하는 것으로 끝나지 않는다.  
사용자가 로그인하여 *Refresh Token*을 발급할 때 서버의 데이터베이스에 발급된 *Refresh Token*를 저장하고, 사용자가 *Access Token*을 재발급하기 위해 *Refresh Token*을 제출했을 때 데이터베이스에 존재하는지 여부도 검사해야 한다.

그러므로 데이터베이스에 접근하여 데이터를 색인하는 추가적인 I/O 작업이 발생하는 것인데, 따라서 빠른 인증 처리를 장점으로 가지는 *JWT* 인증 방식의 공식 스펙 상에는 *Refresh Token*이 포함되지 않는다. 

- 장점
  - Access Token의 유효기간을 매우 짧게 지정하여, 탈취되어도 제한된 시간동안만 접근 가능하다.
  - 사용자가 자주 로그인하지 않아도 된다.
  - Refresh Token을 데이터베이스에서 삭제하여 강제로 만료시킬 수 있다.

- 단점
  - 사용자 어플리케이션에서 Access Token 자동 재발급 로직을 구현해야 한다.
  - Refresh Token의 만료기간은 연장할 수 없다.
  - 서버에 별도의 데이터베이스가 필요하다.


## Refresh Token을 발급하는 Express 서버 구현

최종적으로 사용자 어플리케이션에서 *Refresh Token*을 사용해 자동으로 *Access Token*을 갱신하는 로직을 구현하기 위해 *Access Token*과 *Refresh Token*을 생성, 발급 그리고 검증하는 *Express* 서버를 작성한다.

```
const jwt = require('jsonwebtoken');

let refreshTokens = [];

/* Token Generating Util Function */
exports.generateAccessToken = (email, userId) => {
  return jwt.sign(
    {
      email,
      userId
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: '20s' }
  );
} 

/* Token Generating Util Function */
exports.generateRefreshToken = (email, userId) => {
  const refreshToken = jwt.sign(
    {
      email,
      userId
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
  );

  refreshTokens.push(refreshToken);

  return refreshToken;
} 
```

먼저 위와 같이 *Access Token*과 *Refresh Token*을 발급하는 코드를 작성한다.  `dotenv` 패키지를 사용하여 `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`를 별도의 환경변수로 정의하여 버전 관리 대상에 포함되지 않도록 하였다.

정상적으로 작동하는지 손쉽게 확인하기 위해 `{ expiresIn: '20s' }`에서 *Access Token*의 유효기간을 굉장히 짧게 설정하였다. 

추가적으로, 예제에서는 실제 데이터베이스를 사용하지 않고 `let refreshTokens = [];`와 같이 발급된 *Refresh Token*을 저장할 배열을 선언해 사용한다. *Refresh Token*을 발급하는 코드를 확인하면 `refreshTokens.push(refreshToken);`에서 생성된 토큰을 배열에 저장하는 것을 볼 수 있다. 

Router
```
const express = require('express');

const tokenController = require('../controllers/token.js');

const router = express.Router();

router.post('/refresh', tokenController.refreshToken);

module.exports = router;
```

Controller
```
exports.refreshToken = (req, res, next) => {
  const receivedToken = req.body.refreshToken;
  let decodedToken;

  // Refresh Token이 정상적으로 전달되었는지 확인한다.
  if (!receivedToken) {
    const error = new Error('토큰이 존재하지 않습니다.');
    error.statusCode = 401;
    throw error;
  }

  // 전달된 Refresh Token이 데이터베이스(배열)에 존재하는지 확인한다.
  if(!refreshTokens.includes(receivedToken)) {
    const error = new Error('토큰 정보가 유효하지 않습니다.');
    error.statusCode = 403;
    throw error;
  }

  // Refresh Token을 검증한다.
  try {
    decodedToken = jwt.verify(receivedToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    error.statusCode = 403;
    throw error;
  }

  // 새로운 Access Token을 발급한다.
  const accessToken = this.generateAccessToken(decodedToken.email, decodedToken.userId);

  res.json({ accessToken });
}
```

다음으로 사용자가 안전한 곳에 저장한 *Refresh Token*을 이용해 만료된 *Access Token*을 갱신할 수 있는 코드를 작성한다.

가장 먼저 `req.body`에서 사용자가 전달한 *Refresh Token*을 추출하고, 
1. *Refresh Token*이 정상적으로 전달되었는지 확인한다.
2. 사용자가 제출한 *Refresh Token*이 데이터베이스(= 배열)에 존재하는지 확인한다.
3. `jwt.verify()` 메서드를 사용해 *Refresh Token*을 검증한다.

위의 세가지 검증을 통과한 경우, 새로운 *Access Token*을 생성하고 사용자에게 발급해준다.

## Refresh Token을 사용해 Access Token을 자동 갱신하는 Vue.js 어플리케이션 구현

Vue.js는 서버와의 통신 과정에서 `axios` 패키지를 사용할 것을 권고하고 있으며 공식 문서에도 명시되어있다.  
따라서, `axios` 패키지를 사용해 Vue.js 어플리케이션에서 *Refresh Token*을 사용해 *Access Token*을 자동 갱신하는 로직을 구현해본다.

우선 Vue.js 어플리케이션이 구동될 때 가장 먼저 실행되는 자바스크립트 파일인 `main.js`에서 `axios` 패키지를 `import`하고 몇가지 설정을 해준다.

```
import axios from "axios";

axios.defaults.baseURL = "http://localhost:7070/api";

Vue.prototype.$axios = axios;
```

다음으로 `axios` 패키지에서 제공하는 API, `interceptors`를 사용해 위에서 언급한 기능을 구현한다.
`interceptors`를 통해 `then` 또는 `catch`로 처리되기 이전에 *Reqeust*와 *Response*를 가로챈 뒤 원하는 로직을 추가할 수 있다.

```
// HTTP Request 인터셉터
axios.interceptors.request.use(
  function (config) {
    // 요청을 보내기 전에 수행할 일
    // ...
    return config;
  },
  function (error) {
    // 오류 요청을 보내기전 수행할 일
    // ...
    return Promise.reject(error);
  });

// HTTP Response 인터셉터 
axios.interceptors.response.use(
  function (response) {
    // 응답 데이터를 가공
    // ...
    return response;
  },
  function (error) {
    // 오류 응답을 처리
    // ...
    return Promise.reject(error);
  });
```

위의 코드는 `axios` 공식 문서에 제공되고 있는 `interceptor`를 사용하기 위한 기본적인 구조이며, 각각의 `interceptor`는 두 개의 *Callback 함수*를 전달 받는 것을 확인할 수 있다.

[참고] `function (config)`에 전달되는 `config`는 Reqeust Header와 같은 `axios` 설정 정보를 담고 있다. 

이제 기존에 작성하고 있었던 Vue.js 프로젝트에 실제로 코드를 작성한 결과를 첨부한 뒤, 설명이 필요한 부분만 짚고 넘어가겠다.

```
// HTTP Request 인터셉터
axios.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem("accessToken");

    // localStorage에 accessToken이 존재하면, HTTP Request Header에 추가한다.
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    // 오류 요청을 보내기전 수행할 일
    // ...
    return Promise.reject(error);
  }
);
```

*HTTP Request 인터셉터*는 `axios`를 통해 서버로 전송되는 모든 *HTTP Request*를 가로챈다. 위의 코드는 *Local Storage*에 저장되어 있는 *Access Token*을 가져와 서버로 전송되기 직전인 *Request*의 `Authorization Header`에 추가한다. 


```
// HTTP Response 인터셉터
axios.interceptors.response.use(
  response => {
    // 응답 데이터를 가공
    // ...
    return response;
  },
  async error => {
    // Error 객체에 포함된 원본 Request 추출
    const originalRequest = error.config;

    // Status Code 403 (Forbidden), 또는 이미 한 번 처리된 요청이 아닌 경우,
    if (error.response.status === 403 && !originalRequest._retry) {
      // 중복 처리 여부를 판별하기 위한 플래그를 설정한다.
      originalRequest._retry = true;

      // LocalStorage의 Refresh Token으로 새로운 Access Token 발급
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = await axios
        .post("/token/refresh", { refreshToken })
        .then(({ data }) => {
          return data.accessToken;
        })
        .catch(() => {
          alert("로그인 시간이 만료되었습니다. 다시 로그인 해주세요.");
        });

      // LocalStorage의 Access Token 갱신
      localStorage.setItem("accessToken", accessToken);

      // axios Header의 Authorization 항목을 새로운 Access Token으로 갱신
      axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

      // 에러가 발생했던 원본 Request 재전송
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

*HTTP Response 인터셉터*는 서버로부터 오류 응답(*Response*)이 도착하는 경우 `statusCode`를 확인하는데, `statusCode`가 `403(Forbidden)`인 경우 *Access Token*을 재발급하기 위한 로직을 수행한다.

가장 먼저, 서버에서 도착한 오류 응답을 발생시킨 요청(*Request*)의 정보를 `const originalRequest = error.config;`와 같이 임시 변수에 저장한다.

이때, *Refresh Token*이 만료되어 다시 한번 오류 응답이 도착하면 로직을 종료하고 로그인 화면으로 전환하기 위해 `originalRequest._retry = true;`와 같이 **사용자 정의 속성을 *Request*에 추가**한다. 

다음으로 *LocalStorage*에 보관되어 있는 *Refresh Token*을 가져와 서버에 *Access Token* 재발급을 위한 API Endpoint로 요청을 전송한다. 성공적으로 처리되면 `accessToken` 변수에 갱신된 *Access Token*이 저장되고, 그렇지 않은 경우 `catch`로 처리되어 로그인 시간이 만료되었다는 것을 사용자에게 알린다.

*Access Token*이 정상적으로 갱신되었다면 이것을 다시 *LocalStorage*에 저장하고 `axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;`와 같이 새로운 *Access Token* 값으로 `Authorizaion Header`를 갱신한다.

마지막으로 `return axios(originalRequest);`를 통해 임시 변수 `originalRequest`에 저장해 놓았던 원본 요청을 서버로 재전송한다.