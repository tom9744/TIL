# Spring API - Repository.java

PostsRepository.java
```
public interface PostsRepository extends JpaRepository<Posts, Long>{

}
```

MyBatis 등에서 **DAO(Data Access Object)**라고 불리는 DB Layer 접근자이며,  
JPA에서는 *Repository*라고 부르며 위의 코드와 같이 **인터페이스**로 생성하면 된다.

단순히 인터페이스를 하나 생성하고 `extends JpaRepository<Entity Class, PK Type>`을 상속하면  
기본적인 CRUD 메서드가 자동으로 생성되어 제공되며, 이는 순수한 JPA가 아닌 **Spring Data JPA에서 지원하는 기능**이다. 

