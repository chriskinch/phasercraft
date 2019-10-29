import React from "react";
import 'styled-components/macro';

const LootIcon = ({ category, color, icon }) => {
    return (
        <img css={`
            border: 3px solid ${color};
            border-radius: 0.25em;
            padding: 3px;
            background: white;
        `} src={`graphics/images/loot/${category}/${icon}.png`} alt="Loot!" />
    )
}; 

export default LootIcon;