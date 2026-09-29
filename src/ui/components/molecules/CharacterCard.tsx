import React from "react";
import { grantStarterItems, selectCharacter, setCoins } from "@store/gameReducer";
import { connect } from "react-redux";
import { readSettings } from "@services/settingsStorage";
import type { PlayerName } from "@entities/Player/AssignClass";

import Button from "../atoms/Button";
import styles from "./CharacterCard.module.css";

interface CharacterCardProps {
    // Injected by `connect`'s mapDispatchToProps; dispatch the actions below.
    selectCharacter: (character: PlayerName) => void;
    setCoins: (value: number) => void;
    grantStarterItems: () => void;
    type: PlayerName;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
    selectCharacter,
    setCoins,
    grantStarterItems,
    type,
}) => {
    // Picking a character here only happens on a fresh game (loading a save goes
    // through Save's Load button instead), so this is the seam to apply the
    // Starter items setting (or an empty purse) before the run begins.
    const startGame = () => {
        if (readSettings().starterItems) grantStarterItems();
        else setCoins(0);
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

export default connect(null, { selectCharacter, setCoins, grantStarterItems })(CharacterCard);
