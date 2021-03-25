import React from "react";

import classes from "./Burger.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const burger = (props) => {
    const convertedIngredients = Object.keys(props.ingredients)
        .map((key) => {
            return [...Array(props.ingredients[key])].map((_, idx) => {
                return <BurgerIngredient key={key + idx} type={key}/>
            });
        }); 

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {convertedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;