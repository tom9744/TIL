# Component Scan

`@ComponentScan`은 Spring 3.1 버전부터 도입된 Annotation으로, 가장 중요한 설정은 'basePackages'이다.  

## 스캔 위치 설정

basePackages는 Component Scan을 수행해 **`@Component` Annotation을 탐색할 범위를 지정**한다.

basePackages 설정은 탐색을 수행할 패키지의 위치를 문자열로 받는데, 이것은 *Type Safe* 하지 못하므로  
basePackageClasses 설정을 사용해 오탈자 발생의 위험 없이 Component Scan의 범위를 지정할 수 있다.

신규 Spring Boot 프로젝트를 시작하면 프로젝트의 메인 클래스에 `@SpringBootApplication` Annotation이 적용되어 있는데,  
이 `@SpringBootApplication` Annotation은 `@ComponentScan` Annotation을 상속받고 있으며 대부분의 경우  
프로젝트의 메인 클래스가 존재하는 위치에 포함된 하위 패키지들을 대상으로 Component Scan을 수행하게 된다.

`@Repository, @Service, @Controller, @Configuration` Annotations는 **모두 `@Component` Annotation를**  
**상속 받고 있는 Annotations이기 때문에,  Component Scan의 대상에 포함**되어 Bean으로 등록되게 된다.

## Filter 설정

`@ComponentScan` Annotation을 사용한다고 해서 모든 Annotation을 처리해서 Bean으로 등록하지는 않는다.  
`excludeFilters, includeFilters`와 같은 설정을 사용해 특정 Annotation을 Scan 대상에서 제외하거나 포함할 수 있다.

```
@ComponentScan(excludeFilters = {
	@Filter(type = FilterType.CUSTOM,classes = {TypeExcludeFilter.class}), 
	@Filter(type = FilterType.CUSTOM,classes = {AutoConfigurationExcludeFilter.class})
}
```

위의 코드는 **Component Scanning의 대상에서 TypeExcludeFilter와 AutoConfigurationExcludeFilter를 제외**하도록 한다.

