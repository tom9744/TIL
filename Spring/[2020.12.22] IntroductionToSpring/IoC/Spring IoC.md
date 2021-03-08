# Inversion of Control (제어권 역전)

Inversion of Control은 의존 관계 주입(Dependency Injection)이라고도 하며, 어떤 객체가 사용하는  
**의존 객체를 직접 만들어 사용하는 것이 아니라, 외부로부터 주입 받아 사용하는 방법**을 말한다.

Spring Sample Project인 **PetClinic**의 OwnerController 클래스를 확인하면, 다음과 같은 코드가 존재한다.

```
class OwnerController {
    private OwnerRepository owners;
	private VisitRepository visits;

	public OwnerController(OwnerRepository clinicService, VisitRepository visits) {
		this.owners = clinicService;
		this.visits = visits;
	}
}
```

보통의 경우 하나의 클래스와 연관된 다른 클래스에 대한 참조(Reference)를 해당 클래스에서 객체를 생성하는 방식으로 생성한다.
이때 자신이 사용할 의존성(Dependency)을 다음의 코드와 같이 스스로 만들어서 사용하고 관리한다.

```
class OwnerController {
	private OwnerRepository owners = new OwnerRepository();  // 인스턴스 생성
}
```

**의존성에 대한 제어권이 역전되었다**는 것은, 위와 같이 해당 클래스에서 제어권을 스스로 생성하지 않고
누군가가 **클래스 외부에서 의존성을 주입(Dependency Injection)해 준다**는 것을 의미한다.
즉, 더 이상 의존성에 대한 생성과 관리를 해당 클래스에서 직접 수행하지 않게 되고, 이것을 제어권의 역전(IoC)이라고 부른다.

위의 코드를 통상의 Java 코드라고 생각하고 실행하는 경우, 현재 `owner` 객체가 비어있기 때문에
이후의 코드에서 `owner`를 호출하거나 내부 메서드를 사용하려고 하면 `NullPointException`이 발생하게 된다. 

하지만, **코드를 다음과 같이 수정하면  `NullPointException`이 발생하지 않도록 할 수 있다.**

```
class OwnerController {
    private OwnerRepository owners;

	public OwnerController(OwnerRepository clinicService) {
		this.owners = clinicService;
	}
}
```

이는, `OwnerController` 클래스의 생성자가 하나만 존재하는 상황에서 인스턴스를 생성하려면
다음의 코드처럼 반드시 매개변수로 `OwnerRepository`의 객체가 주어져야 하기 때문이다.
즉, **`OwnerController` 클래스의 인스턴스가 생성되었다면, 반드시 `OwnerRepository`의 객체를 가지고 있게 된다.**
 
```
@Test
public void testOwner() {
    // 의존성을 외부에서 생성하고 클래스 생성자의 매개변수로 전달한다. (Dependency Injection)
    OwnerRepository exampleOwnerRepository = new OwnerRepository();
    OwnerController exampleOwnerController = new OwnerController(exampleOwnerRepository);
}
```

이와 같이 Inversion of Control을 적용하는 이유는, 해당 클래스가 의존하고 있는 클래스의 인스턴스가 주어지지 않으면
클래스의 인스턴스 생성 자체를 할 수 없도록 함으로써 **클래스 내부의 코드들이 `NullPointException`으로부터 안전**하게 하기 위해서이다.

이러한 의존성에 대한 주입은 `@MockBean` - Mock 객체를 생성해 Bean으로 등록해주는 - Annotation을 붙여서 수행 되지만, 
이에 대해서는 다음에 별도로 공부하기로 한다. 

[참고] Bean은 Spring이 관리하는 객체이며, 예를 들어 OwnerController 인스턴스를 생성할 때
Spring의 IoC Container가 OwnerController Type을 가지는 Bean을 찾아 OwnerController 클래스 생성자의 매개변수로 주입하게 된다.











