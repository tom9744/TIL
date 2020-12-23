# ResourceLoader

`ApplicationContext extends ResourceLoader`

ResourceLoader는 인터페이스의 이름이 암시하듯, 리소스를 읽어오는 기능을 제공한다.

```
@Component
public class AppRunner implements ApplicationRunner {

    // Best Practice
    @Autowired
    ResourceLoader resourceLoader;  // 최대한 구체적인 인터페이스를 사용하는 것이 좋다.

    // Not Recommended
    @Autowired
    ApplicationContext resourceLoader; 

    @Override
    public void run(ApplicationArguments args) thorws Exception {
        Resource resource = resourceLoader.getResource("classpath:test.txt");
        System.out.println(resource.exists());  // 리소스 존재 여부 출력
    } 
}
```

위의 코드에서 `resourceLoader.getResource("classpath:test.txt");` 부분을 확인해보면 리소스의 위치로  
`classpath:...`라는 문자열을 사용하는데, 빌드 시 생성되는 `target-classes` 폴더의 위치를 의미한다.



