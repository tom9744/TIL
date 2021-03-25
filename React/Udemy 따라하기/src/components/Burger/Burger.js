import React from "react";

import classes from "./Burger.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const burger = (props) => {
    let convertedIngredients = Object.keys(props.ingredients)
        .map((key) => {
            return [...Array(props.ingredients[key])].map((_, idx) => {
                return <BurgerIngredient key={key + idx} type={key}/>
            });
        })
        .reduce((prev, curr) => {
            return prev.concat(curr);
        }, []); 

    if (convertedIngredients.length === 0) {
        convertedIngredients = <p>Please Start Adding Ingredients!</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {convertedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;