import React from 'react';

import Person from './Person/Person';


/**
 * key 값을 설정하지 않으면, 요소가 변경될 때 전체 List 전체를 다시 그린다. (= 비효율적)
 * 또한 key 값에 index를 사용하면, List가 바뀔 때 index 값이 바뀌며 이는 도움이 되지 않는다.
 * 
 * bind()를 통해 EventHandler에 인자를 전달할 수 있다.
 * 
 * EventHandler에 기본 인자인 `event`를 전달하고, 추가적으로 필요한 인자를 전달한다.
 */
const personList = (props) => props.people.map((person, index) => {
  const { id, name, age } = person;

  /**
   * bind(this, 인자)를 통해 함수의 인자를 고정하는 방법 이외에도, 
   * {(매개변수) => 함수(매개변수)}와 같이 사용해 
   * EventHandler에 this에 대한 문맥과 매개변수를 전달할 수 있다.
   */
  return (
    <Person
      key={id}
      name={name}
      age={age}
      click={() => props.clicked(index)}
      change={(event) => {props.changed(event, person.id)}}
    ></Person>
  )
})

export default personList