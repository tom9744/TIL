import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import Person from './Person/Person';

/**
 * ES6의 Template Literal을 사용해 조건부에 따라 CSS 스타일을 변경할 수 있다.
 * 
 * Component를 사용하기 위해 등록할 때 속성에 조건 값을 넘기면, `props` 예약어로 해당 속성을 사용할 수 있다.
 */
const StyledButton = styled.button`
  background-color: ${props => props.active ? 'red' : 'green'};
  color: white;
  font: inherit;
  border: 1px solid blue;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.active ? 'salmon' : 'lightgreen'};
    color: black;
  }
`;

class App extends Component {
  state = {
    persons: [
      { id: 1, name: 'Max', age: 28 },
      { id: 2, name: 'Manu', age: 29 },
      { id: 3, name: 'Stephanie', age: 26 }
    ],
    otherState: 'some other value',
    showPersons: false
  }

  // 복사본을 사용하지 않으면 원본 배열을 직접 수정하게 되어, State를 건드리게 된다.
  deletePersonHandler = (personIndex) => {
    const persons = this.state.persons.slice(); // 원본 배열에 대한 참조가 아닌, 복사본을 생성한다.

    persons.splice(personIndex, 1); // 해당 인덱스부터 1개의 요소 삭제

    this.setState({ persons: persons }); // 상태에 변경사항 반영 
  }

  nameChangeHandler = (event, personId) => {
    const personIndex = this.state.persons.find(person => {
      return person.id === personId; 
    })

    const targetPerson = { ...this.state.persons[personIndex] };  // Spread Operator를 이용해 복사본을 생성할 수 있다.
    targetPerson.name = event.target.name;  // 새로운 값으로 변경

    const newPersons = [ ...this.state.persons ];
    newPersons[personIndex] = targetPerson;

    this.setState({ persons: newPersons });  // 상태에 변경사항 반영
  }

  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;
    this.setState( { showPersons: !doesShow } );
  }

  render () {
    /**
     * CSS 파일을 사용하면 전역 등록되지만 '가상 선택자'를 사용할 수 있고,
     * 이와 같이 Javascript 변수로 사용하면 '가상 선택자' 사용 불가능!   
     * 
     * 하지만 이러한 방식은 
     *  1) Javascript 코드로 스타일 값 변경 가능 
     *  2) Scoped 되어 전역으로 적용되지 않음
     * 과 같은 굉장히 유용한 장점을 가지고 있다.
     */
    const style = {
      backgroundColor: 'green',
      color: 'white',
      font: 'inherit',
      border: '1px solid blue',
      padding: '8px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'salmon',
        color: 'black'
      }
    };

    /**
     * key 값을 설정하지 않으면, 요소가 변경될 때 전체 List 전체를 다시 그린다. (= 비효율적)
     * 또한 key 값에 index를 사용하면, List가 바뀔 때 index 값이 바뀌며 이는 도움이 되지 않는다.
     * 
     * bind()를 통해 EventHandler에 인자를 전달할 수 있다.
     * 
     * EventHandler에 기본 인자인 `event`를 전달하고, 추가적으로 필요한 인자를 전달한다.
     */
    let persons = null;

    if ( this.state.showPersons ) {
      persons = (
        <div>
          { this.state.persons.map((person, idx) => {
              return (
                <Person
                  key={person.id}
                  click={this.deletePersonHandler.bind(this, idx)}
                  change={(event) => {this.nameChangeHandler(event, person.id)}}
                  name={person.name}
                  age={person.age}
                ></Person>
              )
          })}
        </div>
      );

      style.backgroundColor = 'red';
      style[':hover'] = {
        backgroundColor: 'salmon',
        color: 'black'
      }
    }

    /**
     * 정해진 스타일을 가지는 CSS 클래스 이름를 각 조건이 성립할 때 마다 배열에 추가하고,
     * 최종적으로 해당 스타일을 적용할 DOM의 className 속성에 추가해주는 방식으로
     * 스타일을 동적으로 적용할 수 있다.
     */
    const styleClasses = [];

    if (this.state.persons.length < 3) {
      styleClasses.push('red-text');
    }
    if (this.state.persons.length < 2) {
      styleClasses.push('bold-text');
    }

    return (
      <div className="App">
        <h1>Hi, I'm a React App</h1>

        <p className={styleClasses.join(' ')}>
          This is really working!
        </p>

        <StyledButton
          active={this.state.showPersons}
          onClick={this.togglePersonsHandler}
        >
          Toggle Persons
        </StyledButton>

        {persons}
      </div>
    );
  }
}

export default App;
