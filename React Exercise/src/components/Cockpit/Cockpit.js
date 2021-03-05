import React from 'react';
import styled from 'styled-components';

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

const StyledParagraph = styled.p`
  font-weight: ${props => props.length < 3 ? 'red' : 'inherit'};
  color: ${props => props.length < 2 ? 'bold' : 'normal'};
`;

const cockpit = (props) => {
  // JSX는 하나의 Element만 반환하기를 원하기 때문에, <div>로 감싸준다. 
  return (
    <div>
      <h1>Hi, I'm a React App</h1>

      <StyledParagraph 
        length={props.people.length}
      >
        This is really working!
      </StyledParagraph>

      <StyledButton
        active={props.isListVisible}
        onClick={props.toggled}
      >
        Toggle Persons
      </StyledButton>
    </div>
  )
};

export default cockpit;