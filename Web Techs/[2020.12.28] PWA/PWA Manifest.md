# PWA - Manifest

**PWA(Progressive Web App)**는 Web App을 앱스토어 등에서 설치하는 Native App과 유사하게 사용할 수 있도록 한다.  
즉, PWA를 통해 ***Push Notification*, *Offline Support*, *Splash Screen* 등의 기능을 지원**할 수 있다.

## manifest.json

Wep App을 PWA로 만들기 위해서 가장 먼저 적용해야 하는 것이 **Web App Manifest**이다.  
`manifest.json`는 Web App에 대한 정보를 담고 있는 JSON 파일로서, 다양한 속성(Property)을 가진다.

예시
```
{
  "name": "PWA Basic",
  "short_name": "PWA",
  "icons": [
    {
      "src": "./src/images/icons/app-icon-48x48.png",
      "type": "image/png",
      "sizes": "48x48"
    },

    ...생략...
  ],
  "start_url": "./index.html",
  "scope": ".",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#fff",
  "theme_color": "#3f51b5",
  "description": "A Simple PWA Practice",
  "dir": "ltr",
  "lang": "en-US"
}
```

`manifest.json` 파일에서 기본적으로 설정해주어야 하는 속성들을 위의 예시에서 확인할 수 있다.  
각 속성에 대한 세부 설명은 아래와 같다. 

- name: Application의 Fullname
- short_name: 제한된 공간에서 사용할 Shortname
- icons
    - Application의 아이콘으로 사용될 이미지
    - 아이콘의 해상도는 48px 단위로 제공 
- start_url
    - Home 화면에서 아이콘을 통해 접근 시, 처음 보이는 화면
- scope
    - PWA 기능을 적용할 범위
- display
    - Application을 실행할 때, 사용자에게 보여질 형태를 정의
    - `fullscreen`, **`standalone`**, `browser` 등
- orientation
    - Application이 실행될 방향(가로, 세로)을 설정
    - `any`, `portrait`, `landspace`, `protrait-primary` 등
- background_color
    - *Splash Screen*의 색상 정의
- theme_color
    - 모바일 기기의 *Task Swticher*에서 사용할 색상 정의
- description
    - Application에 대한 간략한 설명
- dir
    - `ltr`, `rtl` 속성이 존재하며, 글을 읽는 방향 정의
- lang
    - Application 기본 언어 설정
 
이후 HTML 파일의 `<head>` 태그에 `<link rel="manifest" href="/manifest.json">`과 같이 등록해주면 된다.  
이때, **Root HTML 파일에만 `manifest.json` 파일을 등록하는 것이 아니라, PWA 기능을 사용하는 모든 HTML 파일에 등록**해야 한다.

## In case of Safari

PWA의 `manifest.json` 파일은 현재 *Chrome, Opera*에서는 공식적으로 지원되고 있으며,  
*Firefox, Edge*에서도 이를 지원하기 위한 개발이 진행중에 있다.

하지만, 불행히도 Apple의 *Safari*는 `manifest.json` 파일을 지원하지 않는다.  
따라서 다음과 같은 별도의 `<meta>`, `<link>` 태그를 추가하여 완전한 PWA는 아니지만, 유사한 느낌을 낼 수 있다.

```
<!-- Mobile Web App으로 인식하도록 설정하여, A2HS(Add To Home Screen) 가능 -->
<meta name="apple-mobile-web-app-capable" content="yes">  
<!-- Status Bar 색상 설정 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<!-- <title> 태그에서 지정한 것과 다른 이름을 사용하는 경우 설정 -->
<meta name="apple-mobile-web-app-title" content="AliasName">
<!-- Apple 기기에서 사용할 Icon 이미지 설정 -->
<link rel="apple-touch-icon" href="Path To Icom Image..." sizes="Resolution (e.g.144x144)">
```

위와 같이 설정하여 *iOS Safari* 상에서도 PWA의 느낌을 줄 수는 있지만,  
*Chrome, Opera*에서와 같이 모든 기능을 지원할 수는 없다는 단점이 존재한다.


## App Install Banner

기존(Chrome 68 이전)에는 *특정한 조건*을 만족하도록 `manifest.json` 파일이 작성되어 있는 경우,  
PWA에 2회 이상 비연속적으로 접속하면 Chrome에서 홈스크린에 등록할 수 있도록 **App Install Banner**가 등장했다.

- `manifest.json` 파일
    - name
    - short_name
    - 144x144 png icon
    - start_url
- *Service Worker* 등록
- HTTPS 프로토콜 사용
- 연속적이지 않은 2회 이상의 방문

위의 네가지 조건 중, 마지막 조건인 **연속적이지 않은 2회 이상의 방문**은 Chrome에서 임의로 정한 것일 뿐,  
**언제든지 개발자의 필요에 따라 변경**될 수 있다.

**App Install Banner** 표시 조건을 변경하려면 `beforeinstallprompt` 이벤트를 사용하면 되는데,  
이 이벤트는 Chrome 브라우저가 **App Install Banner**를 보여주기 바로 직전에 발생하는 이벤트이다.

다음은 기존의 **App Install Banner** 표시 조건을 `preventDefault()`를 사용해 취소하고,  
사용자가 *게시물 작성 버튼*을 클릭하는 경우 **App Install Banner**를 표시하도록 변경하는 예시이다.

```
// app.js
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (evnet) => {
    event.preventDefault();  // 조건 기본값 취소

    deferredPrompt = event;
    return false;  // Do Nothing
})
```

```
// posts.js
cosnt modal = document.querySelector('.modal');
const btn = document.querySelector('.button');

btn.addEventListener('click', () => {
    if(deferredPrompt) {
        deferredPrompt.prompt();  // Banner 표시

        deferredPrompt.userChoice  // returns Promise 
            .then((choiceResult) => {
                console.log(choiceResult.outcome);

                if (choiceResult.outcome === 'dismissed') {
                    console.log('User rejected!');
                } else {
                    console.log('User accepted!');
                }
            });
        
        deferredPrompt = null;
    }
});
```

하지만 Chrome 68 이후부터, 더 이상 자동으로 홈스크린 등록 여부를 묻는 **App Install Banner**가 등장하지 않으며,  
위의 예시 코드와 같이 `beforeinstallprompt`라는 이벤트를 통해 수동으로 표시해 주어야 한다.

