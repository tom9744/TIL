# ApplicationEventPublisher

`ApplicationEventPublisher`은 **옵저버 패턴**의 구현체로서,  
이벤트 기반의 프로그래밍을 할 때 유용한 인터페이스이다.

## Event 생성

Spring 4.2 이후로는 `extends ApplicationEvent`를 생략 가능한다.

```
// Event Class
public class MyEvent extends ApplicationEvent {
    public MyEvent(Object source) {
        super(source);  // source - 이벤트를 발생시킨 주체
    }
} 
```

```
public class AppRunner implements ApplicationRunner {

    @Autowired
    ApplicationEventPublisher publishEvent;

    @Override
    public void run(ApplicationArguments args) thorws Exception {
        publishEvent.publishEvent(new MyEvent(source: this));  // 이벤트 발생
    } 
}
```

## Event 처리

위에서 발생시킨 Event를 받아서 처리하는 Handler를 작성하고, Bean으로 등록해야 한다.
Spring 4.2 이후로는 `extends ApplicationListener<MyEvent>`를 생략 가능한다.

```
// Event Handler
@Component
public class MyEventHandler extends ApplicationListener<MyEvent> {

    @Override
    public onApplicationEvent(MyEvent event) {
        System.out.println("이벤트 : " + event);
    }
} 
```

## Spring 4.2 이후

```
// Event Class
public class MyEvent {
    private Object source;
    private int numberData;

    public MyEvent(Object source, int numberData) {
        this.source = source;
        this.numberData = numberData;
    }

    public Object getSource() {
        return source;
    }
} 
```

```
// Event Handler
@Component
public class MyEventHandler {

    @EventListener
    public eventHandler(MyEvent event) {
        System.out.println("이벤트 : " + event.getSource());
    }
} 
```

위의 코드는 Spring Framework가 추구하는 *비침투성*이라는 가치를 달성한다.
*비침투성*이란, 비즈니스 로직에서 Spring 관련 코드가 포함되지 않는 특성을 말한다.

## Event Handler가 한 개 이상인 경우

```
// Event Handler
@Component
public class EventHandlerOne {

    @EventListener
    public eventHandler(MyEvent event) {
        System.out.println("First Handler : " + event.getSource());
    }
}

// Event Handler
@Component
public class EventHandlerTwo {

    @EventListener
    public eventHandler(MyEvent event) {
        System.out.println("Secone Handler : " + event.getSource());
    }
} 
```

위와 같이 단일 이벤트에 대해 한 개 이상의 Event Handler가 존재하는 경우,  
이들은 **순차적으로 실행된다.** 여기서 순차적이라 함은, 무엇이 먼저 실행될지는 모르지만  
하나의 Evnet Handler가 실행된 후 다음의 Event Handler가 실행된다는 것을 의미한다.

이 때, 특정 Evnet Handler가 먼저 실행되도록 하고 싶은 경우에는 해당 Evnet Handler에   
`@Order(Ordered.HIGHEST_PRECEDENCE)` Annotation을 추가하면 된다.

추가적으로, Evnet Handler를 비동기적으로 처리하고 싶다면 `@Async` Annotation을 추가하면 되는데,  
비동기 처리를 활성화하기 위해서는 `@SpringBootApplication` Annotation이 추가되어 있는 위치에  
`@EnableAsync` Annotation을 추가적으로 적용해 주어야 한다.


## Spring 기본 제공 Event

Spring Framework는 기본적으로 AppicationContext와 관련된 이벤트를 제공하고 있으며,  
`ContextRefreshedEvent, ContextStartedEvent, ContextStoppedEvent, ContextClosedEvent` 등이 존재한다.

이러한 기본 Event를 처리하기 위한 Event Handler는 다음과 같이 작성할 수 있다.

```
@Component
public class EventHandler {

    @EventListener
    public eventHandler(ContextRefreshedEvent event) {
        // Spring 기본 제공 Event는 AppicationContext를 가져올 수 있다.
        var appicationContext = event.getAppicationContext()
    }
} 
```