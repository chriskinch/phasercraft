import React, { useState } from "react"
import { connect } from "react-redux"
import { loadGame, selectCharacter, setSaveSlot, switchUi } from "../../../store/gameReducer"
import Button from "../atoms/Button"
import 'styled-components/macro'

const Save = ({loadGame, selectCharacter, setSaveSlot, switchUi}) => {
    const slots = ["slot_a", "slot_b", "slot_c"];
    const [saveGames, setSaveGames] = useState(slots.map(slot => JSON.parse(localStorage.getItem(slot))))

    return (
        <ol css={`
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
        `}>
            { saveGames.map((save, i) => {
                const { saveSlot, character, coins } = save || {};
                return (
                    <li key={i} css={`
                        flex: 1;
                        padding: 0.5em;
                        text-align: center;
                        &:first-child {
                            padding-left: 0;
                        }
                        &:last-child {
                            padding-right: 0;
                        }
                    `}>
                        <h2 css="text-transform:capitalize;">{"Slot " + Number(i+1)}</h2>
                        { save &&
                            <>
                            <img 
                                src={`UI/player/${character.toLowerCase()}.gif`}
                                alt={`Load this save game.`} 
                                css="padding-bottom: 0.5em"
                            />
                            <p>Gold: { coins }</p>
                            </>
                        }
                        <div css={`
                            display:flex;
                        `}>
                            <Button text={save ? "Load" : "Select"} onClick={e => {
                                if(save) {
                                    loadGame(save)
                                    selectCharacter(character)
                                }else{
                                    setSaveSlot(slots[i])
                                    switchUi("character")
                                }
                            }} />
                            <Button text="Delete" onClick={e => {
                                localStorage.removeItem(saveSlot)
                                setSaveGames(slots.map(slot => JSON.parse(localStorage.getItem(slot))));
                            }} />
                        </div>
                    </li>
                )
            })}
        </ol>
    );
}

const mapStateToProps = (state) => {
    const { saveSlot } = state;
    return { saveSlot }
};

export default connect(mapStateToProps, { loadGame, selectCharacter, setSaveSlot, switchUi })(Save);