# Dependency Injection 

Spring Framework에서는 크게 세 가지의 방법으로 의존성을 주입할 수 있다.

1. 클래스 생성자
2. 클래스 필드
3. Setter

위의 세 가지 방법을 사용하기 위해 `@Autowired`라는 Annotation이 사용되며,  
필요한 의존 객체의 '타입'에 해당하는 Bean을 찾아 주입해준다.

## 1. 클래스 생성자

```
class OwnerController {
    private OwnerRepository owners;

	public OwnerController(OwnerRepository clinicService) {
		this.owners = clinicService;
	}
}
```

Spring 4.3 이전에는 생성자에도 `@Autowired` Annotation을 달아주어야 했지만,  
이후 버전부터 이러한 Annotation을 생략해도 동일한 기능을 수행하도록 변경되었다.

이렇게 생성자를 통해 의존성을 주입하는 경우, OwnerRepository가 Bean으로 등록되지 않았다면  
OwnerController 클래스의 인스턴스 생성 자체가 불가능하게 된다. 

## 2. 클래스 필드

```
class OwnerController {
	
	@Autowired
    private OwnerRepository owners;
}
```

클래스 필드 변수에 `@Autowired` Annotation을 달아주면, 생성자를 별도로 생성하지 않아도  
IoC Container에 존재하는 Bean을 자동으로 찾아 의존성을 주입해준다.

이 때, 예제 코드의 `OwnerRepository` 클래스가 Bean으로 등록되어 있지 않다면  
`NoSuchBeanDefinitionException` 예외가 발생하게 된다.

## 3. Setter
```
class OwnerController {
    private OwnerRepository owners;

	@Autowired
	public void setOwners(OwnerRepository owners) {
		this.owners = owners;
	} 
}
```

위와 같이 필드 변수에 대한 Setter에 `@Autowired` Annotation을 부착하는 방법을 사용해도  
앞의 두가지 방법과 완전히 동일한 기능을 수행한다. 

Setter를 사용하는 경우, OwnerController 자체의 Bean 객체는 생성할 수 있지만  
`@Autowired` Annotation의 존재로 인해 OwnerRepository 클래스에 대한 의존성을 주입하는 과정에서  
해당 OwnerRepository 클래스가 Bean으로 등록되어 있지 않다면 에러가 발생한다. 

따라서 이러한 의존성이 '필수'가 아닌 경우, Annotation을 `@Autowired(required = false)`로 설정하여  
의존 객체가 Bean으로 등록되어 있지 않더라도 OwnerRepository 클래스의 인스턴스가 생성되도록 할 수 있다.


## 그렇다면 가장 좋은 방법은?

의존성을 주입하는 가장 좋은 방법은 Spring Reference에서 지정하고 있는 **클래스 생성자를 이용하는 방법**이다.

그러한 이유는 이전에 학습한 것과 같이, 생성자를 통해 의존성을 주입하도록 강제하면 해당 클래스애서 필수적으로 사용해야 하는  
의존성 없이는 해당 클래스의 인스턴트 생성 자체를 수행할 수 없도록 막아버려 `NullPointException` 예외로부터 안전하기 때문이다.

클래스 필드 또는 Setter를 사용한 의존성 주입은, 의존성이 존재하지 않아도 인스턴스를 생성할 수 있다. 
이러한 단점이 특정한 상황에서는 장점으로 사용되기도 하기 때문에 종종 사용되기도 한다. 

예를 들어, 클래스 A → B → C와 같이 순환 참조인 경우 의존성 주입 방식을 전부 생성자 방식으로 설정하면 인스턴스가 생성되지 않는다.


## 특정 Bean Type에 해당하는 Bean이 여러개인 경우...

OwnerRepository를 Class가 아닌 Interface로 선언하고, 이를 구현하여 생성된 클래스  
MyRepository와 YourRepository가 존재하는 상황이라고 생각해보자. 

```
class OwnerController {
	
	@Autowired
    private OwnerRepository owners;

}
```

위와 같은 코드를 그대로 실행하게 되면 MyRepository와 YourRepository 중 어떠한 클래스를  
주입해야 하는지 모호하게 되어, 에러가 발생하게 된다.

이를 해결하기 위해서는 다음과 같은 방법을 사용할 수 있다.

**1. `@Primary` Annotation**
```
@Repository
@Primary
class YourRepository implements OwnerRepository {

}
```

우선적으로 의존성 주입 시 선택될 Class에 `@Primary` Annotation을 추가하여  
해당 Class가 의존성 주입을 위한 결정 시 우선권을 가지도록 한다.

**2. `@Qualifier` Annotation**
```
@Repository
class YourRepository implements OwnerRepository {

}
```

기본적으로 위와 같이 `@Repository` Annotation을 추가하면, Class의 이름인 YourRepository가  
**소문자로 시작하는 Camel Case로 변환되어 해당 Bean의 ID로 사용**된다.

```
class OwnerController {
	@Autowired @Qualifier("yourRepository")
    private OwnerRepository owners;
}
```

`@Qualifier` Annotation의 매개변수로 사용하고자 하는 Bean의 ID를 넘겨주면  
동일한 타입을 가지는 두 개 이상의 Bean 중 해당 ID를 가지는 Bean을 우선적으로 주입한다. 

**3. 해당 타입의 모든 Bean 주입 받기**

```
class OwnerController {
	@Autowired
    List<OwnerRepository> ownerRepositories;
}
```

위와 같이 OwnerRepository 타입의 List를 선언하는 방식을 사용하면  
OwnerRepository 타입을 가지는 모든 Bean을 받아오게 된다.  