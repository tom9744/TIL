// Project Types
enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

type Listener = (items: Project[]) => void;

// Proeject State Management Class (Singleton)
class ProjectState {
    private static instance: ProjectState; 
    private listeners: Listener[] = [];   // 구독 패턴(Subscription Pattern) 구현을 위한 Listener 배열
    private projects: Project[] = [];

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
    addListener (listenerFunction: Listener) {
        this.listeners.push(listenerFunction);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),  // 임시 ID 생성
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        )

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

    /**
     * minLength가 0이면 false로 인식되기 때문에, !== undefined 또는 != null를 사용해야 한다. 
     * 이 때, != null은 null과 undefined를 모두 포함한다.
     */
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
            const boundFunction = originMethod.bind(this);
            return boundFunction;
        }
    };
    return modifiedDescriptor
}

/**
 * Project Base Class 
 * 
 * 추상 클래스로 선언하여, 직접 인스턴스를 생성할 수 없도록 한다.
 * 
 * 또한, targetElement와 contentElement의 경우 HTMLElement 타입을 기본으로 하지만,
 * 경우에 따라 보다 세부적인 타입을 사용할 수 있도록 Generic 타입으로 설정한다.
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    targetElement: T;
    contentElement: U;

    /**
     * Optional Parameter는 생략될 수 있으므로 반드시 마지막에 위치해야 한다.
     * @param templateElementId 
     * @param targetElementId
     * @param insertAtBeginning
     * @param newElementId (Optional)
     */
    constructor(
        templateElementId: string, 
        targetElementId: string, 
        insertAtBeginning: boolean, 
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateElementId)! as HTMLTemplateElement; 
        this.targetElement = document.getElementById(targetElementId)! as T;

        // .content를 이용해 <template> 태그의 내부에 접근할 수 있으며, 
        // importNode() 메서드를 이용해 document에 외부 문서 내용을 삽입한다.
        // importNode() 메서드의 두번째 매개변수는 Deep Copy 여부이다. 
        const importedNode = document.importNode(this.templateElement.content, true);
        this.contentElement = importedNode.firstElementChild as U;

        if (newElementId)
        {
            this.contentElement.id = newElementId;
        }

        this.attachElement(insertAtBeginning);
    }

    private attachElement(insertAtBeginning: boolean) {
        if (insertAtBeginning) {
            this.targetElement.insertAdjacentElement("afterbegin", this.contentElement);
        }
        else {
            this.targetElement.insertAdjacentElement("beforeend", this.contentElement);
        }
    }

    abstract configureComponent(): void;

    abstract renderComponent(): void;
}

// Project List Class
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
    assignedProjects: Project[] = [];  // 인스턴스에 배정된 Proejct의 목록을 저장하는 배열.

    /**
     * type 변수의 타입은 문자열 'active' 또는 'finished'만 가질 수 있는 Literal Union 타입이다. 
     */
    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);

        this.configureComponent();
        this.renderComponent();
    }
    
    configureComponent() {
        // 전역 변수로 등록된 ProjectState에 Listener를 등록해 구독한다.
        globalProjectState.addListener((projects: Project[]) => {
            // Javascript Array 내장 함수 filter()와 enum 타입을 사용해 필터링 기능을 구현한다.
            const relevantProjects = projects.filter(project => {
                if (this.type === "active") {
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            }); 
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    renderComponent() {
        const listId = `${this.type}-projects-list`;
        this.contentElement.querySelector("ul")!.id = listId;
        this.contentElement.querySelector("h2")!.textContent = `${this.type.toUpperCase()} PROJECT`;
    }

    // 구독한 ProjectState에 변화가 발생해 'projects'가 반환되면, 화면에 렌더링한다.
    private renderProjects() {
        const listElem = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

        listElem.innerHTML = "";  // 중복된 항목이 렌더링되지 않도록 매번 초기화 해준다. (비용이 매우 큰 방법.)

        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listElem.appendChild(listItem); 
        }
    }
}
 
// Project Input Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    titleInputElem: HTMLInputElement;
    descriptionInputElem: HTMLInputElement;
    peopleInputElem: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input");

        // <form> 태그 하위에 있는 <input> 태그들을 ID를 이용해 접근한다. 
        this.titleInputElem = this.contentElement.querySelector("#title") as HTMLInputElement;
        this.descriptionInputElem = this.contentElement.querySelector("#description") as HTMLInputElement;
        this.peopleInputElem = this.contentElement.querySelector("#people") as HTMLInputElement;

        this.configureComponent();
    }

    configureComponent() {
        // bind(this)를 통해 submitHandler()의 this를 클래스(인스턴스)로 변경해야 한다.
        // 그렇지 않으면, submitHandler() 내부의 this는 'actualElem'가 된다. 
        //
        // 화살표 함수가 아닌 일반 함수는, 해당 함수를 호출한 대상으로 this의 context가 변경되기 때문이다.        
        this.contentElement.addEventListener('submit', this.submitHandler);
    }

    renderComponent() {}

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
}

const inputInstance = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");