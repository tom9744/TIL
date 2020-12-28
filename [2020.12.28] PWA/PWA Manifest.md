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