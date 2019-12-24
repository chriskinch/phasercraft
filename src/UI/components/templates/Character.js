import React from "react";
import CharacterCard from "../molecules/CharacterCard";
import 'styled-components/macro';

const Character = () => {
    return (
        <ol 
            className="character-list"
            css={`
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;
            `}
        >
            <CharacterCard type="Cleric" />
            <CharacterCard type="Mage" />
            <CharacterCard type="Occultist" />
            <CharacterCard type="Ranger" />
            <CharacterCard type="Warrior" />
        </ol>
    );
}

export default Character;