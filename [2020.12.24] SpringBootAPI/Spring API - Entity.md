# SpringBoot & JPA로 간단한 API 만들기 정리

```
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class Posts {

    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String author;

    @Builder
    public Posts(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}
```

위의 Posts 클래스는 **ORM 기술에 의해 실제 DB의 테이블과 매칭될 클래스**이며 보통 *Entity 클래스*라고도 한다.
JPA를 사용하여 개발자는 직접 SQL Query를 작성하지 않아도 Entity 클래스 수정을 통해 작업을 수행할 수 있다.

## JPA Annotations

JPA에서 제공하는 몇 가지 Annotations를 살펴보자.

- `@Entity` 
    - 데이터베이스 테이블과 매핑될 클래스임을 나타낸다.
    - 언더스코어 네이밍(_)을 통해 이름을 매핑한다. 
- `@Id`
    - 해당 데이터베이스 테이블의 Primary Key 필드로 지정한다.
    - Spring에서는 주로 Long Type 정수를 사용하며, MYSQL의 bigint Type이 된다.
- `@GeneratedValue`
    - `@Id`로 지정한 Primary Key가 생성되는 규칙을 나타낸다.
    - 기본 값은 AUTO로, MySQL의 auto_increment와 같이 자동 증가하는 정수형 값을 가진다.
- `@Column`
    - 데이터베이스 Column을 나타내며, 굳이 Annotation을 추가하지 않아도 PK 필드를 제외한 모든 필드는 Column이 된다.
    - 기본값 외에 추가로 변경이 필요한 옵션이 있을경우 `@Column` Annotation을 사용하면 된다.


## Lombok?

Lombok은 클래스에 기본적인 생성자, Setter, Getter 등을 자동으로 생성해주는 라이브러리이다.  

초기 작업 과정에서 데이터베이스의 테이블 설계(또는 Entity 클래스 설계)가 빈번하게 변경되는데,  
이때 Lombok의 Annotations를 사용하면 설계 수정 시 코드 변경량을 최소화시켜주기 때문에 아주 편리하다.

기본적인 Annotations는 다음과 같다.

- `@NoArgsConstructor`
    - 기본 생성자를 자동으로 추가한다.
    - access = AccessLevel.PROTECTED : 기본생성자의 접근 권한을 protected로 설정한다.
    - 즉, protected Posts() { ... }와 같은 생성자를 만들어준다.
    - Entity 클래스를 **프로젝트 코드상에서 기본생성자로 생성하는 것은 제한**하되,  
      **JPA에서 Entity 클래스를 생성하는 것은 허용**하기 위해 추가한다.
- `@Getter`
    - 클래스 내의 모든 필드에 대해 Getter 메서드를 자동으로 생성한다.
- `@Builder`
    - 해당 클래스의 *Builder Pattern 클래스*를 생성한다.  
    - 생성자 상단에 선언시, 생성자에 포함된 필드만 Builder에 포함한다.

**주의**
Entity 클래스를 생성할 때, 무분별하게 `@Setter` Anntation을 사용해 Setter 메서드를 생성하면 안된다.

Java Bean 규약에서 **클래스 Propertry(변수)에 대한 접근은 Getter/Setter로 수행한다**라고 정의하고 있지만,  
이렇게 하면 **해당 클래스의 인스턴스 값이 언제 어디서 변하는지 코드상으로 명확히 구분할 수 없어** 유지보수가 어려워진다.

Entity 클래스에서는 일반적인 `setSomething()`과 같은 Setter 대신,  
해당 **필드의 값 변경이 필요한 명확한 목적과 의도를 나타낼 수 있는 메서드 이름**을 사용해야만 한다.

```
public class Order{
    private boolean status;

    // Setter가 호출되는 명확한 이유를 알 수 없음
    public void setStatus(boolean status){
        this.status = status
    }

    // 필드의 값이 변경되는 이유를 명확히 알 수 있음
    public void cancelOrder(){
        this.status = false;
    }
}
```

## Builder Pattern?

데이터베이스에 데이터를 저장하기 위해서는 Entity 클래스의 인스턴스를 생성하고 각 필드 변수에 값을 채워 Insert 한다.

하지만, 기본 생성자가 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 통해 protected로 설정되어 있고  
필드 변수에 대한 Setter 메서드도 존재하지 않는 상황에서 Entity 클래스의 인스턴스를 어떻게 생성할 수 있는가?

이때 사용되는 것이 `@Builder` Annotation을 통해 생성한 *Builder 클래스*이다.  

생성자 또는 Builder 모두 생성 시점에 값을 채워주는 역할은 똑같지만,  
**생성자의 경우 생성 시점에서 필드에 어떤 값이 채워지는지 명확히 지정할 수 없다.**  

```
public ExampleConstructor(String strA, String strB){
    this.strA = strA;
    this.strB = strB;
}
```

예를 들어, 위와 같은 생성자는 **각각의 매개변수에 들어가는 값이 무엇인지 특정할 수 없다.**
즉, 개발자가 `new ExampleConstructor(strB, strA)`와 같이 두 변수의 위치를 바꿔도 문제를 발견할 수 없다.

하지만 Builder 클래스를 사용하면 다음과 같이 **각 필드에 어떤 값이 채워지는지 명확하게 표시**할 수 있다.

```
ExampleBuilder.builder()
    .strA(strA)
    .strB(strB)
    .build();    
```

