# Express Middleware

*Express*를 이용해 서버를 제작할 때, 처음부터 끝까지 모든 기능을 스스로 구현하는 것은 비효율적이며  
따라서 타인 또는 자신이 이전에 제작한 *Middleware*를 사용해 효율적으로 기능를 구현할 수 있다.

- Built-in *Middleware*
    - *Express*에 기본적으로 내장되어 있는 *Middleware*
- Third-party *Middleware*
    - 제 3자가 제작한 *Middleware*
    - `body-parser`, `cookie-parser`, `multer` 등이 존재

Third-party *Middleware*는 굉장히 유용하며, 특히 HTTP POST Request의 `body` 영역에  
손쉽게 접근 및 처리하는 기능을 제공하는 `body-parser`는 Built-in *Middleware*로 변경되기도 하였다.


## Application Methods 

`app.use(path, callback)`는 첫번째 매개변수로 **주어진 문자열 타입의 URL과 일치하는 모든 HTTP Request에 대해 *callback*을 실행**한다.  

첫번째 매개변수 *path*의 기본값은 `/`이므로 생략할 수 있고, 매개변수로 *callback* 함수만 전달하는 것이 가능하다.  
즉, `app.use(callback)`과 같이 작성하면 **도메인의 모든 경로에 전송되는 모든 HTTP Request에 대해 주어진 *callback*을 실행**한다.

여기서, 특정 HTTP Request에만 응답하고 싶다면 `app.use()`를 `app.get()`, `app.post()`, 또는 `app.delete()`와 같이 변경하면 된다.  


## Middleware 사용하기

우선 *Middleware*를 사용하기 위해서는, `npm install --save <Middleware Name>`과 같이 패키지 매니저를 통해  
사용하고자 하는 *Middleware*를 설치하고 `package.json` 파일에서 종속성을 추가해 주어야 한다.

다음으로, `const app = express();`를 통해 생성한 `app` 변수에 `use()` 메서드를 사용해 *Middleware*를 등록한다.  

```
const app = express();

/* Middleware 등록 */
app.use(express.urlencoded());
app.use(express.json());
```

`express.urlencoded()`는 서버측으로 전송되는 데이터의 **Content-Type 중 *application/x-www-form-urlencoded* 형태**를  
Parsing 해주는 *Middleware*이며, 주로 `<form>` 태그에서 직접 `Submit` 하는 데이터가 이러한 형태를 가진다. 

`express.json()`는 서버측으로 전송되는 데이터의 **Content-Type 중 *application/json* 형태**를 Parsing 하며,  
대부분의 *Frontend* 프레임워크 또는 *Mobile* 어플리케이션에서 기본적으로 전송되는 데이터 형태이다. 


## Middleware 제작하기

*Middleware*는 위의 예제에서 확인한 것과 같이 `app.use()`와 같은 메서드에 *callback* 함수로 전달되는데,  
다음과 같이 **일정한 형식으로 작성되어 개발자 스스로 팔요한 *Middleware*를 직접 제작해 사용**할 수도 있다.

```
const customMiddleware = (req, res, next) => {
    console.log('This is a middleware!');
    next();
}
```

여기서 중요한 것은 세번째 매개변수로 전달되는 `next`인데, 이것은 **다음으로 실행될 *Middleware*를 담고 있다.**
즉, *Middleware* 구현의 마지막 부분에서 `next()`를 반드시 호출해 주어야 한다. 

추가적으로, *Middleware*에서 일반적인 *Routing* 처리 과정과 같이 `res.send()`, `res.end()`, 또는 `res.json()`를 사용하면 안된다.  
위와 같은 메서드가 실행되면 Client 측으로 HTTP Response가 전송되고 *Routing* 처리가 최종적으로 종료되기 때문이다.

즉, *Middleware*는 HTTP Reponse를 전송하는 것에 목적을 가지고 있지 않으며,  
최종적으로 전송할 **HTTP Response의 *Header*를 변경**하거나, **`res`에 새로운 *Property*를 추가**하기 위해 사용된다.
