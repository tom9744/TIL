# Typescript 기본 설정

브라우저는 Javascript 코드만 실행시킬 수 있으므로, Typescript로 작성한 코드를 브라우저 상에서 실행하기 위해서는 **Typescript 컴파일러를 통해 Javascript 코드로 변환하는 과정이 필수적**이다. 

이때, 컴파일러의 작동 방식을 요구에 따라 적절히 변경하여 Javascript 코드로 **컴파일되는 파일 또는 폴더를 특정**하거나, **ES5, ES6 등 ECMA 버전을 선택**할 수도 있다.  

<br>

## Watch Mode

Typescript 컴파일러는 **기본적으로 `tsc <파일 위치>` 명령어를 사용해 단일 파일에 대해 컴파일을 실행**한다. 하지만, 이러한 경우 코드가 변경될 때마다 일일히 컴파일을 다시 실행해야 한다는 점에서 다소 불편하다.  

`Watch Mode`를 사용하면 Typescript로 작성한 코드를 매번 컴파일하지 않아도, 파일을 저장하는 등 특정한 시점에서 자동으로 Javscript 코드로의 컴파일을 실행한다.

```
tsc <파일 위치> --watch

or

tsc <파일 위치> -w
```

`Watch Mode` 자체로도 굉장히 편리하지만, **프로젝트의 규모가 커짐에 따라 Typescript로 작성된 파일이 여러개가 된다면 단일 파일을 각각 컴파일하는 방식은 굉장히 비효율적**이다.

<br>

## 다수 파일 또는 프로젝트 단위 컴파일

여러 개의 Typescript 파일, 또는 프로젝트를 구성하는 모든 Typescript 파일을 동시에 컴파일하고자 한다면 **컴파일러 설정을 통해 이러한 파일들이 하나의 프로젝트에 속한다는 것을 Typescript 컴파일러에 알려주어야 한다.** 

```
tsc --init
```

위의 명령어를 컴파일하려는 파일이 포함된 *Root Directory*에서 실행하면 해당 위치에 속한 모든 Typescript 파일이 컴파일 대상으로 등록되며, 추가적으로 `tsconfig.json` 파일이 생성된다.

`tsconfig.json` 파일은 Typescript 컴파일러의 작동 방식과 관련된 모든 설정을 관리하는 파일이며, 동시에 해당 위치에 포함된 모든 파일과 하위 폴더는 Typescript의 관리를 받는다는 것을 의미한다.

[참고] `tsconfig.json` 파일의 내용 중, 기본적으로 주석처리 된 설정값의 경우 직접 변경하는 일은 드물다.

```
tsc
```

`tsc --init` 명령어를 통해 `tsconfig.json` 파일이 정상적으로 생성되었다면, 이제 **해당 위치에서 `tsc` 명령어만 사용해 하위 폴더에 포함된 모든 Typescript 코드를 한 번에 컴파일**할 수 있다.

물론, `tsc --watch` 또는 `tsc -w` 명령어를 통해 프로젝트에 포함된 전체 Typescript 파일에 대해 `Watch Mode`를 활성화하도록 할 수도 있다.

<br>

## 컴파일 Target 설정

`tsconfig.json` 파일에서 `compilerOptions` 항목이 Typescript 컴파일러의 작동 방식을 설정할 수 있는 항목이다. 즉, 개발자가 작성한 Typescript 코드를 어떠한 방식으로 Javascript 코드로 변환할 것인지를 결정할 수 있다.

굉장히 다양한 설정값이 존재하지만, 가장 중요한 설정값 중 하나는 **Typescript 코드를 컴파일하여 생성할 Javscript 코드의 ECMA 버전을 결정하는 `target` 옵션**이다. 

`target` 옵션은 `tsconfig.json` 파일이 생성될 때 기본값으로 `es5`가 설정되어 있다. 과거 버전인 `es3`로 변경할 수도 있고, 최신 버전인 `es6`, `es2016`, `esnext`로도 변경할 수 있다. 

Typescript 코드
```
let integer: number;
integer = 30; 
```

ES5 컴파일 결과
```
var integer;
integer = 30;
```

ES6 컴파일 결과
```
let integer;
integer = 30;
```

`const`, `let`이 등장하기 이전인 `es5`로 Typescript 코드를 컴파일하면, Typescript에서 `const`와 `let`을 사용하더라도 컴파일 결과물인 Javscript 파일에서는 모든 변수에 대해 `var`가 사용된다.

이와 같이, **이전 버전의 Javascript로 컴파일하면 지원가능한 브라우저의 범위는 넓어지지만, Typescript 코드로 작성한 본래의 의미는 퇴색**되게 된다. 따라서, 프로젝트가 대상으로 하는 브라우저 범위에 맞추어 적절하게 `target` 옵션을 지정하는 것이 좋다. 

<br>

## Library 설정

`lib` 옵션은 Typescript가 `document`, `window` 등과 같은 *기본 객체*와 이러한 객체에 포함된 `addEventListener`와 같은 *DOM API*를 이해하고, 사용할 수 있도록 해준다. 

`lib` 옵션은 기본적으로 주석처리 되어 있는데, 이것은 `target` 옵션에서 `es6`를 선택했을 때 **`lib` 옵션이 명시되어 있지 않으면 `es6`에서 필요로하는 설정값을 기본값으로 사용**하기 때문이다.


따라서 주석을 해제하고 `"lib": [],`와 같이 **빈 배열의 상태로 놔두면 Typescript는 `document`, `window`와 같은 기본 객체를 이해하지 못하게 되며, 따라서 이러한 객체와 연관된 메서드 역시 사용할 수 없게 된다.**

[참고] `target` 옵션에서 `es6`를 선택할 때 기본적으로 설정되는 `lib` 옵션은 다음과 같다.

```
"lib" : [
    "dom",
    "es6",
    "dom.iterable",
    "scripthost"
],
```

<br>

## `allowJs`, `checkJS` 옵션

`lib` 옵션과 마찬가지로 기본적으로 주석처리 되어있는 설정으로, `true`로 값을 지정하면 `.ts` 확장자의 Typescript 파일뿐만 아니라 일반적인 Javscript 파일도 Typescript 컴파일러의 관리 대상으로 등록한다.

- `allowJS: true,`: Typescript 컴파일러가 `.js` 파일도 컴파일 하도록 한다.  
- `checkJS: true,`: Typescript 컴파일러가 `.js` 파일을 컴파일하지는 않지만, 에러를 보고하도록 한다. 

`allowJs`, `checkJS` 옵션은 Typescript로 직접 코드를 작성하지는 않더라도 Typescript의 기능을 일부 사용하고자 하는 경우 유용한 설정값이다.

[참고] `allowJs`, `checkJS` 옵션 사용 시, `.ts` 파일을 컴파일해 생성된 `.js` 파일이 중복 컴파일될 수 있으므로, `include`, `exclude` 설정을 해주어야 한다.


<br>

## `sourceMap` 옵션

`sourceMap` 옵션은 Typescript로 작성한 코드를 *Debugging*하는 과정에서의 편리성을 제공하기 위한 설정이다. 

`sourceMap` 옵션을 설정하지 않으면, 브라우저 개발자 도구에서 제공하는 *Sources* 항목에서 컴파일된 `.js` 파일은 확인할 수 있지만, `.ts` 파일을 확인할 수 없어  *Debugging* 과정이 다소 불편하다.

`sourceMap` 옵션을 `true`로 설정하게 되면 `.map` 확장자의 파일이 생성되는데, 이 파일은 각각의 `.js` 파일이 어떠한 `.ts` 파일을 컴파일하여 생성된 것인지 기록하는 파일이다. 브라우저는 이러한 `.map` 파일을 확인하여 ***Sources* 항목에서 `.ts` 파일도 함께 표시**할 수 있게 된다.

*Sources* 항목에서 표시되는 `.ts` 확장자의 파일에는 ***Break Point*를 지정할 수 있는 등 *Debugging* 과정에서 유용하게 사용될 수 있는 기능을 제공**한다.

<br>

## `rootDir`, `outDir` 옵션

중규모 이상의 프로젝트를 관리하는 경우, `.ts` 파일을 컴파일하여 생성된 다수의 `.js` 파일이 *Root Directory* 또는 *Working Directory*에 뒤섞이는 것을 원하지 않을 수 있다.

예를 들어 *Vue CLI*를 사용해 생성한 프로젝트의 경우, 개발자가 작성한 코드는 `src/` 폴더에 보관하고 배포를 위해 빌드한 결과물은 `dist/` 폴더에 보관하여 작업 파일과 결과 파일이 서로 섞이지 않도록 관리한다.

Typescript 역시 `rootDir`, `outDir` 옵션을 설정하여 **개발자가 직접 작업하는 파일과 컴파일 결과 생성된 파일이 각각 분리된 위치에 저장되어 관리되도록 설정**할 수 있다.

- `rootDir`: Typescript 컴파일러가 컴파일을 수행할 대상 파일들의 위치를 지정한다.
- `outDir`: Typescript 컴파일러가 컴파일을 수행한 결과를 저장할 위치를 지정한다.


[참고] `rootDir`로 지정된 위치가 하위 폴더를 포함하는 구조인 경우, `outDir`에도 동일한 폴더 구조를 갖도록 컴파일된다.

<br>

## `removeComments` 옵션

Typescript 컴파일러가 `.ts` 파일을 컴파일하여 `.js` 파일을 생성할 때, `.ts` 파일에 포함된 모든 주석을 제거하도록 하는 설정이다.

그 자체로 특별한 기능은 아니지만 컴파일 결과 생성되는 `.js` 파일의 크기를 최소화하여, **최종적인 빌드 과정에서 *Bundle*의 크기를 작게 만드는데 도움**이 된다.  

<br>

## `noEmit`, `noEmitOnError` 옵션

`noEmit` 옵션은 잘 사용되는 설정값은 아니지만, `true`로 설정할 경우 컴파일을 실행해도 `.js` 파일이 생성되지 않게 된다. 지금 당장 `.js` 파일이 필요하지 않고 단지 작성한 `.ts` 파일의 상태만 점검하고 싶을 때 사용될 수 있다.

`noEmitOnError` 옵션은 기본값이 `false`로 지정되어 있으며, **컴파일 도중 에러가 발생하더라도 컴파일 결과물인 `.js` 파일이 생성**되도록 한다. 몇가지 자잘한 에러를 무시하고 진행할 수도 있지만, 보다 철저한 타입 검증이 필요한 경우 `noEmitOnError` 옵션을 `true`로 지정하여 에러가 존재하면 `.js` 파일이 생성되지 않도록 변경할 수 있다. 

[참고] 100개의 `.ts` 파일 중  단 1개의 파일에 에러가 있더라도, `noEmitOnError` 옵션이 활성화되어 있다면 아무런 파일도 생성되지 않는다.

