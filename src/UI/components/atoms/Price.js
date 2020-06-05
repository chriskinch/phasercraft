import React from "react";
import 'styled-components/macro';

const Price = ({ color, cost }) => {
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
            margin-right: 0.25em;
        `} src="./UI/icons/coin.gif" alt="Item cost:" /> {cost}</div>
    );
}

export default Price;