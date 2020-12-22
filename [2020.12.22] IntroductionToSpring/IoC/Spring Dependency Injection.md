# Dependency Injection 

Spring Framework에서는 크게 세 가지의 방법으로 의존성을 주입할 수 있다.

1. 클래스 생성자
2. 클래스 필드
3. Setter

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
앞의 두가지 방법과 완전히 동일한 기능을 수행하게 된다.

## 그렇다면 가장 좋은 방법은?

의존성을 주입하는 가장 좋은 방법은 Spring Reference에서 지정한 **클래스 생성자를 이용하는 방법**이다.

그러한 이유는 이전에 학습한 것과 같이, 생성자를 통해 의존성을 주입하도록 강제하면 해당 클래스애서 필수적으로 사용해야 하는  
의존성 없이는 해당 클래스의 인스턴트 생성 자체를 수행할 수 없도록 막아버려 `NullPointException` 예외로부터 안전하기 때문이다.

클래스 필드 또는 Setter를 사용한 의존성 주입은, 의존성이 존재하지 않아도 인스턴스를 생성할 수 있다. 
이러한 단점이 특정한 상황에서는 장점으로 사용되기도 하기 때문에 종종 사용되기도 한다. 

예를 들어, 클래스 A → B → C와 같이 순환 참조인 경우 의존성 주입 방식을 전부 생성자 방식으로 설정하면 인스턴스가 생성되지 않는다.



