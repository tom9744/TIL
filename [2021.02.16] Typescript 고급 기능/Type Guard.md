# Type Guard (타입 가드)

## Type Guard란?

```
type UnionTypeA = string | number;
```

`Union` 타입은 타입 지정에 대한 유연성 보장하여 사용편리성을 제공하지만, 아래의 예시와 같이 함수 등을 호출하여 사용할 때 `UnionTypeA` 타입으로 지정된 변수가 **`string`과 `number` 중 정확히 어떤 타입의 데이터인지 확인해야 하는 경우**가 있다.

```
function someFunction(input: UnionTypeA) {
    if (typeof input === "string") {
        return input.length;
    }
    else if (typeof input === "number") {
        return input + input;
    }
}
```

이와 같이 함수가 여러개의 타입을 가질 수 있는 `Union` 타입 변수를 매개변수로 받으며, 변수의 타입에 따라 수행하는 로직이 상이한 경우 반드시 타입을 검증해 주어야 한다.

위의 코드에서는 `if (typeof input === "string")`를 통해 타입을 검증하고 있으며, **변수의 타입을 검증하는 역할을 수행하는 코드**를 *Type Guard*라고 부른다.

<br>

## `typeof`의 한계

`typeof`는 Javascript에서 제공하는 예약어이며, **컴파일타임이 아닌 런타임에서 실행**된다. 또한 `string`, `number`, `boolean`과 같은 **기본적인 Javascript 타입에 대한 검증만 가능**하다는 한계를 가지고 있다.

따라서 아래와 같이 `type`을 통해 생성된 **사용자 지정 `object` 타입은 검증할 수 없다.** 

```
type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    dateStarted: Date;
};

type UnknownEmployee = Employee | Admin;
```

`UnknownEmployee`은 `Employee` 타입과 `Admin` 타입 둘 중 하나가 될 수 있는 `Union` 타입이다. 만약 `UnknownEmployee` 타입의 변수를 사용하는 함수에서 변수가 **`Employee` 타입인 경우와 `Admin` 타입인 경우 서로 다른 로직을 수행해야 한다면, `typeof`는 사용할 수 없다.**

```
function printEmployeeInfo(employee: UnknownEmployee) {
    if (typeof employee === "Employee") { ... }     // 컴파일 에러!
}
```

위의 코드가 컴파일 에러를 발생시키는 이유는 `typeof`가 런타임에 실행되며, 그렇기 때문에 **Typescript 코드가 이미 모두 Javascript 코드로 컴파일 된 이후**이기 때문이다.

즉, 런타임에서 `Employee`와 `Admin` 타입은 존재하지 않으며, **모두 Javascript 기본 타입인 `object` 타입으로 변환된 상태**라는 것이다.

[참고] `if (typeof employee === "object")`와 같이 사용하더라도, `Employee`와 `Admin` 타입 모두 `object` 타입이기 때문에 *Type Guard*로써 의미가 없다.

<br>

## `key in object` 사용하기

*사용자 정의 `object` 타입*에 대한 *Type Guard*의 경우, `typeof` 대신 `key in object`를 사용하여 수행할 수 있다.

```
function printEmployeeInfo(employee: UnknownEmployee) {
    if ("privileges" in employee) { ... } 
    if ("dateStarted" in employee) { ... } 
}
```

매개변수로 전달 받은 `UnknownEmployee` 타입으로 지정된 `employee`라는 변수가 **각각 `privileges`와 `dateStarted`라는 이름의 `key`를 가지고 있는지 검사**하는 것이다.

`privileges`는 `Admin` 타입에만 존재하는 `key`이며, `dateStarted`는 `Employee` 타입에만 존재하는 `key`이기 때문에 *Type Guard*로써 기능할 수 있다.

[참고] `if (employee.privileges)`와 같이 사용할 수 없다. Typescript는 **객체 속성의 존재가 불명확한 경우, 접근 자체를 막아버리기 때문**이다.

<br>

## `instanceof` 사용하기

클래스로 이루어진 `Union` 타입에 대한 *Type Guard*는 Javascript 예약어인 `instanceof`를 통해 수행할 수 있다. `instanceof`는 **인스턴스가 특정한 클래스의 생성자를 이용해 생성된 인스턴스인지 검사**한다. 

```
class Car {
    drive() {
        console.log("Driving a car...");
    }
}

class Truck {
    drive() {
        console.log("Driving a truck...");
    }

    loadItem() {
        console.log("Loading some stuff...");
    }
}

type Vehecle = Car | Truck;

function useVehicle(vehicle: Vehicle) {
    vehicle.drive();

    /* Type Guard */
    if (vehicle instanceof Truck) {
        vehicle.loadItem();
    }
}
```

`instanceof`는 `typeof`와 같이 Javascript에 기본적으로 포함되어 있는 예약어이며, 따라서 **런타임 환경에서 실행**된다.

따라서 Typescript에서만 존재하는 `interface`에 대해서는 `instanceof`를 사용할 수 없으며, 바로 위의 `key in object`로 *Type Guard*를 수행해야 한다.

[참고] `interface`는 Javascript에 존재하지 않으며, 컴파일하면 아무런 흔적도 남지 않는다.


