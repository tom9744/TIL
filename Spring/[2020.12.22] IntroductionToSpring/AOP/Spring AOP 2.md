# AOP (Aspect Oriented Programming)

예를 들어, 1000개의 메서드가 존재하는 프로젝트에서 각각의 매서드의 수행 시간을 측정하고자 한다.

- 하지만, 시간을 측정하는 기능 자체는 **핵심 관심 사항(Core Concern)**이 아니다.
- 시간을 측정하는 로직은 **공통 관심 사항(Cross-Cutting Concern)**이다.

이 때, 수행 시간 측정과 관련된 코드를 1000개의 메서드에 각각 추가하면 다음과 같은 문제가 발생한다. 

- 시간을 측정하는 로직과 핵심 비즈니스 로직이 섞여 **유지보수가 어렵다.**
- 시간을 측정하는 로직이 굉장히 복잡한 경우, 별도의 **공통 로직으로 만들기는 매우 어렵다.**
- 시간을 측정하는 로직을 변경할 때, **1000개의 메서드를 모두 찾아가 변경**해야 한다.

이와 같은 상황에서 AOP 개념이 적용되면, 이러한 문제를 손쉽게 해결할 수 있다.

AOP는 쉽게 말하면 **공통 관심 사항**과 **핵심 관심 사항**을 분리하는 것이다.  
즉, **공통 관심 사항**과 관련된 코드를 한 곳에 모으고 필요로 하는 곳에 적용하는 것이다.

## AOP 사용 방법

공통 관심 사항을 모아놓기 위한 클래스를 하나 생성하고, 다음과 같이 코딩한다.

```
@Aspect
@Component
public class TimeTeaceAop {
	
	@Around()
	// AOP Manual을 따라 작성한다.
	public Object execute(ProceedingJointPoint jointPoint) throw Throwable {
		long startTime = System.currentTimeMillis();

		try {
			return joinPoint.proceed();  // 다음 메서드로 진행
		} finally {
			long finishTime = System.currentTimeMillis();
			long timeMs = finishTime - startTime;
		}
	}
}
```

이후 위의 클래스를 Bean으로 등록해 주어야 하는데, 클래스에 `@Component` Annotation을 추가해  
Component Scan에 의해 등록해도 되고, 또는 다음과 같이 자바 설정 파일에서 직접 Bean으로 등록해도 된다.

```
@Configuration
public class SpringConfig {
	@Bean
	public TimeTraceAop timeTraceAop() {
		return new TimeTraceAop();
	}
}
```

마지막으로, 해당 공통 관심 사항과 관련된 코드를 적용할 대상을 지정해 주어야 하는데,  
이는 `@Around` Annotation을 통해 지정할 수 있다.

```
@Around("execution(* hello.hellospriong..*(..))")

@Around("execution(* 패키지명.하위패키지명.클래스명(파라미터 타입))")
```

## AOP 사용의 이점

- 핵심 관심 사항과 시간을 측정하는 **공통 관심 사항을 분리**한다.
- 시간을 측정하는 로직을 **별도의 공통 로직**으로 만들었다.
- 핵심 관심 사항을 **깔끔하게 독립적으로 유지**한다.
- 변경이 필요한 경우, **공통 로직 하나만 수정**하면 전체에 반영된다.
- 공롱 관심 사항과 관련된 로직을 **원하는 적용 대상을 유동적으로 변경**할 수 있다.