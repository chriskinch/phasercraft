import React from "react";
import { selectCharacter } from "@store/gameReducer";
import { connect } from "react-redux";
import type { PlayerName } from "@entities/Player/AssignClass";

import Button from "../atoms/Button";
import styles from "./CharacterCard.module.css";

interface CharacterCardProps {
    // Injected by `connect`'s mapDispatchToProps; dispatches the selectCharacter action.
    selectCharacter: (character: PlayerName) => void;
    type: PlayerName;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ selectCharacter, type }) => {
    return (
        <li className={styles.characterListItem}>
            <img
                className={styles.characterImage}
                src={`UI/player/${type.toLowerCase()}.gif`}
                alt={`Choose the ${type} class.`}
            />
            <Button text={type} onClick={() => selectCharacter(type)} />
        </li>
    );
};

export default connect(null, { selectCharacter })(CharacterCard);
