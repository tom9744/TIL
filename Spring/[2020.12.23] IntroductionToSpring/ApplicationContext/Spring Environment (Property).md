# Spring Environment - Property

Spring Application에 등록되어 있는 여러가지 `key-value` 쌍으로 제공되는  
Property에 접근할 수 있는 기능에 대해 알아보겠다.

Spring은 Application에 등록된 Properties에 계층형으로 접근하며,  
이는 Property가 제공된 Source에 따라 상이한 우선순위를 가진다는 것을 의미한다.  

Priority of Properties
    1. ServletConfig 매개변수
    2. ServletContext 매개변수
    3. JNDI - java:comp/env/
    4. JVM System Property - -Dkey="value"
    5. JVM System 환경변수 - 운영체제 환경변수

이러한 Property는 `@SpringBootApplication` Annotation이 존재하는 어플리케이션 메인 클래스에  
`@PropertySource` Annotation을 추가하면 등록할 수 있다.
