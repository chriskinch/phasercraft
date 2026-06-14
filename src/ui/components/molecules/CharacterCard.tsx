import React from "react";
import { selectCharacter } from "@store/gameReducer";
import { connect } from "react-redux";
import type { PlayerName } from "@entities/Player/AssignClass";

import Button from "../atoms/Button";

interface CharacterCardProps {
    // Injected by `connect`'s mapDispatchToProps; dispatches the selectCharacter action.
    selectCharacter: (character: PlayerName) => void;
    type: PlayerName;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ selectCharacter, type }) => {
    return (
        <li className="character-list-item">
            <img
                className="character-image"
                src={`UI/player/${type.toLowerCase()}.gif`}
                alt={`Choose the ${type} class.`}
            />
            <Button text={type} onClick={() => selectCharacter(type)} />

            <style jsx>{`
                .character-list-item {
                    padding: 0.5rem;
                    text-align: center;
                }

                .character-list-item:first-child {
                    padding-left: 0;
                }

                .character-list-item:last-child {
                    padding-right: 0;
                }

                .character-image {
                    padding-bottom: 0.5rem;
                }
            `}</style>
        </li>
    );
};

export default connect(null, { selectCharacter })(CharacterCard);
