import React from "react";

import Aux from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map((key) => {
            return (
                <li key={key}>
                    <span style={{textTransform: "capitalize"}}>{key}</span>: {props.ingredients[key]}
                </li>
            );
        });

    return (
        <Aux>
            <h3>Your Order Summary</h3>

            <p>A delicious burger with the following ingredients!</p>

            <ul>
                {ingredientSummary}
            </ul>

            <p>Total Price: ${props.price.toFixed(2)}</p>

            <p>Continue to checkout?</p>

            <Button clicked={props.cancelOrder} buttonType="Danger">Cancel</Button>
            <Button clicked={props.continueOrder} buttonType="Success">Continue</Button>
        </Aux>
    )
};

export default orderSummary;