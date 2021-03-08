# Nginx에 Vue.js 프로젝트 배포하기

앞에서는 웹 서버와 Nginx가 무엇인지 알아보고, Nginx의 기초적인 설정을 작성하는 방법을 정리하였다. 이번에는 회사에서 진행하는 Vue.js 프로젝트를 CentOS 7, Nginx 환경에 배포하는 과정에서 겪었던 문제를 정리하여 다음에 비슷한 상황에 처했을 때 참고할 수 있도록 하려고 한다.

<br>

## **0. 개발자 모드로 작동 여부 확인**

사실 본격적인 배포 과정에 앞서, 개발팀 담당자님께서 AWS EC2 / CentOS 7 환경에서 Vue.js로 작성한 SPA가 정상적으로 작동하는지 간단히 확인하고 싶어하셨다. 

따라서 작업중이던 코드를 Github을 통해 CentOS로 옮기고 `git clone`하여  (귀찮아서) `npm run build` 하지 않고 `npm run serve` 명령어를 사용해 개발 서버에서의 동작 여부만 보여드리고자 했다.

그런데 역시 아니나 다를까, `Invalid Host Header`라는 에러 문구와 함께 정상적으로 개발 서버에 접근하지 못했다. 문제 해결을 위해 인터넷을 찾아보니 보안상의 문제로 개발 서버에는 localhost 이외의 다른 호스트에서는 접근할 수 없도록 해놓은 것 같았다.

해결 방법은 웹팩 설정에서 아래와 같이 설정해주는 것이라고 한다.
```
devServer: {
  disableHostCheck: True
}
```
Vue CLI 3.X 이후로는 웹팩 관련 설정을 `vue.config.js` 파일에서 수행할 수 있으므로, 해당 파일을 프로젝트 루트 디렉토리에 생성하고 아래와 같이 작성해 주었더니 정상적으로 접근할 수 있었다. 
```
module.exports = {
  devServer: {
    disableHostCheck: true
  }
};
```

<br>

## **1. Vue.js 프로젝트 빌드**

프로젝트 프로토타입 배포를 위해서는, 가장 먼저 작성한 Vue.js 프로젝트를 빌드해 주어야 한다. 간단히 `npm run build` 명령어를 실행하면 되는데, 해당 명령어를 실행하면 웹팩(Webpack)을 이용해 프로젝트를 구성하고 있는 CSS, Javascript 파일과 같은 요소들을 단일 파일로 병합하는 **모듈 번들링**이 진행된다.

모듈 번들링을 통해 CSS, Javscript 파일을 하나의 파일로 뭉치면 이러한 정적 파일을 불러오는데 필요한 수많은 네트워크 통신의 횟수를 획기적으로 줄일 수 있다. 웹팩과 관련된 내용은 상당히 방대하므로 일단 대략적으로 무엇을 하는지만 설명하고 넘어가도록 하겠다.

결과적으로 Vue.js 프로젝트를 빌드하면 `dist/` 디렉토리가 생성되고, 그 내부에 웹팩을 통해 단일 파일로 뭉쳐진 CSS, Javscript 파일이 위치하게 된다.

### **문제 발생과 해결**

**`npm install` 관련 문제**

> 처음에는 개발 환경인 macOS에서 프로젝트를 빌드해 `dist/` 폴더를 생성한 뒤, 해당 폴더만 AWS EC2 CentOS 인스턴스로 옮겨서 배포하려고 했다. 그러나 정상적으로 작동하지 않아서 CentOS에 `ssh`를 통해 접근해 프로젝트 레포지토리를 `git clone` 하고, CentOS 환경에서 `npm`을 이용해 필요한 라이브러리와 패키지를 설치한 뒤 빌드하기로 했다.
>
> ...그런데 `npm install`부터 문제가 발생했다.
>
> 에러 메세지는 `EACCES: permission denied`였고 권한 설정과 관련 문제로 보였다. 따라서 리눅스를 잘 사용하지 못하는 사람들의 영원한 동반자인 `sudo`를 추가해 `sudo npm install`을 실행했더니 설치가 정상적으로 되었다. 아무래도 `npm install`을 실행하면 `node_modules` 폴더가 생성되거나 내용이 변경되어야 하는데, 여기서 권한 문제가 발생한 것 같다.

**`npm run build` 관련 문제**

> 위와 마찬가지의 이유로 `npm run build` 명령어를 실행하면 `dist` 폴더를 생성할 수 있는 권한이 존재하지 않기 때문에 에러 메세지를 뱉으면서 정상적으로 빌드가 진행되지 않는다.
>
> 따라서, `sudo`를 추가해 `sudo npm run build`를 실행해야 한다. 

**[참고]** 스택 오버플로우의 어떤 글에서는 `npm install`을 실행하는 경우 `sudo` 명령어를 사용하지 말 것을 권고하고 있다. 대신 `sudo mkdir node_modules` 명령어로 미리 폴더를 생성하고 `sudo chown $USER:$USER /../../node_modules` 명령어로 해당 폴더의 권한을 열어준 뒤, `npm install`을 실행해야 한다고 한다. 

<br>

## **2. Nginx에 `dist/`의 경로 등록**

고난과 역경 끝에 정상적으로 Vue.js 프로젝트로부터 `dist/` 폴더를 뽑아냈다. 이제 Nginx 설정 파일을 수정하여 기존에 등록된 REST API 서버로 접근하는 URL(`http://도메인-이름/api`)을 제외하고는 `dist/` 폴더에 존재하는 `index.html`을 응답(Response)으로 제공하도록 해야한다.

CentOS와 Nginx 모두에 생소한 상태이기 때문에, 인터넷 검색에 크게 의존하였고 몇 번의 검색을 통해 완성한 Nginx 설정 파일은 아래와 같다.

```
upstream apiserver { 
  server localhost:7070;
  keepalive 10;
}

server {
  listen 80;

  server_name ino-on.devsmile.com www.ino-on.devsmile.com localhost 127.00.1;

  location /api {
    include /etc/nginx/proxy_params;
    proxy_pass http://apiserver;
  }

  location / {
    gzip on;

    root /var/...생략.../dist;

    index index.html;

    try_files $uri $uri/ /index.html;
  }
}
```

`location / { ... }` 부분이 새롭게 작성한 부분인데, 각각의 라인은 다음의 역할을 수행한다.

- `gzip on;`
  - 클라이언트 측으로 대용량의 텍스트 파일을 전송할 때, 압축하여 전송하도록 한다.
  - 응답을 전송하는데 소요되는 시간을 효과적으로 단축할 수 있다.
- `root /var/...생략.../dist;`
  - 위에서 Vue.js 프로젝트 빌드의 결과물인 `dist/` 폴더의 경로를 **Root 경로로 지정**한다.
- `index index.html;`
  - 가장 처음 보여질 HTML 파일을 지정한다.
  - 여기서는 Root 경로의 `index.html` 파일로 지정한다.
- `try_files $uri $uri/ /index.html;`
  - Vue, React 등으로 제작된 SPA는 단일 `index.html`만을 사용한다.
  - 따라서 `/user/profile`같은 상대주소를 통한 이동은 가능하지만, `http://도메인-이름/user/profile`과 같이 절대주소를 이용한 이동은 **404 Not Found** 에러를 발생시킨다.
  - `try_files $uri $uri/ /index.html`은 요청한 주소의 URI를 전부 무시하고 `index.html` 파일을 재공하도록 강제한다. 즉, `http://도메인-이름/user/profile`에 대한 요청의 URI인 `/user/profile`을 무시하고 `index.html`을 제공한다.
  - SPA 배포에서 반드시 필요한 설정이며, [Vue.js 공식 문서](https://router.vuejs.org/kr/guide/essentials/history-mode.html#%EC%84%9C%EB%B2%84-%EC%84%A4%EC%A0%95-%EC%98%88%EC%A0%9C)에서도 확인할 수 있다.

<br>

### **문제 발생과 해결**

**`403 Forbidden Error`**  
> Nginx 서버가 `/api`로 시작하는 URI의 요청(Request)을 제외한 모든 요청에 대해 **HTTP 웹 서버로 동작하여 Vue.js 프로젝트의 빌드 결과인 `index.html`을 응답(Response)으로 제공**하도록 설정하였으니 정상적으로 작동해야 하는데 `403 Forbidden` 에러가 발생했다.
>
> Nginx 서버에서 에러 로그를 기록하고 있다는 것도 모르고 하루종일 `Nginx Vue.js 403 Forbidden`이라는 검색 키워드와 함께 인터넷을 헤집고 다녔다. 인내와 인고의 시간을 보내며 검색을 수행한 결과 CentOS 파일/폴더 접근 권한으로 인한 문제라는 것을 파악할 수 있었고, 해결 방법까지 알아낼 수 있었다.
>
> Linux 기반 운영체제에는 **SELinux**라는 보안 정책이 적용되는데, 이 SELinux 정책은 모든 파일과 폴더에 대해 접근 권한을 부여하지 않는다. 즉, 기본적으로 전부 막혀있고, 권한을 허가한 부분에 대해서만 접근할 수 있도록 열어주는 보안 정책이다. 이러한 보안 정책으로 인해 Nginx에 설정에서 `dist/` 폴더를 연결은 해주었지만 접근 권한이 없어서 `403 Forbidden` 에러가 발생한 것이다.
>
> 해결은 단순히 **`dist/` 폴더와 내부 구성 파일의 접근 권한을 변경**해주면 된다.
>
> `ls -Z` 명령어를 통해 파일과 폴더에 적용되어 있는 보안 정책을 확인할 수 있다. `ls -Z /var/...생략.../dist` 명령어를 수행하면 기본적으로 `unconfined_u:object_r:var_t:so`과 같이 설정되어 있는데, 여기서 `var_t` 부분이 Nginx가 접근할 수 있는 `httpd_sys_content_t`로 변경되어야 한다.
>
>  `sudo chcon -Rt httpd_sys_content_t /var/...생략.../dist` 명령어를 수행하여 권한을 변경한다.


`uncaught SyntaxError: Unexpected token '<'` 문제
> macOS 환경에서 프로젝트 코드에 몇가지 변경사항을 적용한 후 다시 CentOS 환경에서 배포를 위해 `npm run build`를 수행하고 위의 방법에 따라 `dist/` 폴더의 권한 설정을 변경했는데 이번에는 못보던 에러가 크롬 개발자 도구에 뜨면서 화면에 아무것도 렌더링되지 않았다. 
>
> 질문을 받아줄 수 있는 사수 한 명 없는 근무 환경이기 때문에, 또다시 영원한 친구 인터넷의 힘을 빌리기로 결심하고 열심히 검색을 진행했다. 결과론적으로 이 문제를 해결하는데 아무런 도움도 되지 않았지만 추후에 혹시나 필요할 수도 있을 것 같아 기록한다.
>
> 우선, `index.html`의 `<head>` 태그 내부에 `<base href="/" />`을 추가하는 방안은 웹팩을 이용한 모듈 번들링의 결과물을 `index.html`에 추가할 때 **참조 파일의 경로가 잘못 지정되어 발생하는 경우에 대한 해결책**이었다. `dist/` 폴더에 `index.html`이 존재하고 CSS, Javscript 파일은 각각 `css/`, `js/` 폴더에 존재하는 경우, `<link href="/js/main.js">`와 같이 지정되어야 하는데, 가끔 `<link href="./js/main.js">`과 같이 **상대 경로**로 지정되는 경우가 있다는 것이다.
>
> 위와 동일 문제에 대해 `<head>` 태그 내부에 `<base href="/" />`을 추가하는 대신, `vue.config.js` 파일에서 `publicPath`를 변경하는 방법도 적용할 수 있다. 보다 자세한 내용은 역시 [Vue.js 공식 문서](https://cli.vuejs.org/config/#baseurl)를 통해 확인하자.
>
> 아무튼, 위의 해결 방법은 나의 문제를 전혀 해결해주지 못했다. 결국 해결하기는 했는데, `sudo chcon -Rt httpd_sys_content_t` 명령어를 `dist/` 폴더가 아닌 `index.html`에만 실행했기 때문이었다. 즉, `index.html`은 접근 가능해서 불러왔는데 필요한 CSS, Javasript 파일의 접근 권한이 막혀있어서 발생한 문제였던 것이다.

