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

        if (
            title.trim().length === 0 ||
            description.trim().length === 0 ||
            people.trim().length === 0 
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
            console.log(title, desc, people);
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