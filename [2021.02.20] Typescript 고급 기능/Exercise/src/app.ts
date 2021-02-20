// Proeject State Management Class (Singleton)
class ProjectState {
    private static instance: ProjectState; 
    private listeners: any[] = [];   // 구독 패턴(Subscription Pattern) 구현을 위한 Listener 배열
    private projects: any[] = [];

    // Singleton Patter Implementation
    private constructor() {

    }

    // Getter
    static getInstance() {
        if (this.instance) {
            return this.instance;
        } 
        this.instance = new ProjectState();
        return this.instance;
    }

    // 함수에 대한 참조(Reference)를 인자로 받아, listener 배열에 추가한다.
    addListener (listenerFunction: Function) {
        this.listeners.push(listenerFunction);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = {
            id: Math.random().toString(),  // 임시 ID 생성
            title,
            description,
            people: numOfPeople
        };

        this.projects.push(newProject);

        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());  // 복사본을 매개변수로 전달
        }
    }
}

/**
 * app.ts 파일 내부의 모든 위치에 프로젝트의 상태에 접근할 수 있도록 인스턴스를 생성한다.
 * 
 * ProjectState 클래스는 Singleton Patter을 적용하여, 단 하나의 인스턴스만 생성 후 재사용한다.
 * 따라서, new ProjectState()로 생성자를 호출하지 않고, getter를 통해 인스턴스를 얻는다.
 **/ 
const globalProjectState = ProjectState.getInstance();


// Validation
/**
 * interface를 사용해 입력값 검증에 사용할 수 있는 객체 틀을 생성한다. 
 * 
 * 변수에 '?'를 추가하면 `Type | undefined`와 같은 Union 타입이 된다.
 * 즉, 필수적으로 존재해야 하는 속성(Property)이 아니게 된다.
 **/
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
}

function validate(input: Validatable) {
    let isValid = true;

    // input 객체에 'required' 속성이 존재하는 경우...
    if (input.required) {
        // AND 연산자(&&)를 이용해 isValid 값을 갱신한다.
        isValid = isValid && input.value.toString().trim().length !== 0;
    }

    // minLength가 0이면 false로 인식되기 때문에, !== undefined 또는 != null를 사용한다.
    if (input.minLength !== undefined && typeof input.value === 'string') {
        isValid = isValid && input.value.length > input.minLength;
    }

    if (input.maxLength !== undefined && typeof input.value === 'string') {
        isValid = isValid && input.value.length < input.maxLength;
    }

    if (input.minValue !== undefined && typeof input.value === 'number') {
        isValid = isValid && input.value > input.minValue;
    }
    
    if (input.maxValue !== undefined && typeof input.value === 'number') {
        isValid = isValid && input.value < input.maxValue;
    }

    return isValid;
}

// Autobind Decorator
function AutoBind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    const modifiedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originMethod.bind(this);
            return boundFn;
        }
    };
    return modifiedDescriptor
}

// Project List Class
class ProjectList {
    templateElem: HTMLTemplateElement;
    actualElem: HTMLElement;
    destinationElem: HTMLDivElement;
    assignedProjects: any [] = [];

    /**
     * type 변수의 타입은 문자열 'active' 또는 'finished'만 가질 수 있는 Literal Union 타입이다. 
     */
    constructor(private type: "active" | "finished") {
        this.templateElem = document.getElementById("project-list")! as HTMLTemplateElement; 
        this.destinationElem = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElem.content, true);
        this.actualElem = importedNode.firstElementChild as HTMLElement;
        this.actualElem.id = `${this.type}-projects`;

        // 전역 변수로 등록된 ProjectState에 Listener를 등록해 구독한다.
        globalProjectState.addListener((projects: any[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
    
        this.attach();
        this.renderContent();
    } 

    // 구독한 ProjectState에 변화가 발생해 'projects'가 반환되면, 화면에 렌더링한다.
    private renderProjects() {
        const listElem = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listElem.appendChild(listItem); 
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.actualElem.querySelector("ul")!.id = listId;
        this.actualElem.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECT`;
        
    }

    private attach() {
        this.destinationElem.insertAdjacentElement("beforeend", this.actualElem);
    }
}

// Project Input Class
class ProjectInput {
    templateElem: HTMLTemplateElement;
    actualElem: HTMLElement;
    destinationElem: HTMLDivElement;
    titleInputElem: HTMLInputElement;
    descriptionInputElem: HTMLInputElement;
    peopleInputElem: HTMLInputElement;

    constructor() {
        this.templateElem = document.getElementById("project-input")! as HTMLTemplateElement; 
        this.destinationElem = document.getElementById("app")! as HTMLDivElement; 

        /* 
        ** .content를 이용해 <template> 태그의 내부에 접근할 수 있으며, 
        ** importNode() 메서드를 이용해 document에 외부 문서 내용을 삽입한다.
        ** importNode() 메서드의 두번째 매개변수는 Deep Copy 여부이다.
        */ 
        const importedNode = document.importNode(this.templateElem.content, true);
        this.actualElem = importedNode.firstElementChild as HTMLElement;
        this.actualElem.id = "user-input";
        /*
        ** <form> 태그 하위에 있는 <input> 태그들을 ID를 이용해 접근한다.
        */ 
        this.titleInputElem = this.actualElem.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElem = this.actualElem.querySelector("#description") as HTMLInputElement;
        this.peopleInputElem = this.actualElem.querySelector("#people") as HTMLInputElement;

        this.configure();
        this.attachElem();
    }

    /*
    ** [문자열, 문자열, 숫자] 형태의 Tuple을 반환 타입으로 갖는 메서드지만,
    ** Type Check 실패 시, 아무것도 반환하지 않으므로 void 타입을 Union으로 추가한다.
    */
    private gatherUserInput(): [string, string, number] | void {
        const title = this.titleInputElem.value;
        const description = this.descriptionInputElem.value;
        const people = this.peopleInputElem.value;

        // 입력 값 검증을 위해 Interface 기반의 객체 생성
        const titleValidatable: Validatable = {
            value: title,
            required: true
        } 
        const descriptionValidatable: Validatable = {
            value: description,
            required: true,
            minLength: 5
        } 
        const peopleValidatable: Validatable = {
            value: +people,
            required: true,
            minValue: 2
        } 

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert("잘못된 입력 형식입니다.");
            return;
        } else {
            return [title, description, +people];
        }
    }

    private clearInputFields() {
        this.titleInputElem.value = ""
        this.descriptionInputElem.value = ""
        this.peopleInputElem.value = ""
    }

    @AutoBind
    private submitHandler(event: Event) {
        event.preventDefault();

        const userInput = this.gatherUserInput();

        // Runtime Type Guard (Tuple === Array)
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            
            // 새로운 프로젝트 생성
            globalProjectState.addProject(title, desc, people);

            this.clearInputFields();
        }
    }

    private configure() {
        /* 
        ** .bind(this)를 통해 submitHandler()의 this를 클래스(인스턴스)로 변경해야 한다.
        ** 그렇지 않으면, submitHandler() 내부의 this는 'actualElem'가 된다.
        */
        // this.actualElem.addEventListener('submit', this.submitHandler.bind(this));
        this.actualElem.addEventListener('submit', this.submitHandler);
    }

    private attachElem() {
        this.destinationElem.insertAdjacentElement('afterbegin', this.actualElem);
    }
}

const inputInstance = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");