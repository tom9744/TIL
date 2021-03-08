# Nginx Reverse Proxy 환경에서 SSE 적용하기

회사에서 진행중인 프로젝트의 요구사항에 따라, 특정 이벤트가 발생하면 이를 Vue.js SPA에서 실시간으로 푸쉬 알람의 형태로 제공해야 한다. 처음 접해보는 요구사항이라 인터넷에서 이런저런 자료를 찾아보았고, *Polling*, *Long Polling*과 같이 완전한 실시간 통신은 아니지만 실시간 통신을 하는 것과 같은 효과를 줄 수 있는 방법과 *Server Sent Event*, *Web Socket*과 같이 실제적인 실시간 통신을 수립하는 방법이 있다는 것을 알게 되었다.

각각의 이벤트 발생 주기는 5-10분 사이이며, 현재 프로젝트에 등록된 장치의 개수가 많지 않아서 *Polling* 또는 *Long Polling* 방법을 이용해 구현하려고 계획하였다. 하지만, 프로젝트가 추후 확장될 수도 있다는 점, 장치의 개수가 많아지면 이벤트 발생 주기가 더이상 일정하지 않을 수도 있다는 점을 고려하여 *Server Sent Event* 또는 *Web Socket* 방식을 적용하는 것으로 방향을 틀었다. 

결과적으로는 Vue.js SPA에서 서버측으로 실시간 통신을 통해 전달하는 것은 없고, 데이터를 받아오기만 하는 요구사항이기 때문에 양방향 통신을 지원하는 *Web Socket* 대신 HTML5 API를 사용하는 *Server Sent Event* 방식을 선택하게 되었다.

<br>

## 프론트엔드, 백엔드 프로젝트에 적용하기

이에 대한 내용은 이전에 이미 기록해 두었으며, [이곳](https://github.com/tom9744/TIL/blob/master/%5B2021.01.13%5D%20Express%20%26%20Vue.js/Server-Sent-Event.md)에서 확인할 수 있다.

<br>

## 문제 발생과 해결

로컬 개발 환경에서 위의 방법에 따라 구현한 코드가 정상적으로 작동하는 것을 확인하였고, 데이터를 가공해 사용자에 적합한 형태로 렌더링하는 작업까지 완료하였다. 최종적으로 이러한 변경내용을 AWS ECS CensOS + Nginx 환경에 배포되어 있는 [Vue.js 프로젝트](http://ino-on.umilevx.com/)에 반영해야 한다.

이미 앞에서 Vue.js 프로젝트를 빌드하고 배포하는 과정에서 수많은 에러를 경험하였고, 이를 해결할 수 있는 방법과 그 과정에 대해 역시 [이곳](https://github.com/tom9744/TIL/blob/master/%5B2021.01.20%5D%20Vue.js%20%2B%20Nginx%20%EB%B0%B0%ED%8F%AC/Nginx%EB%A1%9C%20Vue.js%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EB%B0%B0%ED%8F%AC.md)에 정리해 놓았었다. 따라서 배포까지는 손쉽게 진행하였으나, 역시나 이번에도 새로운 문제에 봉착하게 되었다.

### **마주한 문제**

로컬 환경에서 아무런 문제 없이 정상적으로 작동하던 **`EventSource API`가 기대한 방식으로 작동하지 않는다.** 

```
const eventSource = new EventSource("Endpoint URL", { withCredentials: true });
```

*Vue.js*에서 위와 같이 `EventSource API`를 이용해 인스턴스를 생성하여 `"Endpoint URL"`에 제공된 주소로 HTTP GET Request를 전송하고, *Express*에서는 이러한 Request가 도착하면 `setInterval`을 사용해 **5초에 한 번씩, 총 여섯 번 임시 이벤트 데이터를 **Vue.js** 측으로 제공**하도록 구현된 상황이다. 

완벽히 동일한 코드를 사용하고 있음에도 배포 환경에서는 임시 이벤트 데이터가 5초에 한 번씩 *Vue.js*로 전달되지 않았으며, 30초동안 아무런 일도 발생하지 않았다. 즉, `EventSource API`에 등록한 `onopen`, `onerror`와 같은 이벤트 핸들러도 트리거되지 않았다. 

그 대신, 여섯 개의 데이터를 전송하는데 필요한 시간(= 30초)이 경과하면 **마치 어딘가에 데이터가 축적되다가 한 번에 묶어서 전송되는 것 같은 현상이 발생**했다. 


### **문제 해결**

에러가 발생해 관련된 에러 메세지가 제공되는 것도 아니고, *Server Sent Event* 방식 자체가 *Web Socket*에 비해 많이 사용되지 않는지 참고할 수 있는 자료도 부족했다. 즉, 처음에는 문제의 원인이 무엇인지도 파악할 수 없었다.

다만 **개발 환경에서는 작동하는데 배포 환경에서는 작동하지 않는다**라는 실마리를 가지고 계속 머리를 굴렸고, 결국 두 환경의 유일한 차이점인 ***Nginx***에 대해 떠올리게 되었다.

현재 프로젝트가 배포되어 있는 AWS EC2 인스턴스에서는 *Nginx*를 *Reverse Proxy* 용도로 사용 중에 있는데, 이 과정에서 뭔가 문제가 발생한 것이라고 결론 내렸고, 결국 [Stackoverflow](https://stackoverflow.com/questions/13672743/eventsource-server-sent-events-through-nginx)에서 원하는 해결책을 찾을 수 있었다.

다음은 이 문제를 해결할 수 있는 방법으로, *Nginx* 설정 파일에 다음과 같은 내용을 추가하면 된다.

```
proxy_set_header Connection '';
proxy_http_version 1.1;
chunked_transfer_encoding off;
```

위의 설정 내용만으로 문제가 해결되지 않으면, 아래의 내용도 추가한다.

```
proxy_buffering off;
proxy_cache off;
```

사실 백엔드 또는 서버 전반에 대한 지식이 탄탄하지 못한 편이라, 어디서 문제가 무엇이 되었고 어떻게 해결된 것인지 완벽히 이해는 되지 않는다.

하지만 짐작컨데, *Reverse Proxy*로 작동하는 *Nginx*에서 서버가 클라이언트에게 전송하려는 데이터를 버퍼(?)와 같은 공간에 저장하고 있다가 `res.end()`, `res.send()`와 같이 응답(Response)을 전송하라는 명확한 신호가 있을 때만 클라이언트로 전송해서 발생한 문제인 것 같다. 

따라서 *Nginx* 설정에서 버퍼링, 캐싱과 관련된 설정을 모두 `off`로 변경하여 서버에서 클라이언트에게 전송하려는 모든 데이터를 즉시 클라이언트에게 전달하도록 하는 것 같다.

이 문제에 대해서는 1월 말 진행 예정에 있는 프로젝트 팀원 간 지식 공유 세미나에서 함께 백엔드 개발자 분들에게 여쭤보고, 확실하게 이해하고 넘어가고 싶은 욕심이 있다.