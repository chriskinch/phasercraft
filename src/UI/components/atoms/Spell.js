import React from "react";
import 'styled-components/macro';

const Spell = ({disabled, spell, onClick}) => {
    console.log("SPELL: ", disabled)
    return (
        <button 
            disabled={disabled}
            css={`
                border: none;
                background: url("./UI/spells/${spell}.png");
                filter: greyscale(${disabled ? '100%' : '0%'});
                opacity: ${disabled ? '0.5' : '1'};
                width: 44px;
                height: 44px;
                background-size: cover;
                image-rendering: pixelated;
                position: relative;
                &:focus {
                    outline: none;
                    filter: brightness(200%) saturate(50%);
                }
            `} 
            onClick={onClick}
        ></button>
    );
};

export default Spell;