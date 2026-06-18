import React from "react";
import CharacterCard from "@components/CharacterCard";
import styles from "./CharacterSelect.module.css";

const CharacterSelect: React.FC = () => {
    return (
        <ol className={styles.characterList}>
            <CharacterCard type="Cleric" />
            <CharacterCard type="Mage" />
            <CharacterCard type="Occultist" />
            <CharacterCard type="Ranger" />
            <CharacterCard type="Warrior" />
        </ol>
    );
};

export default CharacterSelect;
