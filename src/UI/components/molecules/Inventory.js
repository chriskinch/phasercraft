import React from "react";
import 'styled-components/macro';

const Inventory = () => {
    const items = ["A","J","Y","U","F","I","O","P","K","W","K","L"];
    return (
        <div css={`
            align-items: center;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: auto auto auto auto;
            height: 100%;
            padding: 0 1em;
            margin: 0;
            text-align: center;
            width: 100%;
            div {
                border:1px solid rgba(0,0,0,0.1);
                height: 100%;
            }
        `}>
            { items &&
                items.map((item) => <div>{item}</div>)
            }
        </div>
    );
}

export default Inventory;