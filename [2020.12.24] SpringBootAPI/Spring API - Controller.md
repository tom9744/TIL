# Spring API - Repository.java

```
@RestController
public class WebRestController {

    private PostsRepository postsRepository;

    public WebRestController(PostsRepository postsRepository) {
        this.postsRepository = postsRepository;
    }

    @GetMapping("/hello")
    public String hello() {
        return "HelloWorld";
    }

    @PostMapping("/posts")
    public void savePosts(@RequestBody PostsSaveRequestDto dto){
        postsRepository.save(dto.toEntity());
    }
}
```

위의 코드처럼 특정 클래스에 `@RestController`를 추가하면 해당 Annotation이 등록된  
**클래스의 모든 메서드에 `@ResponseBody` Annotation을 자동으로 적용**해준다. 

기본적으로 `@Controller` Annotation이 등록된 클래스는 각 URL에 대한 GET, POST Mapping을 수행하며  
해당 URL로 클라이언트가 접근하면 메서드가 반환하는 문자열과 일치하는 Template HTML을 찾아서 브라우저로 보내준다.

하지만 `@ResponseBody` Annotation이 등록되어 있는 메서드는 반환하는 문자열 또는 객체를  
**JSON의 형태로 변환하고 HTTP Response의 Body에 추가하여 클라이언트 측으로 전송**해준다.

## DTO(Data Transfer Object)의 사용

```
@PostMapping("/posts")
public void savePosts(@RequestBody PostsSaveRequestDto dto){
    postsRepository.save(dto.toEntity());
}
```

앞의 코드에서 `/posts` URL에 대한 HTTP POST Request를 매핑하는 메서드를 확인하면,  
클라이언트로부터 @RequestBody를 통해 **전달 받은 데이터에 대해 *Entity 클래스*를 직접 사용하지 않고**   
`PostsSaveRequestDto`라는 ***DTO 클래스*를 별도로 생성해 사용**하고 있는 것을 볼 수 있다.

```
@Getter
@Setter
@NoArgsConstructor
public class PostsSaveRequestDto {

    private String title;
    private String content;
    private String author;

    public Posts toEntity(){
        return Posts.builder()
                .title(title)
                .content(content)
                .author(author)
                .build();
    }
}
```

*DTO 클래스*는 *Entity 클래스*와 비슷하지만 **`@Setter` Annotation을 사용하고 있다**는 점에서 다르다.

*DTO 클래스*에서 Setter 메서드를 이용하는 이유는, 외부에서 `@RequestBody`로 전달 받은 데이터의 경우  
**기본 생성자 또는 Setter 메서드를 통해서만 값이 할당**될 수 있기 때문이다.

**주의**
절대로 데이터베이스 테이블과 매핑되는 ***Entity 클래스*를 Request/ Response 클래스로 직접 사용해서는 안된다.**
그 이유는 *Entity 클래스*가 **가장 중심적인 클래스**이기 때문에 **변경되면 여러 클래스에 영향**을 끼치게 되는데  
Request와 Response를 처리하기 위한 *DTO 클래스*는 View를 위한 클래스라 변경이 굉장히 잦기 때문이다.



