import React, { useState } from "react"
import { connect } from "react-redux"
import { loadGame, selectCharacter, setSaveSlot, switchUi } from "@store/gameReducer"
import Button from "@atoms/Button"
import Dialog from "@organisms/Dialog"
import { dialog_overlay } from "@UI/themes"
import 'styled-components/macro'

const getSaveGames = function(slots) {
    return slots.map(slot => JSON.parse(localStorage.getItem(slot)))
}

const Save = ({loadGame, selectCharacter, setSaveSlot, switchUi, load}) => {
    const slots = ["slot_a", "slot_b", "slot_c"];
    const [saveGames, setSaveGames] = useState(getSaveGames(slots))
    const [showDialog, setShowDialog] = useState(false);
    const [currentSaveSlot, setCurrentSaveSlot] = useState(false);

    const otherGames = load ? saveGames.filter(save => save !== null) : saveGames;

    const delete_dialog = showDialog ? (
        <Dialog>
            <div css={ dialog_overlay() }>
                <p>Are you sure you want to delete this save game?</p>
                <Button text="Confirm" onClick={() => {
                    localStorage.removeItem(currentSaveSlot)
                    setSaveGames(getSaveGames(slots));
                    setShowDialog(false)
                }} />
                <Button text="Cancel" onClick={() => setShowDialog(false)} />
            </div>
        </Dialog>
    ) : null;

    return (
        <>
            <ol css={`
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;
            `}>
                { otherGames.map((save, i) => {
                    const { saveSlot, character, coins, wave } = save || {};
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
                                <p css='margin:0;'>Wave: { wave }</p>
                                <p css='margin:0 0 0.5em 0;'>Gold: { coins }</p>
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
                                <Button text="Delete" disabled={save ? false : true} onClick={() => {
                                    setCurrentSaveSlot(saveSlot)
                                    setShowDialog(true)
                                }} />
                            </div>
                        </li>
                    )
                })}
            </ol>
            {delete_dialog}
        </>
    );
}

const mapStateToProps = (state) => {
    const { saveSlot } = state;
    return { saveSlot }
};

export default connect(mapStateToProps, { loadGame, selectCharacter, setSaveSlot, switchUi })(Save);