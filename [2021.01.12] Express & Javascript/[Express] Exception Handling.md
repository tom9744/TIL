# Express에서의 오류 처리

*Express*에서 Model에 접근하고 조작하는 *Controller*를 구현하는 과정에서 발생하는 예외의 처리 방법에 대해 알아본다. 

## Middleware Review

우선 *Express*는 최소한의 기능을 수행하는 라우팅 및 미틀웨어로 구성된 웹 프레임워크이며, *Express* 어플리케이션은 일련의 미들웨어 호출이다.

**미들웨어** 함수는 요청(Request) 객체, 응답(Response) 객체, 그리고 어플리케이션의 요청-응답 주기 중 그 다음의 미들웨어 함수에 대한 액세스 권한을 갖는 함수이다. 그 다음의 미들웨어를 호출하는 함수는 특별히 정해진 이름은 존재하지 않지만, 통상적으로 `next`라는 이름으로 사용된다.

미들웨어 함수는 크게 다음의 네 가지 동작을 수행한다.

- 미들웨어 함수에 포함된 모든 코드를 실행한다.
- 요청 및 응답 객체에 대한 변경, 조작을 수행한다.
  - 예를 들어, `body-parser`를 이용해 요청 객체에 `body` 속성을 추가한다.
- 요청-응답 주기를 종료한다.
  - 예를 들어, *Controller*에서 `res.json()` 메서드를 호출해 사용자에게 응답 객체를 전송한다.
- 미들웨어 스택 내의 다음 미들웨어 함수를 호출한다.
  - 예를 들어, 미들웨어 함수의 마지막 또는 조건부 분기문에서 `next()` 메서드를 호출한다.

[참고] 여기서 **요청-응답 주기**란, 사용자로부터 요청이 도착하고 서버가 응답을 전송하는 한 번의 과정을 의미한다. 미들웨어 함수에서 `res.end()` 또는 `res.json()`과 같이 응답 객체를 전송하는 메서드가 호출되면 **요청-응답 주기**가 종료된다.

*Express* 어플리케이션에서 사용할 수 있는 미들웨어의 종류는 다음과 같다.

- 어플리케이션 레벨 미들웨어
- 라우터 레벨 미들웨어
- 오류 처리 미들웨어
- 기본 제공 미들웨어
- Third Party 미들웨어

### 어플리케이션 / 라우터 레벨 미들웨어

어플리케이션 레벨 미들웨어와 라우터 레벨 미들웨어는 미들웨어는 미들웨어가 바인드 되는 인스턴스가 다르다른 것을 제외하면 사실상 완전히 동일하게 작동한다. 어플리케이션 레벨 미들웨어는 `const app = express();`로 생성된 *Application Instance*에 바인드 되고, 라우터 레벨 미들웨어는 `const router = express.Router();`로 생성된 *Router Instance*에 바인드 된다.

```
const app = express();
const router = express.Router();

router.use((req, res, next) => {
  console.log("어플리케이션 레벨 미들웨어입니다.");

  next();
});

// 하나 이상의 미들웨어를 하나의 위치에 마운트 할 수 있다.
router.use('/user/:id', 
  (req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    next();
  }, 
  (req, res, next) => {
    console.log('Request Type:', req.method);
    next();
  }
);

// 어플리케이션 인스턴스에 라우터 인스턴스 마운트
app.use('/', router);
```


### 오류 처리 미들웨어

앞에서 살펴본 두 개의 미들웨어와 사용법이 크게 다르지 않지만, **오류 처리 미들웨어는 4개의 인자를 필요**로 한다는 것이 큰 차이점이다. 기존의 `req`, `res`, `next`에 더해 `error`를 인자로 받는다.

**[중요]** `error` 인자가 포함되지 않으면, *Express*는 해당 미들웨어를 오류 처리 미들웨어로 인식하지 않는다.

```
app.use((error, req, res, next) => {
  console.error(error.stack);

  res.status(500).send('서버 내부 오류!');
})
```

## Express 오류 처리

*Express* 어플리케이션의 미들웨어 스택에서 발생한 모든 오류(*Exception*)는 바로 앞에서 소개한 **오류 처리 미들웨어**를 사용해 처리될 수 있다. 오류 처리 미들웨어는 `app.use()` 또는 `router.use()`를 통해 **어플리케이션 레벨 미들웨어와 라우터 레벨 미들웨어를 모두 정의한 후 가장 마지막에 정의**되어야 한다.

```
const app = express();

// Third Party 및 사용자 정의 미들웨어 등록
app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => {
  console.log("어플리케이션 레벨 미들웨어입니다.");
});

// 오류 처리 미들웨어 등록
app.use((error, req, res, next) => {
  // 오류 처리 로직
})
```

다른 미들웨어와 마찬가지로 오류 처리 미들웨어도 한 개 이상 등록할 수 있으며, 가장 먼저 등록된 오류 처리 미들웨어부터 실행된다. 

```
app.use(express.urlencoded());
app.use(express.json());
// 오류 처리 미들웨어 등록
app.use(errorLogger);
app.use(clientErrorHandler);
app.use(errorHandler);
```

*Express*가 미들웨어 함수가 실행되는 과정에서 발생하는 **모든 오류**를 잡아낼 수 있도록 하는것이 중요하다. 발생한 **오류를 적절히 잡아내고 처리하지 못하면 오류 처리 미들웨어가 실행되지 못하고, 실행중이던 *Express* 어플리케이션이 중단**되어 버리기 때문이다.

*Express*가 발생한 오류를 잡아낼 수 있도록 하는 방법은 아래에서 자세히 설명한다.

### `throw new Error()`

어플리케이션 레벨 미들웨어 또는 라우터 레벨 미들웨어의 ***Synchronous 함수***에서 발생한 오류를 *Express*가 잡아내도록 하려면, 오류 정보를 기반으로 새로운 `Error Obejct`를 생성하고 `throw`하면 된다. 이렇게 오류 개체를 생성하고 던져주기만 하면 *Express*가 자동으로 이를 `catch`하고 적절한 처리를 수행한다.

```
app.get('/', (req, res) => {
  throw new Error('BROKEN');  // Express will catch this on its own.
});
```

### `next(error)`

어플리케이션 레벨 미들웨어 또는 라우터 레벨 미들웨어에 포함된 함수가 **Asynchronous**한 경우, 위와 같이 새로운 오류 객체를 생성해 던지지 않고 `next()` 메서드를 호출할 때 오류를 매개변수로 전달해 주어야 한다.   

```
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (error, data) => {
    if (error) {
      next(error); // Pass errors to Express.
    } else {
      res.send(data);
    }
  });
});
```

### *Express 5*

***Express 5*** 버전부터 *Promise*를 반환하는 어플리케이션 레벨 미들웨어 또는 라우터 레벨 미들웨어 함수의 경우, *Promise*가 오류를 `throw`하거나 `reject`되면 자동으로 `next(value)` 메서드가 호출된다. 

```
app.get('/user/:id', async (req, res, next) => {
  const user = await getUserById(req.params.id);
  res.send(user);
});
```

위의 코드에서 만약 `getUserById`에서 오류가 `throw`되거나 *Promise*가 `reject`되면, `throw`를 통해 던져진 오류 객체 또는 `reject()`의 매개변수로 전달된 오류를 `next()` 메서드의 매개변수로 포함해 자동으로 호출한다. 만약 `reject()`에 아무런 값도 전달되지 않았다면, *Express Router*에 의해 제공되는 *기본 에러 객체*가 전달된다.


### `throw new Error` 또는 `next(error)` 이후

`'route'`라는 문자열을 제외한 어떠한 값이라도 `next()` 메서드에 전달되면 *Express*는 현재 요청에 오류가 발생한 것으로 간주하고 후위의 모든 어플리케이션 레벨 미들웨어와 라우터 레벨 미들웨어를 생략하고 오류 처리 미들웨어를 즉시 실행한다.

```
app.get('/', [
   (req, res, next) => {
    fs.writeFile('/inaccessible-path', 'data', next);
  },
  (req, res) => {
    res.send('OK');
  }
]);
```

위의 코드에서 `fs.writeFile`의 *Callback*으로 `next`를 전달하고 있으며, `fs.writeFile`의 결과에 따라 오류를 포함하여 호출되거나 또는 오류가 포함되지 않고 호출된다. 즉, `fs.writeFile`이 정상적으로 수행되면 `next()`가 호출되고 그렇지 않으면 `next(error)`가 호출되는 것이다.

`next()`가 호출되면 바로 아래에 정의된 미들웨어를 계속해서 실행하고, 그렇지 않다면 생략하고 **오류 처리 미들웨어**로 즉시 이동한다.

**[중요]** 어플리케이션 레벨 미들웨어와 라우터 레벨 미들웨어서 호출된 ***Asynchronous***한 함수에서 발생한 오류는 **반드시 잡아내어 *Express*에 전달**해 주어야 한다. 

```
app.get('/', (req, res, next) => {
  // 비동기 함수
  setTimeout(() => {
    try {
      throw new Error('BROKEN');  // 에러 발생
    } catch (error) {
      next(error);  // Express로 전달
    }
  }, 100);
});
```

위의 예제에서는 `try..catch`를 사용해 발생한 오류를 잡아내고 `next(error)`를 통해 *Express*에 전달하고 있다. 

미들웨어 함수 자체는 *Synchronous*하기 때문에, `try...catch`를 사용하지 않는다면 미들웨어 함수 내부의 *Asynchronous* 함수가 실행된 결과가 반영되지 않은 채 미들웨어 함수의 실행이 종료될 것이다. 

예제에서는 `try...catch`를 사용하고 있지만, *Asynchronous*한 함수 또는 *Promise*를 반환하는 함수를 처리할 때는 *Promise Prototype*의 `then()`과 `catch()` 메서드를 사용하는 것이 좋다.

```
app.get('/', (req, res, next) => {
  Promise.resolve()
    .then(() => {
      throw new Error('BROKEN')
    })
    .catch(next); // Express로 오류 전달.
})
```

