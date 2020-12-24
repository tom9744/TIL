# DAO, DTO

## DAO(Data Access Object)

**Repository Package**

- 실제로 Database에 접근하는 객체이다.
- Service와 Database를 연결하는 고리의 역할을 수행한다.
- SQL Query를 작성해 Database에 접근하고 적절한 CRUD API를 제공한다.
    - JPA를 사용하여, JPQL Query를 사용할 수도 있다.
    - 또는 Spring Data JPA(`extends JpaRepository<T, T>`)를 사용하여, 기본 CRUD 기능을 제공받는다.

## DTO(Data Transfer Object)

**DTO Package**

- 계층 간 데이터 교환(Data Transfer)을 위한 객체(Java Bean)이다.
    - Database에서 데이터를 얻어 Service나 Controller 계층으로 전달할 때 사용된다.
    - 로직을 갖고 있지 않는 순수한 데이터 객체이며, Getter/**Setter** 메서드만 갖는다.

- Request와 Response용 DTO는 View를 위한 클래스이다.
    - 요구 변경에 따라 **자주 변경이 필요**하다.
    - `toEntity()` 메서드를 통해 *DTO 클래스*에서 필요한 부분만을 이용해 Entity로 만든다.
    - 또한, Controller 계층에서 Response DTO 형태로 Client에 전달한다.

DTO의 간략한 예시는 다음과 같다.  

```
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    @NotBlank
    @Pattern(regexp = "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$")
    private String email;

    @JsonIgnore
    @NotBlank
    @Size(min = 4, max = 15)
    private String password;

    @NotBlank
    @Size(min = 6, max = 10)
    private String name;

    public User toEntity() {
        return new User(email, password, name);
    }

    public User toEntityWithPasswordEncode(PasswordEncoder bCryptPasswordEncoder) {
        return new User(email, bCryptPasswordEncoder.encode(password), name);
    }
}
```

**참고** - VO(Value Object) vs. DTO  
VO는 DTO와 거의 동일한 개념이지만, **read only 속성**을 갖는다.
