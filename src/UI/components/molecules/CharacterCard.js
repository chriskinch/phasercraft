import React from "react";
import { toggleUi } from "../../../store/gameReducer";
import { connect } from 'react-redux';
import 'styled-components/macro';
import Button from '../atoms/Button'

const CharacterCard = ({ toggleUi, type }) => {
    return (
        <li css={`
            padding: 0.5em;
            text-align: center;
            &:first-child {
                padding-left: 0;
            }
            &:last-child {
                padding-right: 0;
            }
        `}>
            <img 
                src={`UI/player/${type}.gif`}
                alt={`Choose the ${type} class.`} 
                css="padding-bottom: 0.5em"
            />
            <Button 
                className="character-select-button"
                text={ type }
                onClick={() => toggleUi({character: type}) } />
        </li>
    );
}

export default connect(null, { toggleUi })(CharacterCard);