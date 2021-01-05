# Handling Images

서버로 전달되는 *HTTP Request*에서 *Body* 속성을 손쉽게 추출하여 사용하기 위해서 *Express*에 내장되어 있는 *Middleware*를  
`app.use(express.urlencoded({ extended: false }));` 또는 `app.use(express.json());`과 같이 등록하여 사용했다.  

## URL (Percent) Encoded 

*URL Encoding*은 인터넷에서 사용하는 URL에 문자(Character)를 표현하기 위해 특정한 형식으로 변형하는 것을 말한다.  
여기서 말하는 문자는 ***ASCII Code*로 표현할 수 없는 모든 문자**를 말하며, 당연히 한국어도 이에 포함된다.  
간단한 예시로 `안녕하세요`에 *URL Encoding*을 적용하면 `%ec%95%88%eb%85%95%ed%95%98%ec%84%b8%ec%9a%94`가 된다.  

위와 같은 *URL Encoding* 방식을 사용하는 가장 큰 이유는 URL의 *Query Parameter*를 통해 데이터를 전송하는  
*HTTP GET Request*와 같이 URL에 *ASCII Code*가 아닌 문자가 포함되는 경우가 있기 때문이다.  

*Javascript*에서는 기본적으로 포함된 `encodeURLComponent()` 메서드를 사용해 문자열을 *URL Encoding* 할 수 있다.

사용자 측에서 *Form*을 통해 입력받은 이미지를 서버로 전송할 때, `express.urlencoded()` *Middleware*가 사용중에 있다면  
서버는 이미지를 *Text Data*로 변환하려고 하며, 이는 당연히 실패하게 되고 `req.body`의 *Image* 속성에는 아무런 값도 존재하지 않게 된다.  
이미지 또는 다른 형태의 파일은 모두 *Binary Data*이며, *Text Data*로 변환될 수 없기 때문이다.


## Multer

```
npm install --save multer
```

위에서 확인한 것처럼, *Express*에서 기본적으로 제공되는 *Body Parser*는 *File*을 정상적으로 처리하지 못하며,  
이와 관련된 기능을 일절 포함하지 않는다. 따라서 *Third-Party Package*를 이용하는데, 그것이 바로 ***Multer***이다.  

*Multer*는 기존의 *Body Parser*가 처리하는 `application/www-form-urlencoded`, `application/json`, `text/plain` 이외에  
`multipart/form-data` 형태의 정보가 서버로 도착하는 경우 해당 *Request*에서 *File*을 추출한다.  

*Multer*는 *Middleware*이므로, 다음과 같이 각각의 *Route*에 등록하여 사용한다.

```
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })  // 저장 경로 설정

// 단일 파일
app.post('/single-file', upload.single('image'), (req, res, next) => {
    const file = req.file;
    next();
})

// 다수 파일
app.post('/multiple-file', upload.array('images', 12), (req, res, next) => {
    const files = req.files;
    next();
})
```

이때, `upload.single()` 메서드에 매개변수로 전달하는 문자열은 아무런 의미가 없는 무작위 값이 아니며,  
사용자 측에서 사용중에 있는 `<form>` 태그 내부의 파일을 담고 있는 `<input>` 태그의 *name* 속성값이다.

**[주의]** 악의적인 사용자가 개발자가 예측하지 못한 위치로 파일을 업로드 할 수 있으므로 **절대 *Multer*를 전역 등록해서는 안된다.**

최종적으로 *Multer*에 의해 `req` 객체에 속성으로 추가된 `file`의 내용을 출력해보면 다음과 같은 결과를 얻는다.

```
{
    fieldname: 'image',
    originalname: 'example.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: <Buffer 89 50 4e 47 0d 0d 0a 1a 0a 00 00 00 ...>,
    size: 519694
}
```

여기서 주목해야할 부분은 `buffer: <Buffer 89 50 4e 47 0d 0d 0a 1a 0a 00 00 00 ...>`이며, 서버로 전달된 *File*을 나타낸다.  

전달받은 *File*이 *Buffer*로 표현되는 것은 *Javascript*가 *File*을 처리하는 방식과 연관되어 있는데,  
*Binaray Data*와 같은 대용량의 정보를 효율적으로 처리하기 위해 *File*은 *Stream*의 형태로 변환되어 서버로 전송하기 때문이다.

*Stream*의 형태로 서버에 도착한 정보는 *Buffer*에 저장되며, 최종적으로 완성된 *Buffer*를 *File*로 변환해 사용하면 된다.

#### Property 'enctype'

사용자 측에서 이미지 또는 다른 형태의 파일이 포함된 데이터를 서버로 전송하고자 할 때, 반드시 `<form>` 태그의 `enctype` 속성을  
`multipart/form-data`로 지정해야 한다. `enctype` 속성은 *Form Data*가 서버로 전송될 때 *Data*가 *Encoding*되는 방법을 명시한다.  

위와 같이 `enctype`을 명시하지 않으면, **사용자가 제출한 이미지의 경로만 전송되고 파일 자체는 업로드되지 않게 된다.**

```
<form method="POST" enctype="multipart/form-data">
    ...
</form>
```

`enctype` 속성은 다음 세가지의 값으로 지정될 수 있다. 
- application/www-form-urlencoded (default)
- multipart/form-data
- text/plain


## Configuring Multer with Options

위의 *Multer* 사용 예제에서 `multer()` 메서드를 호출할 때 매개변수로 객체를 전달하여, *Multer*에 설정값을 부여할 수 있다.

예를 들어, `multer({ dest: 'uploads/' })`와 같은 *Option*을 전달하면, *Multer*는 더이상 `req.file`에 `buffer` 속성을 추가하지 않고  
해당 *Buffer*를 *Binaray Data*로 자동 변환하여 지정된 경로에 저장한 뒤, 해당 경로를 새로운 속성 `path`를 `req.file`에 추가한다.

기본적으로 *Multer*는 *File*의 이름이 중복되는 것을 방지하기 위해 무작위 문자열로 이름을 재작성 하는데,  
보다 세부적인 설정을 하고 싶은 경우 `dest` 대신 `storage` *Option*을 사용해 다음과 같이 사용하면 된다.

```
const storage = multer.diskStorage({
    // 'cb' stands for 'callback'
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

const upload = multer({ storage: storage });
```

`cb()` 메서드의 첫번째 매개변수로 전달되는 것은 `Error` 객체이며, 처리 과정에서 문제가 발생한 경우  
첫번째 매개변수로 전달한 오류 메세지를 *throw* 한다. 첫번째 매개변수에 `null`을 전달하면 어떠한 경우에도 *File*을 저장한다.

**[주의]** *Multer*는 파일의 확장자를 추가하지 않으며, 수동으로 추가하려면 `req` 또는 `file`의 속성을 사용한다. 


## Filtering Files by 'mimetype'

특정한 형태의 파일만 업로드할 수 있도록 설정하려면, `fileFilter` *Options*을 추가한다.  

```
const fileFilter = (req, file, cb) => {

    cb(null, false);

    cb(null, true);

    cb(new Error('I don\'t have a clue!'));
}
```

`fileFilter` *Options*에는 위와 같은 함수가 전달되며, 조건문 분기를 통해 *File*의 업로드 허용 여부를 결정할 수 있다.  
*File*의 업로드를 허용하려면 `cb(null, true)`를, 거부하려면 `cb(null, false)`를 호출하면 된다.  

마찬가지로, 예외가 발생하면 *Error* 객체를 `cb()` 메서드의 첫번째 매개변수로 전달해 *throw* 할 수 있다.  

대표적으로 사용되는 ***File* 업로드 허용 판단 기준은 *mimetype***이며, 두번째 매개변수로 전달된 `file`의 속성에서 찾을 수 있다.  
예를 들어, `png` 또는 `jpeg` 형태의 이미지만 허용하도록 하는 *Multer Option* 설정은 다음과 같다. 

```
const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image.jpg' || file.mimetype === 'image.jpeg' || file.mimetype === 'image.png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

const upload = multer({ fileFilter: fileFilter });
```

