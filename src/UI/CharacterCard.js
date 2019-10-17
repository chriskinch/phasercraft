import React from "react";
import store from "../store";
import { CHARACTER_SELECT } from "../store/gameReducer";

const CharacterCard = ({ type }) => {
  return (
    <li style={{ 
        textAlign: "center",
        padding: "0.5em"
    }}>
        <img 
            src={`UI/player/${type}.gif`}
            alt={`Choose the ${type} class.`} 
            style={{
                paddingBottom: "0.5em"
            }}
        />
        <button 
            className="character-select-button" 
            style={{
                background: "darkslategrey",
                border: "1px solid black",
                color: "white",
                fontFamily: "'VT323', monospace",
                fontSize: "0.75em",
                padding: "0.25em 1em",
                width: "100%",
                textTransform: "capitalize"
            }}
            onClick={() => {
                store.dispatch({ 
                    type: CHARACTER_SELECT,
                    character: type
                });
            }}
        >{ type }</button>
    </li>
  );
}

export default CharacterCard;