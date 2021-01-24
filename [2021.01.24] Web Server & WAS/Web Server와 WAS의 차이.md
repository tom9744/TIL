# Web Server와 WAS의 차이

[Nginx를 이용해 Vue.js SPA 프로젝트를 배포하는 과정에 대해 정리한 글](https://github.com/tom9744/TIL/blob/master/%5B2021.01.20%5D%20Vue.js%20%2B%20Nginx%20%EB%B0%B0%ED%8F%AC/Nginx.md)에서 *Web Server*가 무엇인지 간략하게 다루었다. 오늘은 프로젝트를 제작한 뒤 최종적으로 배포하는 과정에서 사용하게 되는 *Web Server*와 *Web Application Server(WAS)*에 대해 알아본다.

<br>

## Static vs. Dynamic Page

*Web Server*와 *Web Application Server(WAS)*에 대해 다루기 이전에, **정적 웹 페이지**와 **동적 웹 페이지**에 대해 짚고 넘어가야 한다.

![Static_Versus_Dynamic](./static-vs-dynamic.png)


### 정적 웹 페이지 *(Static Web Page)*

정적 웹 페이지는 이름대로 **'변하지 않는'** 페이지이다. 즉, 어느 시점에서 페이지를 방문하더라도 해당 페이지를 구성하는 문자나 그림과 같은 내용이 일정하다. (다만, 코드가 변경되거나 정적 파일 자체가 변경되면 그에 따라 페이지도 변하게 된다.)

우리가 흔히 알고있는 *Web Server*는 **각 페이지에 연결되어 있는 URL로 사용자의 요청(Request)이 도착하면 해당하는 정적 페이지를 반환**하는 역할을 수행한다. 예를 들어, 웹 사이트의 메인페이지에 해당하는 `/` URL에 `index.html` 파일이 연결되어 있다면, `index.html` 파일을 사용자에게 반환한다.

또한 해당 `index.html` 파일에서 사용하는 `CSS`, `Javascript`, `Image File` 등 서버 컴퓨터에 저장되어 있는 **정적 자원 *(Static Resources)***을 직접 반환하기도 한다. 예를 들어, `오른쪽 마우스 클릭 - 이미지 주소 복사`를 통해 얻을 수 있는 URL을 브라우저에 입력하면, *Web Server*로부터 해당 파일을 직접 받을 수 있다.


### 동적 웹 페이지 *(Dynamic Web Page)*

동적 웹 페이지는 **완전히 동일한 요청(Request)이라도 다양한 조건에 따라 다른 내용을 표시**한다. 예를 들어, HTTP GET Request를 전송할 때 `/users?id=123`와 같이 *Query Parameter*를 통해 변수를 전달하면 **동적 웹 페이지는 해당 변수에 따라 서로 다른 결과를 표시**하게 된다. 

동적 웹 페이지를 운용하는 *Web Server*는 단순히 요청된 URL에 해당하는 페이지를 반환하는 것이 아니라, ***Web Server* 상에서 실행되는 별도의 프로그램을 통해 만들어진 결과물을 반환**한다. 예를 들어, `/users?id=123`와 같이 사용자 정보를 요청하는 GET Reqeust가 도착하면 *Web Server* 상에서 실행되고 있는 DBMS에 접근해 전달된 변수에 해당하는 사용자 정보를 검색한 뒤, 그 결과를 반영한 페이지를 반환한다.

<br>

## Web Server vs. Web Application Server

### Web Server

*Web Server*가 무엇인지에 대해서는 이미 [Nginx를 이용해 Vue.js SPA 프로젝트를 배포하는 과정에 대해 정리한 글](https://github.com/tom9744/TIL/blob/master/%5B2021.01.20%5D%20Vue.js%20%2B%20Nginx%20%EB%B0%B0%ED%8F%AC/Nginx.md)에서 다루었으므로, 자세하게 기술하지는 않는다.

*Web Server*의 개념은 **하드웨어적 측면**, **소프트웨어적 측면**으로 나누어진다. 하드웨어적 측면의 *Web Server*는 '해당 *Web Server*가 설치되어 있는 컴퓨터'를 의미히며, 소프트웨어적 측면의 *Web Server*는 사용자로부터 HTTP Request를 받아 **정적 자원**을 제공하는 컴퓨터 프로그램을 의미한다. 예를 들어, AWS EC2 인스턴스에서 작동하는 Nginx 서버의 경우, AWS EC2는 하드웨어적 측면의 *Web Server*이고 Nginx는 소프트웨어적 측면의 *Web Server*이다.

*Web Server*는 HTTP 프로토콜을 기반으로 사용자로부터 전달받은 요청(Request)에 대해 적절한 서비스를 제공한다. 또한, 요청에 따라 아래의 두 가지 기능 중 하나를 선택하여 수행한다.

- 정적 자원에 대한 요청인 경우,
    - URL에 해당하는 적절한 정적 자원을 반환한다.
    - WAS를 거치지 않고 즉시 자원을 제공한다.

- 동적 자원에 대한 요청인 경우,
    - URL 또는 변수에 해당하는 적절한 동적 자원을 반환한다.
    - 사용자의 요청을 WAS에 전달하고, WAS가 처리한 결과를 최종적으로 반환한다. 

*Web Server*는 대표적으로 `Apache Server`, `Nginx`, `IIS` 등이 존재한다.


### WAS (Web Application Server)

*WAS*는 **DBMS를 이용한 DB 조회, 또는 다양한 비즈니스 로직 처리**를 요구하는 **동적 자원**을 제공하기 위해 만들어진 *Application Server*이다. JSP, Servlet을 구동할 수 있는 환경을 제공해주기 때문에 *Web Container* 또는 *Servlet Container*로 불리기도 한다.



