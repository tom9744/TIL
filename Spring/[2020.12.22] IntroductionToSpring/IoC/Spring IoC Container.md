# IoC Container

주어진 예제 프로젝트(PetClinic)에서는 ApplicaionContext 또는 BeanFactory라는 Spring이 제공하는 IoC Container 관련 코드를 확인하기 어렵다.
가장 핵심적인 클래스지만, 소스코드에서 직접 참조하여 사용하는 일이 거의 없기 때문이다.

IoC Container는 ApplicaionContext 또는 BeanFactory 중 하나를 사용하며, 본 강좌에서는 **BeanFactory를 상속 받는 ApplicaionContext**를 사용한다.

## IoC Container의 역할

IoC Container는 Spring이 Dependency Injection을 위해 관리하는 객체인 **Bean을 생성하고, Bean 사이의 의존성을 엮어주며, 이렇게 만들어진 Bean을 제공**해준다.

PetClinic 프로젝트에서는 OwnerController, PetController 등이 Bean으로 등록되어 있으며,
프로젝트에 존재하는 모든 클래스가 Bean으로 등록되어 관리되는 것은 아니다.
(Bean 등록 여부는 IntelliJ에서 **녹색 콩 아이콘**을 통해 확인할 수 있다.)

클래스를 Bean으로 등록하는 방법은 다양하지만, 하나의 예시로 다음과 같은 코드를 사용한다.

```
@Bean
public JCacheManagerCustomizer petclinicCacheConfigurationCustomizer() {
	// JCacheManagerCustomizer 타입의 객체가 Bean으로 등록된다.
	return cm -> {
		cm.createCache("vets", cacheConfiguration());
	};
}
```

클래스가 Bean으로 등록되게 되면, IoC Container가 그러한 클래스들 사이의 의존성 주입을 자동으로 수행한다.
즉, **Bean으로 등록되지 않은 클래스나 객체에 대해서는 IoC Container가 의존성 주입을 할 수 없다.**

특정한 Bean에 접근하여 사용하고 싶은 경우, `ApplicationContext.getBeanDefinitionNames()` 메서드를 통해
현재 등록되어 있는 모든 Bean의 이름을 가져올 수 있고, 이 이름을 `ApplicationContext.getBean(String s)` 메서드의 매개변수로 사용해 Bean을 가져올 수 있다.
Bean의 이름이 아닌 타입으로도 가져올 수 있지만, 실제로 ApplicationContext을 이와 같이 직접 사용하는 일은 굉장히 드물다.


## Singleton Pattern

Spring이 제공하는 IoC Container는 Singleton Scope의 객체이다.
즉, 다수의 객체를 계속 생성하는 것(= Prototype)이 아니라, 하나의 객체를 Application 전반에서 재사용한다.

멀티 스레드 상황에서 Singleton Scope를 구현하는 것은 굉장히 까다로운 일인데,
이러한 것을 IoC Container를 사용하면 특별한 코드를 작성하지 않아도 손쉽게 Singleton Scope를 달성할 수 있게 된다.

```
public class Singleton {
	private static Singleton singleton = null;

	// 기본 생성자를 Private으로 설정해, 외부에서 생성할 수 없도록 한다.
	private Singleton() { } 

	// Singleton 인스턴스는 getInstance() 메서드를 통해서만 가능하며, 인스턴스가 단 하나만 존재하게 된다.
	public static Singleton getInstance() {
		if(singleton == null) {
			singleton = new Singleton();
		}
		return singleton;
	}
}
```

이와 같이 Singleton Pattern을 적용해 다수의 객체를 생성하는 대신 하나의 객체를 재활용하게 되면
메모리적으로 효율적이고, 런타임 상황에서의 성능 최적화에도 유리하게 된다.
