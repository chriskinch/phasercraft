import React from "react";
import { selectCharacter, setCoins } from "@store/gameReducer";
import { connect } from "react-redux";
import { readSettings } from "@services/settingsStorage";
import type { PlayerName } from "@entities/Player/AssignClass";

import Button from "../atoms/Button";
import styles from "./CharacterCard.module.css";

interface CharacterCardProps {
    // Injected by `connect`'s mapDispatchToProps; dispatch the actions below.
    selectCharacter: (character: PlayerName) => void;
    setCoins: (value: number) => void;
    type: PlayerName;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ selectCharacter, setCoins, type }) => {
    // Picking a character here only happens on a fresh game (loading a save goes
    // through Save's Load button instead), so this is the seam to apply the
    // configured starting-coins balance before the run begins.
    const startGame = () => {
        setCoins(readSettings().startingCoins);
        selectCharacter(type);
    };

    return (
        <li className={styles.characterListItem}>
            <img
                className={styles.characterImage}
                src={`UI/player/${type.toLowerCase()}.gif`}
                alt={`Choose the ${type} class.`}
            />
            <Button text={type} onClick={startGame} />
        </li>
    );
};

export default connect(null, { selectCharacter, setCoins })(CharacterCard);
