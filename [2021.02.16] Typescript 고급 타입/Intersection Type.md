# `intersection` 타입

```
type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    dateStarted: Date;
};
```

위와 같은 두 개의 *사용자 정의 타입*을 병합하여 `Admin`과 `Employee` 타입에 속하는 데이터 타입을 모두 가지는 하나의 *사용자 정의 타입*으로 재정의 하고자 한다.

```
type PromotedEmployee = {
    name: string;
    dateStarted: Date;    
    privileges: string[]
};
```

물론 위와 같이 처음부터 다시 작성하여 사용할 수도 있겠지만, `Admin`과 `Employee` 타입에 (과장해서) 100개의 타입이 지정되어 있다고 한다면, 이는 굉장히 비효율적일 것이다.

이러한 상황에서 `intersection` 타입을 사용하면, **중복되는 데이터 타입에 대한 재정의 없이 기존에 존재하는 *사용자 정의 타입*을 병합**할 수 있다. 

```
type PromotedEmployee = Admin & Employee;

const employeeA: PromotedEmployee = {
    name: "Junyoung",
    dateStarted: new Date(),
    privileges: ["skip-work", "drink-coffee"]
};
```

<br>

## `interface` 상속과의 비교

위의 `intersection` 타입을 사용해 두 개의 *사용자 지정 타입*을 병합하는 예시는, 아래와 같이 `type` 대신 `interface`를 사용하고 **병합하여 만들고자 하는 새로운 `interface`에서 `extends` 예약어를 사용해 두 개의 `interface`를 상속받는 방식으로도 구현**할 수 있다. 

```
interface Admin = {
    name: string;
    privileges: string[];
};

interface Employee = {
    name: string;
    dateStarted: Date;
};

interface PromotedEmployee extends Admin, Employee {

}
```

하지만 `interface`를 상속받는 방법으로는 **`Object` 타입만 병합할 수 있다**는 한계점이 존재하며, `Object` 타입 이외의 타입을 병합하고자 한다면 `intersection` 타입을 사용해야 한다.

<br>

## `Object` 이외의 타입에 `intersection` 사용하기

```
type CustomTypeA = string | number;
type CustomTypeB = number | boolean;
```

위와 같이 두 개의 `Union` 타입이 존재할 때, 두 타입에 `&` 연산자를 사용해 `intersection` 타입으로 만들면 다음과 같은 결과가 나온다.

```
type Combined = CustomTypeA & CustomTypeB;  // number 타입
```

두 개의 `Obejct` 타입을 `intersection` 타입으로 만들면 **두 객체를 병합하는 결과**가 도출되었지만, `Union` 타입의 경우 **교집합을 구하는 결과**가 도출되었다.

즉, **`intersection` 타입을 어떤 타입에 적용하는가에 따라 그 결과가 달라진다.**