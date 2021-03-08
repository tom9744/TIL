# Java Persistence API (JPA)

JPA는 표준 인터페이스의 묶음으로, 다양한 벤더의 구현체(Hibernate 등...)를 통해 사용할 수 있다. 

- JPA는 기존 JDBC에서의 반복적인 코드는 물론, 기본적인 SQL Query도 만들어 실행해준다.  
- JPA를 사용하면, SQL과 데이터 중심의 설계에서 **객체 중심의 설계로 패러다임 전환**이 가능하다.  
- JPA를 사용하면 개발 생산성을 크게 높일 수 있다.  

## How to use

`build.gradle` 파일에 JPA 관련 라이브러리 종속성을 추가한다.  

```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly '데이터베이스 관련 설정'
}
```

JPA 라이브러리 `spring-boot-starter-data-jpa`는 내부에 **JDBC 관련 라이브러리를 포함**한다.  
이후, 기존에 작성한 Table을 그대로 사용하기 위해 `application.properties` 파일에서  
JPA와 관련된 Property를 몇가지 다음과 같이 추가해 주어야 한다.

```
spring.jpa.show-sql=true            // JPA가 생성한 SQL Query 표시
spring.jpa.hibernate.ddl-auto=none  // JPA가 객체를 기반으로 Data Table을 생성하지 않도록 설정
```

## ORM (Object Relational Mapping)

ORM은 **객체와 관계형 데이터베이스의 테이블을 연결해주는 것**을 의미한다.  

특정 클래스에 `javax.persistence`에 포함된 `@Entity` Annotation을 사용하면 해당 클래스는  
JPA의 관리를 받는 Entity로 등록되게 된다.

Entity 내부에서 특정 필드에 `@Id` Annotation을 통해 Primary Key로 지정할 수 있다.
또한, Query를 통해 값을 전달하지 않아도 데이터베이스에서 자동으로 값을 생성해 추가하도록 하는 것을 **Indentity Strategy**라고 부르며,  
`@GeneratedValue(strategy = GenerationType.IDENTITY)` Annotation을 통해 설정할 수 있다.

데이터베이스 Table의 일반적인 Column에 포함되는 필드에는 `@Column(name = "Column Name")` Annotation을 추가하면 
해당 필드 변수가 데이터베이스 Table에 Mapping된다.

## JPA 사용 예시

JPA를 사용하기 위해서는 EntityManager에 대한 의존성을 주입 받아야 한다.

```
private final EntityManaber entityManager;

// Dependency Injection
public JpaRepository(EntityManager entityManager) {
    this.entityManager = entityManager;
}
```

예를 들어, Member 타입의 객체를 데이터베이스에 저장하는 메서드를 작성해보자.

```
@Override
public Member save(Member member) {
    // JPA가 알아서 Insert Query를 생성해 데이터베이스에 저장한다.
    entityManager.persist(member);  
    return member;
}

@Override
public Optional<Member> findById(Long id) {
    Member member = entityManager.find(Member.class, id);
    return Optional.ofNullable(member);
}

@Override
public Optional<Member> findByName(String name) {
    // JPQL이라는 객체지향 Query를 사용해야 한다.
    List<Member> result = entityManager.createQuery("select m from Member as m where m.name = :name", Member.class)
            .setParameter("name", name)
            .getResultList();

    return result.stream().findAny();
}

@Override
public Optional<Member> findByName(String name) {
    // JPQL Query - select member from Member as m
    List<Member> result = entityManager.createQuery("select m from Member as m", Member.class)
            .getResultList();    
    return result;
}
```

## JPQL

Primary Key로 등록되지 않은 Column을 대상으로 탐색을 하고자 하는 경우, JPQL Query를 사용해야 한다.  

보통의 SQL Qeury의 경우, **테이블을 대상으로** Query를 작성해 날린다.
JPA에서 사용하는 *JPQL*은 **Entity 클래스를 대상으로** Query를 날리는데, 이것이 SQL Query로 번역되게 된다.

```
entityManager.createQuery("select member from Member as member, Member.class")
```

위의 JPQL 코드는 Member Entity 클래스에 Query를 보내 해당 클래스의 객체 전체를 조회하는 Query이다.  
