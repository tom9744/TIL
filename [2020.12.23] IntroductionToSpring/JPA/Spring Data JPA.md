# Spring Data JPA

Spring Boot와 JPA만 사용해도 개발 생산성이 큰 폭으로 증가하지만, **Spring Data JPA**를 사용하면  
기존의 한계를 넘어 마치 마법처럼 **구현 클래스 없이 인터페이스만으로 개발이 가능**하다.
특히, 데이터 테이블과 관련된 기본적인 CRUD 기능도 Spring Data JPA가 모두 제공한다.

이와 같이 Spring Data JPA는 반복적으로 작성해야 했던 코드를 자동으로 생산하여 제공함으로써,  
개발자가 **핵심 비즈니스 로직 개발에 보다 집중**할 수 있도록 도와준다. 

관계형 데이터베이스를 사용하여 진행하는 실무 프로젝트에서 Spring Data JPA는 선택이 아닌 필수이다.

**주의 - Spring Data JPA는 JPA를 편리하게 사용할 수 있도록 도와주는 기술로서, JPA에 대한 기본적인 지식이 필요하다.**

## Spring Data JPA 사용법

Spring Data JPA를 사용할 때는, 클래스가 아닌 인터페이스를 생성하여 작성한다.

**참고 - Java Interface는 다중 상속이 가능하며, Interface 간의 상속은 implements가 아닌 extends를 사용한다.**

```
JpaRepository<Entity Class, PK Type>
public interface SpringDataJpaMemberRepository extends JpaRepository<Member, Long>, MemberRepository {

    @Override
    Optional<Member> findByName(String name);
}
```

Spring Data JPA는 `JpaRepository<>`를 상속 받는 인터페이스를 탐색하고,  
해당 **인터페이스에 대한 구현체를 자동으로 생성해 Bean으로 등록**한다.

이후 자바 설정 파일에서 다음과 같이 작성하면 의존성을 주입 받아 바로 사용할 수 있다. 

```
@Configuration
public class SpringConfig {
    private final MemberRepository memberRepository;

    @Autowired - 생략 가능
    public SpringConfig(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Bean
    public MemberService memberService() {
        return new MemberService(memberService);
    }
}
```

`SpringDataJpaMemberRepository`가 상속 받고 있는 `JpaRepository<>` 인터페이스는  
`findAll,  findAllById`과 같은 기능을 포함하고 있으며 추가적으로 `PagingAndSortingRepository`를 상속 받는다.

`PagingAndSortingRepository` 인터페이스는 페이징과 관련된 기능을 포함하고 있으며, 또한 `CrudRepository`를 상속 받는데,  
바로 이 `CrudRepository` 인터페이스에서 `save(), delete(), exists()`와 같은 CRUD 기능을 포함하고 있다.

즉, **`JpaRepository<>` 인터페이스는 대부분의 데이터에 공통적으로 적용되는 거의 모든 기능을 포함**하고 있으며,
이러한 기능은 Spring Data JPA에 의해 구현체가 자동으로 생성되어 제공되는 것이다.

추가적으로 `findByName`과 같이 Primary Key가 아닌 일반 Column을 기준으로 탐색을 수행하는 기능은 기본 제공되지 않지만,  

```
@Override
Optional<Member> findByName(String name);

@Override
Optional<Member> findByNameAndId(String name, Long id);
```

위와 같이 **일정한 규칙에 맞게 인터페이스 메서드의 이름을 작성해 추가하면 해당 기능을 별도의 구현 없이 추가**할 수 있다.
