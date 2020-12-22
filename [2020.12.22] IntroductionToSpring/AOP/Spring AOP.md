# AOP (Aspect Oriented Programming)

## AOP 개념

Spring Framework는 크게 IoC, AOP, PSA 세 가지의 개념 제공하며, 이들을 Spring Triangle이라고 부른다.

AOP(Aspect Oriented Programming)를 한국어로 직역하자면 '관점지향 프로그래밍'인데,
다음의 예제를 살펴 보면서 보다 쉽게 이해해 보도록 하겠다.

```
// 동일한 기능을 수행하지만, 출력하는 메세지 다른 메소드 A, B, C.
class ExampleOne {
	public void methodA () {
		functionA
		안녕하세요, 양준영입니다.
		functionB
	}

	public void methodB () {
		functionA
		지금 Spring AOP를 공부하고 있습니다.
		functionB
	}
}

class ExampleTwo {
	public void methodC () {
		functionA
		빨리 개발을 하고 싶네요.
		functionB
	}
}
```

위와 같은 상황에서 메서드의 기능에 변경사항이 발생하여 수정해야 한다면,  
메서드 A, B, C를 하나씩 찾아서 기능을 변경해 주어야하며 이는 굉장히 번거롭고 일종의 **코드 스멜**이다.

따라서, 이렇게 중복되는 메서드의 기능을 별도로 뽑아내는 **메서드 추출**을 수행해 코드를 다음과 같이 **리팩토링**한다.

```
class ExampleOne {
	public void methodA () {
		안녕하세요, 양준영입니다.
	}

	public void methodB () {
		지금 Spring AOP를 공부하고 있습니다.
	}
}

class ExampleTwo {
	public void methodC () {
		빨리 개발을 하고 싶네요.
	}
}

// 중복되는 메서드를 추출하여 별도로 생성한다.
class Utils {
	public void functions (JoinPoint point) {
		functionA
		point.execute();
		functionB
	}
}
```

위와 같은 형태의 코드에서는 기능에 변경사항이 발생하여 수정하는 경우,  
Utils 클래스에 있는 메서드 하나만 수정해주면 해당 메서드를 사용하는 모든 클래스에 변경사항이 반영된다.

이렇게 중복되는 기능을 별도의 클래스로 추출하는 것은 Aspect Oriented Programming이다.


## AOP 구현 방법

특정 클래스의 메서드 A, B, C에 대해 StopWatch를 사용해 실행시간을 측정하려고 할 때,
모든 메서드에 대해 아래의 코드를 작성하는 것은 AOP가 아니다.

```
StopWatch stopWatch = new StopWatch();
stopwatch.start();

---- 특정 기능 ----

stopwatch.stop();
stopwatch.prettyPrint();
```

위와 같은 코드가 실제 메서드 코드에는 포함되지 않지만 각 메서드에 대해 실행되도록 하는 것이 AOP이며,  
이를 구현하기 위한 방법에는 아래와 같은 세 가지 방법이 존재한다.

1. 컴파일 (AspectJ Compiler)

프로그래머가 작성한 example.java 파일을 컴파일하여 example.class 파일로 컴파일 할 때,  
중간에서 위의 코드가 들어간 것 처럼 컴파일 해주는 방식으로 AOP를 구현한다.

2. 바이트코드 조작

example.java 파일이 컴파일 되어 example.class 파일이 생성되고, 이러한 .class 파일을 런타임 환경에서 사용하게 된다. 
이 때, .class 파일에서 클래스를 읽어와 메모리로 올리는 Class Loader에 옵션을 추가하여 위와 같은 기능을 수행하는 바이트코드를 추가해 AOP를 구현한다.

결과적으로 .class 파일에 존재하는 메서드 코드와 메모리에 올라간 메서드 코드가 다르게 된다.

3. **프록시 패턴 (Spring AOP가 사용하는 방법)**

![Proxy Patter](./ProxyPatternDiagram.png)

프록시 패턴이란 위의 그림과 같이 실제 기능을 수행하는 객체(Real Object) 대신 가상의 객체(Proxy Object)를 사용해  
로직의 흐름을 제어하는 디자인 패턴이다. Spring Framework에서는 이와 같은 프록시 패턴을 이용해 AOP를 구현한다.

예제 코드는 다음과 같다.

**Interface**  
```
public interface Payment {
	void pay(int price);
}
```

**Client**  
```
public class Store {

	Payment payment;

	// 생성자를 통한 Dependency Injection
	public Store(Payment payment) {
		this.payment = payment;
	}

	public void buySomething() {
		payment.pay(100);
	}
}
```

**Real Obejct**  
```
public class Cash implements Payment {
	@Override
	public void pay(int price) {
		System.out.println(price + " 현금 결제");
	}
}
```

**Proxy Obejct**  
```
public class CreditCard implements Payment {

	Payment cash = new Cash();

	@Override
	public void pay(int price) {
		System.out.println(price + " 카드 결제");

		if(한도 초과) {
			cash.pay(price);
		}
	}
}
```

위와 같은 예제에서 Client인 Store Class는 계속해서 Payment라는 Interface만 사용하지만,  
Client Class에서 Payment에 Cash가 아닌 CreditCard Class를 넣어주면, Cash Class에 대한 수정 없이  
Proxy Class인 CreditCard Class는 자체 로직에 의해 신용카드를 사용할지 현금을 사용할지 결정하게 된다.
