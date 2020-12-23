# MessageSource

ApplicationContext의 MessageSource 인터페이스는 **국제화 기능 (i18n)을 제공**하는 인터페이스이다.
이러한 국제화 기능을 제공할 메세지들은 Property로 사전에 정의되어야 하며, 방법은 다음과 같다.

## Message 정의

Spring Boot 프로젝트의 `resource` 디렉토리에 `messages.properties, messages_ko_KR.properties` 파일을 생성한다.

이후, `messages.properties` 파일에 `greeting=Hello {0}`과 같이 작성하고  
이어서 `messages_ko_KR.properties` 파일에 `greeting=안녕, {0}`과 같이 작성하면  
Spring Boot가 이러한 Property 파일을 자동으로 읽어서, 해당 내용을 MessageSource에 추가해준다.


## Message 사용

```
public class AppRunner implements ApplicationRunner {

    @Autowired
    MessageSource messageSource;

    @Override
    public void run(ApplicationArguments args) thorws Exception {
        // Key, Argument, Locale 설정
        messageSource.getMessage("greeting", new String[]{"Junyoung"}, Locale.getDefault());  // English
        messageSource.getMessage("greeting", new String[]{"Junyoung"}, Locale.KOREA);    // Korean
    } 
}
```

기본의 Spring에서는 `messages.properties`을 읽어주는 `ResourceBundleMessageSource`를 Bean으로 등록해 주어야 했지만,  
Spring Boot에서는 별도의 설정이 없어도 `ResourceBundleMessageSource`가 Bean으로 등록되어 `messages.properties`을 읽어온다.

## Reloadable Message

```
@SpringBootApplication
public class DemoProject {
    public static void main(String[] args) {
        SpringApplication.run(DemoProject.class, args);
    }

    /**
     *  Spring Boot 기본 설정(ResourceBundleMessageSource) 변경
     *  이 때, Bean의 이름은 반드시 MessageSource가 되어야 한다.
     */ 
    @Bean
    public MessageSource messageSource() {
        var messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:/messages");
        messageSource.setDefaultEncoding("UTF-8");  // 한글이 깨지지 않도록 Encoding 설정
        messageSource.setCacheSeconds(3);  // Resource를 Cache에 보관하는 시간: 최대 3초
        return messageSource;
    }
}
```

```
public class AppRunner implements ApplicationRunner {

    @Autowired
    MessageSource messageSource;

    @Override
    public void run(ApplicationArguments args) thorws Exception {
        while(ture) {
            messageSource.getMessage("greeting", new String[]{"Junyoung"}, Locale.KOREA);    
            Thread.sleep(1000l);    // 1초마다 출력
        }
    } 
}
```

Spring Boot의 기본 설정인 `ResourceBundleMessageSource`를 `ReloadableResourceBundleMessageSource`로  
변경해 수동으로 Bean으로 등록해주면, 어플리케이션이 운영중에 있더라도 Message를 변경해 빌드하면 즉시 반영할 수 있다.