import React from "react";
import 'styled-components/macro';

const LootIcon = ({ id, category, color, icon, isSeletced, onClick }) => {
    console.log(isSeletced, id)
    return (
        <img css={`
            border: 3px solid ${isSeletced ? "red" : color};
            border-radius: 0.25em;
            padding: 3px;
            background: white;
        `} src={`graphics/images/loot/${category}/${icon}.png`} alt="Loot!" onClick={onClick} />
    )
}; 

export default LootIcon;