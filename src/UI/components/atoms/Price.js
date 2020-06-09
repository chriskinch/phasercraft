import React, { useContext } from "react"
import "styled-components/macro"
import { MenuContext } from "@UI/UI"

const Price = ({ cost }) => {
    const menu = useContext(MenuContext);

    const {color, icon, value} = menu === 'equipment' ? { 
        value: Math.round(cost * 0.25),
        icon: 'sell',
        color: '#a5b4c1'
    } : {
        value: cost,
        icon: 'coin',
        color: '#ffc34d'
    }
    
    return (
        <div css={`
            background: rgba(255,255,255,0.95);
            border: 5px solid ${color};
            border-radius: 3px;
            font-size: 1.2em;
            padding: 0.1em 0.5em;
            white-space: nowrap;
        `}><img css={`
            width: 8px;
        `} src={`./UI/icons/${icon}.gif`} alt="Item cost:" /> {value}</div>
    );
}

export default Price;