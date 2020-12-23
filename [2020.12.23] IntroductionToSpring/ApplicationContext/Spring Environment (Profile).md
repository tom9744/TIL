# Spring Environment - Profile

ApplicationContext는 BeanFactory 인터페이스를 상속 받고 있지만, 그외의 다양한 기능도 수행한다.  

여기서는 ApplicationContext가 상속 받고있는 또 다른 인터페이스인  
EnvironmentCapable가 제공하는 주요기능 두 가지 중 **Profile** 기능을 살펴본다.

## Profile

Profile이란 Bean들의 묶음이며, **서비스에서 요구하는 다양한 환경에 대한 요구사항을 충족**하기 위한 것이다.

예를 들어, 어떠한 프로젝트에서 *테스트 환경*과 *배포 환경*을 별도로 구성해야 하는 경우,  
각각의 환경(Environment)은 필요로 하는 Bean들의 묶음이 서로 다를 수 있다.  
이러한 경우 Profile을 사용하여 **각 환경에서 사용하는 Bean들의 묶음을 정의**하여 이용할 수 있다.  

```
public interface EnvironmentCapable {
    Environment getEnvironment();
}
```

ApplicationContext는 위의 인터페이스를 상속 받아 구현하고 있으며, 다음과 같이 Environment를 가져올 수 있다.  

```
public class AppRunner implements ApplicationRunner {
    @Autowired
    ApplicationContext ctx;

    @Override
    public void run(ApplicationArguments args) thorws Exception {
        Environment environment = ctx.getEnvironment();
    } 
}
```

이렇게 불러온 Environment의 현재 Profile을 확인하기 위해서는 다음과 같은 메서드들을 사용할 수 있다.  

```
environment.getDefaultProfiles();  // 기본 환경 
environment.getActiveProfiles();   // 현재 활성화된 환경
```

## Profile의 정의

특정한 Bean에 Profile을 설정하기 위해서는 해당 클래스에 `@Profile("Profile Name")` Annotation을 추가하면 된다.  
예를 들어, 다음의 클래스는 **test Profile**에서만 등록되는 Bean을 정의하는 코드들이며,  
Environment의 현재 Profile이 Default로 지정되어 있는 경우 *BookRepository*에 대한 의존성을 주입받을 수 없다.

```
// 자바 설정 파일의 클래스에 Profile 정의
@Configuration
@Profile("test")
public class TestConfiguration {
    @Bean
    public BookRepository bookRepository() {
        return new TestBookRepository();
    }
}
```

```
// 자바 설정 파일의 메서드에 Profile 정의
@Configuration
public class TestConfiguration {
    @Bean 
    @Profile("test") 
    public BookRepository bookRepository() {
        return new TestBookRepository();
    }
}
```

```
// Bean 클래스 자체에 Profile 정의
@Repository
@Profile("test")
public class TestBookRepository implements BookRepository { 

}
```

Profile을 정의하기 위한 문자열을 `@Profile("!test")`과 같이 지정하면,  
**test Profile을 제외한 모든 Profile**에 대해 Bean이 등록되도록 할 수도 있다. 

## Profile의 설정

IntelliJ IDE의 Run/Debug Configurations 항목에서 *Active Profiles* 항목에 원하는 Profile의 이름을 입력하면 된다.  
IDE에서 이러한 설정을 할 수 없는 경우에는 *VM options*에 `-Dspring.profiles.active="test"`라는 옵션을 추가하면 된다.

