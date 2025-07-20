import React from "react";
import CharacterCard from "@components/CharacterCard";


const CharacterSelect = () => {
    return (
        <>
            <ol className="character-list">
                <CharacterCard type="Cleric" />
                <CharacterCard type="Mage" />
                <CharacterCard type="Occultist" />
                <CharacterCard type="Ranger" />
                <CharacterCard type="Warrior" />
            </ol>
            <style jsx>{`
                .character-list {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
            `}</style>
        </>
    );
}

export default CharacterSelect;