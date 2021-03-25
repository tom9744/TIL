import React, { Component } from "react";

import Aux from "../../hoc/Auxiliary"
import Burger from "../../components/Burger/Burger"
import BuildControls from "../../components/Burger/BuildControls/BuildControls"

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.3,
    meat: 1.2,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 2
    }

    addIngredientHandler = (type) => {
        // 객체 불변성을 유지하도록 상태(State)를 변경해야 한다.
        const updatedCount = this.state.ingredients[type] + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const updatedPrice = this.state.totalPrice + priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        })
    }

    removeIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type] - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        // 0보다 작은 값이 할당되는 경우, 0으로 변환한다.
        updatedIngredients[type] = updatedCount >= 0 ? updatedCount : 0;

        const priceAddition = INGREDIENT_PRICES[type];
        const updatedPrice = this.state.totalPrice - priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        })
    }

    render () {
        const disableFlags = {...this.state.ingredients};

        for (let key in disableFlags) {
            disableFlags[key] = disableFlags[key] <= 0 ? true : false;
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}></Burger>

                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disableFlags={disableFlags}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;