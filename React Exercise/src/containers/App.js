import React, { Component } from 'react';
import './App.css';

import Cockpit from '../components/Cockpit/Cockpit'
import PersonList from "../components/PersonList/PersonList"

class App extends Component {
  state = {
    people: [
      { id: 1, name: 'Max', age: 28 },
      { id: 2, name: 'Manu', age: 29 },
      { id: 3, name: 'Stephanie', age: 26 }
    ],
    otherState: 'some other value',
    showPersonList: false
  }

  // 복사본을 사용하지 않으면 원본 배열을 직접 수정하게 되어, State를 건드리게 된다.
  deletePersonHandler = (personIndex) => {
    const people = this.state.people.slice(); // 원본 배열에 대한 참조가 아닌, 복사본을 생성한다.

    people.splice(personIndex, 1); // 해당 인덱스부터 1개의 요소 삭제

    this.setState({ people: people }); // 상태에 변경사항 반영 
  }

  nameChangeHandler = (event, personId) => {
    const personIndex = this.state.people.find(person => {
      return person.id === personId; 
    })

    const targetPerson = { ...this.state.people[personIndex] };  // Spread Operator를 이용해 복사본을 생성할 수 있다.
    targetPerson.name = event.target.name;  // 새로운 값으로 변경

    const newPersons = [ ...this.state.people ];
    newPersons[personIndex] = targetPerson;

    this.setState({ persons: newPersons });  // 상태에 변경사항 반영
  }

  togglePersonListHandler = () => {
    const doesShow = this.state.showPersonList;
    this.setState( { showPersonList: !doesShow } );
  }

  render () {
    let people = null;

    if ( this.state.showPersonList ) {
      people = (
        <div>
          <PersonList 
            people={this.state.people} 
            clicked={this.deletePersonHandler} 
            changed={this.nameChangeHandler} />
        </div>
      );
    }

    return (
      <div className="App">
        <Cockpit 
          people={this.state.people}
          isListVisible={this.state.showPersonList}
          toggled={this.togglePersonListHandler} />

        {people}
      </div>
    );
  }
}

export default App;
