# Typescript에서 클래스 사용하기

Typescript는 C++, Java와 같은 객체지향 프로그래밍 언어에서 사용되는 클래스 개념을 보다 적극적으로 사용할 수 있도록 지원하고 있다. 참고로 Javascript도 ES6(ECMAScript 2015)부터 `class` 표현식을 지원하고 있다.

<br>

## 클래스 선언과 인스턴스 생성

```
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    };
};
```
<br>

### 클래스 선언

Typescript에서 클래스를 선언하기 위해서는 ES6 이상의 Javascript에 존재하는 `class` 표현식을 사용해 위의 코드와 같이 작성해야 한다.

자칫 `name: string;` 부분이 일반적인 객체와 헷갈릴 수 있지만, Javascript Object는 `Key-Value Pair`, 클래스 선언문은 `Name-Type Pair`라는 점에서 명확히 다르다.

또한, 클래스를 선언할 때 반드시 **생성자**라는 것을 클래스의 내부 메서드로 함께 선언해 주어야 하는데, 이는 클래스 기반의 새로운 **인스턴스**를 생성할 때 필요한 데이터를 초기화하기 위해 사용되는 특별한 메서드이다.

Typescript, Javascript 구분 없이 클래스의 생성자는 `constructor()` 예약어를 사용해 선언할 수 있으며, 매개변수로 전달받은 데이터를 이용해 **클래스 필드**를 초기화한다.  

[참고] 클래스 내부의 함수는 **메서드**라는 이름으로 구분해서 부른다.

<br>

### 인스턴스 생성

선언한 클래스를 기반으로 새로운 인스턴스를 생성하고자 한다면, 아래와 같이 Javascript에서 사용하던 방법 그대로 `new` 키워드를 사용하면 된다. 

```
const student = new Person("Junyoung", 25);
```

`new 클래스 이름()`과 같이 호출하면 클래스의 생성자가 호출되며, `new Person()`의 경우 생성자가 `name`과 `age`라는 두 개의 매개변수를 필요로 하기 때문에 이러한 데이터를 함께 전달해야 한다.

```
console.log(student);  // Person { name: "Junyoung", age: 25} (인스턴스)
```
<br>

### ES5로 컴파일

`tsconfig.json` 파일에서 `target` 옵션의 설정값을 `es5`로 지정한 경우, `class` 표현식이 ES6(ECMAScript 2015)부터 등장했기 때문에 컴파일 시 생성되는 Javascript 파일의 내용이 Typescript로 작성한 내용과 크게 달라지게 된다.

```
var Person = (function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    return Person;
}());
```

위의 코드는 ES6(ECMAScript 2015) 이전의 Javascript에서 클래스를 선언하기 위해 사용되던 방법으로, 실제로 이렇게 작성할 일은 거의 없겠지만 참고하기 위해 첨부한다.


