# Bean

**Ordinary Java Object**  
```
OwnerController ownerController = new OwnerController();
```

**Spring Bean Object**  
```
ApplicationContext applicationContext;
OwnerController bean = applicationContext.getBean(OwnerController.class);
```

Bean은 일반적인 객체와 다르지 않지만 IoC Container의 관리를 받는 다는 점에서 다르며,  
**오직 Bean 만이 IoC Container의 관리를 받을 수 있다.**

그렇다면 특정한 인스턴스를 어떻게 Bean으로 등록할 수 있을까?

## Bean을 등록하는 방법

### 1. Component Scanning

IoC Container를 생성하고 Bean을 등록할 때 사용하는 여러가지 Interface가 있는데, 이러한 Interface들을 **Life Cycle Callback**이라고 부른다.  
여러가지 Life Cycle Callback 중에는 이러한 `@Component` Annotation이 붙어있는 모든 클래스를 찾아서 그 클래스의 인스턴스를 생성해 Bean으로 등록하는 
**Annotation Processor**가 포함되어 있다. 

Spring Boot Project에서는 `@SpringBootApplication` Annotation 내부의 `@ComponentScan` Annotation이 **Component Annotation을 탐색할 범위를 지정**해준다. 

```
@SpringBootApplication
public class PetClinicApplication {
	public static void main(String args[]) {
		SpringApplication.run(PetClinicApplication.class, args);
	}
}
```

위의 코드는 `@SpringBootApplication`이 등록되어 있는 PetClinicApplication 클래스의 위치에서부터  
모든 하위 패키지에 포함된 모든 클래스 중 `@Component` Annotation이 붙어있는 클래스를 탐색해 Bean으로 등록하도록 한다.

`@Component` Annotation의 변형에는 `@Controller, @Repository, @Service, @Configuration` 등이 있으며,  
사용자의 기호에 따라 Custom Annotation도 생성 가능한다. (`@Controller` Annotation은  `@Component`라는 **Meta Annotation**을 사용한다.)


### 2. XML 또는 자바 설정 파일에서 직접 등록

최근에는 XML 파일을 사용하기보단, **자바 설정 파일**을 통해 Bean을 등록한다.
자바 설정 파일은 일반적인 .java 파일에 다음과 같은 코드를 작성하여 만들 수 있다.

```
@Configuration
public class SampleConfig {

	@Bean
	public SampleController sampleController() {
		return new SampleController();  // 객체를 직접 Bean으로 등록
	}
}
```

`@Configuration` Annotation 역시 `@Component`라는 **Meta Annotation**을 사용하기 때문에  
Component Scanning 과정에서 인식되며, 결과적으로 **설정 파일 내에 정의된 Bean들이 IoC Container에 등록**된다.


## Bean을 사용하는 방법

```
ApplicationContext applicationContext;
OwnerController bean = applicationContext.getBean(OwnerController.class);
```

위와 같이 ApplicationContext를 통해 Bean을 IoC Container에서 꺼내올 수도 있지만,  
더 많이 사용되는 방법은 `@Autowired` Annotation을 사용하는 것이다.

```
class OwnerController {
    private OwnerRepository owners;

	public OwnerController(OwnerRepository clinicService) {
		this.owners = clinicService;
	}
}
```

`@Autowired` Annotation을 사용하면 위의 코드처럼 생성자의 매개변수를 통해 의존성을 주입받는 대신  
아래의 코드처럼 IoC Container에서 의존성을 주입받아 사용할 수 있다.

```
class OwnerController {
	@Autowired 
    private OwnerRepository owners;  // Dependency Injection
}
```
