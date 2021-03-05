import React from 'react';
import styled from 'styled-components';

/**
 * styled.HTMLElementName 으로 스타일을 지정하면, 해당 스타일 적용된
 * React Component가 반환되어 JSX에서 바로 사용할 수 있다.
 */
const StyledDivElem = styled.div`
    width: 60%;
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid #eee;
    box-shadow: 0 2px 2px #ccc;
    text-align: center;

    @media (min-width: 500px) {
        width: 450px;
    }
`;

const person = ( props ) => {
    return (
        <StyledDivElem>
            <p onClick={props.click}>I'm {props.name} and I am {props.age} years old!</p>
            <p>{props.children}</p>
            <input type="text" onChange={props.change} value={props.name} />
        </StyledDivElem>

    )
};

export default person;