import React from "react";

import classes from "./BuildControl.css";

const buildControl = (props) => (
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button 
            className={classes.Button + " " + classes.Less}
            onClick={props.less}
            disabled={props.disabled}
        >Less</button>
        <button 
            className={classes.Button + " " + classes.More}
            onClick={props.more}
        >More</button>
    </div>
);

export default buildControl;