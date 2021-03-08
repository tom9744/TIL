# JWT


## Session 

기존의 *Session*을 사용한 인증 방식은, 사용자가 인증 정보(Credentials)를 서버에 전달하면  
서버 측에서 사용자를 구분하기 위해 *Session ID*를 부여하고, 브라우저가 종료되는 시점까지 인증상태를 유지한다.  

사용자에 대한 정보를 사용자 측의 *Cookie*에 저장하지 않고 어느정도 보안된 서버에 보관하기 때문에  
보안적 측면에서 유리하지만, 사용자가 많아질 수록 서버 메모리를 과도하게 차지하는 문제가 있다.

간략하게 동작 방식을 간추리면, 다음과 같다.

1. 사용자가 서버에 접속하면 *Session ID* 발급
2. 사용자는 해당 *Session ID*를 *Cookie*에 저장하여 보관
3. 사용자가 서버에 *Request*를 전달할 때, 이러한 *Session ID*를 함께 전달
4. 서버는 전달 받은 *Session ID*로 사용자에 대한 정보를 확인
5. 사용자 정보를 기반으로 *Request*를 처리하고, *Resopnse* 전달


## In Rest API World

상태가 존재하지 않는, 즉 *Stateless*한 *REST API* 서버에서는 위와 같은 *Session* 인증을 사용할 수 없다.  
*REST API* 서버는 사용자로부터 완전히 분리되어야 하며, 단일 *Request*는 독립적으로 처리되도록 권고하고 있기 때문이다.

서버는 더 이상 사용자에 대한 정보를 저장하지 않으며, 따라서 사용자가 누구인지 확인할 수 없다.  
따라서, *REST API* 서버로 전송되는 모든 *Request*는 인증에 필요한 정보(Credentials)를 포함하고 있어야 한다.  

아직 표준으로 정해진 것은 아니지만, 이러한 *REST API* 서버에서의 인증에 *JSON Web Token (JWT)*가 많이 사용된다.  
*JWT*는 서버 측에서 생성되어 사용자 측으로 전달되며, **사용자는 모든 *Request*에 *JWT*를 포함해 서버에게 전달**하게 된다.  

*JWT* 인증의 동작 방식은 다음과 같다.

1. 사용자가 서버에게 인증 정보(Credentials)를 전달
2. 서버는 전달 받은 인증 정보를 확인하고, 등록된 사용자인 경우 *JWT* 생성 및 발급
3. 사용자는 *JWT*를 **안전한 곳**에 보관 (LocalStorage or Cookie)
4. 사용자가 서버에 *Reqeust*를 전달할 때, 이러한 *JWT*를 *Header*에 포함해 전달
5. 서버는 전달 받은 *JWT*의 조작 여부를 검사하고, *Request*를 처리


## More about JWT

*JWT, JSON Web Token*은 그 이름에서 알 수 있듯, JSON 형식의 데이터와 *Signature*로 구성되어 있다.  
*Signature*는 서버에 저장된 *Secret Key*를 이용해 생성되기 때문에, 사용자 측에서 임의로 조작하여 사용할 수 없다.

*JWT*는 `Header.Payload.Signature`과 같은 구조를 가지고 있다.

- Header
    - *JWT*를 검증하기 위해 필요한 정보
    - `{ "alg": "HS256", "typ": "JWT" }`
    - *alg*는 서명에 사용하는 알고리즘, *typ*은 토큰의 종류
    - JSON 형식의 데이터를 *Base64Url Encoding*
- Payload
    - *Entity*에 대한 명세 및 추가적 정보, *Claims*
    - 세가지 종류의 *Claims* - Registered, Public, Private
    - `{ "iss": "Junyoung", "sub": "Express", "aud": "Anyone" }`
    - *iss*, *sub*, *aud*와 같이 사전에 정의된 *Claims* 이외에도 *Custom CLaims* 사용 가능
    - JSON 형식의 데이터를 *Base64Url Encoding*
- Signature
    - *Base64Url encoding*이 적용된 *Header*와 *Payload*를 *Secret Key*를 이용해 서명한 값
    - 서명 과정에서 *Header*에서 명시한 알고리즘 사용
    - `HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`
    - 마찬가지로 *Base64Url Encoding* 적용

[중요] 
*JWT*는 *Signature*를 통해 검증을 진행하기 때문에, 내용이 임의로 변조되는 것은 막을 수 있지만  
단순히 **Base64Url Encoded 되어있어 누구나 복호화하여 내용을 확인할 수 있으므로, 민감한 정보를 포함해서는 안된다.**

## How to use JWT

```
npm install --save jsonwebtoken
```

Node.js 라이브러리 *jsonwebtoken*을 사용하면, 위의 *JWt* 생성 과정을 간단하게 수행할 수 있다.  


```
const jwt = require('jsonwebtoken');

...생략...

// Create new JSON Web Token
const token = jwt.sign({
    email,
    userId,
    ...
}, '<Secret Key>', { expiresIn: '1h' });

// Send Reponse
res.status(200).json({ token: token });
```

단순히 `jwt.sign()` 메서드를 호출하는 것으로, *JSON Web Token*을 생성할 수 있다.  
첫번째 매개변수로 *Payload*에 포함될 정보를 정의하고, 두번째 매개변수로 문자열 타입의 *Secret Key*를 전달한 뒤,  
마지막으로 *JWT*와 관련된 설정을 추가하면 된다. 위의 코드는 ***Token*의 유효시간을 한시간으로 설정**하고 있다.  

*JWT*를 사용할 때, ***Token*의 유효시간과 사용자의 편의성이라는 두 가치 사이에서 *Trade-Off*를 적절히 조절**해야 한다.
유효시간을 길게 설정하면 사용자의 입장에서는 번거로운 로그인 과정을 반복하지 않아 편리하지만, 보안적 측면에서 취약해진다.  



## Using & Validating JWT


#### Client Side

서버에서 전달 받은 *JWT*를 사용자 측에서는 *Reqeust Header*에 포함해 다시 서버로 전송해야 하는데,  
주로 사용자 인증 정보를 포함하는 *Authorizaion Header*를 사용하며 `Authorization: 'Bearer ' + <Token>`와 같이 사용한다.

`Bearer`는 토큰의 유형을 식별하기 위한 일종의 관례 중 하나이며, *JSON Web Token*을 포함한다는 것을 서버에 알려준다.
필수적으로 포함해야 하는 것은 아니지만, 되도록 `Bearer`를 포함해 사용하는 것이 권장된다.  


#### Server Side

서버 측에서는 사용자가 전송한 *JWT*가 변조되지는 않았는지, 또는 만료되지는 않았는지 검증하는 과정이 필요하다.  
다음과 같은 *JWT Validation Middleware*를 별도로 작성해 사용하면 굉장히 편리하다.    

```
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const token = req.get('Authorization').split(' ')[1];  // Parse Token
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, '<Same Sceret Key>') 
    } catch (error) {
        // When failed to decode JWT
        error.statusCode = 500;
        throw error;
    }

    // When failed to verify JWT
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    // req.<Any Property> = decodedToken.<Payload Property>;
    req.userId = decodedToken.userId;

    next();
}
```

위에서 작성한 *Middleware*를 적용하려면 *JWT Validation*이 필요한 위치에서 `require('<Module Name>')`로 불러온 뒤  
**각 *Router*에 대해 두번째 매개변수로 *Middleware*를 전달**하면 된다. 하나 이상의 *Middleware*를 사용하는 경우, 가장 첫번째로 전달하여  
*JWT Validation*이 정상적으로 이루어지지 않으면 나머지 *Middleware*를 실행하지 않도록 하는 것이 좋다.

```
router.get('/post', <JWT Validation Middleware>, postController.createPost);
```


