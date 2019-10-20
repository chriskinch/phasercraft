import React from "react";
import store from "../store";
import { CHARACTER_SELECT } from "../store/gameReducer";
import 'styled-components/macro';
import Button from './components/atoms/Button'

const CharacterCard = ({ type }) => {
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
            onClick={() => {
                store.dispatch({ 
                    type: CHARACTER_SELECT,
                    character: type
                });
            }}/>
    </li>
  );
}

export default CharacterCard;