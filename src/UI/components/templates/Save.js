import React, { useState } from "react"
import { connect } from "react-redux"
import { loadGame, selectCharacter, setSaveSlot, switchUi, toggleHUD } from "@store/gameReducer"
import store from "@store"
import Button from "@components/Button"
import Dialog from "@components/Dialog"


const getSaveGames = function(slots) {
    return slots.map(slot => JSON.parse(localStorage.getItem(slot)))
}

const Save = ({loadGame, selectCharacter, setSaveSlot, switchUi, toggleHUD, load}) => {
    const slots = ["slot_a", "slot_b", "slot_c"];
    const [saveGames, setSaveGames] = useState(getSaveGames(slots))
    const [showDialog, setShowDialog] = useState(false);
    const [currentSaveSlot, setCurrentSaveSlot] = useState(false);
    const otherGames = load ? saveGames.filter(save => save !== null) : saveGames;

    const delete_dialog = showDialog ? (
        <Dialog>
            <div>
                <p>Are you sure you want to delete this save game?</p>
                <Button text="Confirm" onClick={() => {
                    localStorage.removeItem(currentSaveSlot)
                    setSaveGames(getSaveGames(slots));
                    setShowDialog(false)
                }} />
                <Button text="Cancel" onClick={() => setShowDialog(false)} />
                <style jsx>{`
                    div {
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        background-color: rgba(0, 0, 0, 0.9);
                        padding: 10% 35%;
                        color: white;
                        font-size: 1.25rem;
                        font-weight: bold;
                    }
                `}</style>
            </div>
        </Dialog>
    ) : null;

    return (
        <>
            <ol>
                { otherGames.map((save, i) => {
                    const { game: { saveSlot, character, coins, wave } = {} } = save || {};
                    return (
                        <li key={i}>
                            <h2>{"Slot " + Number(i+1)}</h2>
                            { save &&
                                <>
                                <img 
                                    src={`ui/player/${character.toLowerCase()}.gif`}
                                    alt={`Load this save game.`} 
                                />
                                <p>Wave: { wave }</p>
                                <p>Gold: { coins }</p>
                                </>
                            }
                            <div>
                                {save ?
                                    <Button text={"Load"} onClick={e => {
                                        loadGame(save)
                                        selectCharacter(character)
                                    }}/> :
                                    <Button text={"Select"} onClick={e => {
                                        setSaveSlot(slots[i])
                                        switchUi("select")
                                    }}/>
                                }
                                <Button text="Delete" disabled={save ? false : true} onClick={() => {
                                    setCurrentSaveSlot(saveSlot)
                                    setShowDialog(true)
                                }} />
                            </div>
                        </li>
                    )
                })}
            </ol>
            <style jsx>{`
                ol {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                li {
                    flex: 1;
                    padding: 0.5rem;
                    text-align: center;
                }
                
                li:first-child {
                    padding-left: 0;
                }
                
                li:last-child {
                    padding-right: 0;
                }
                
                h2 {
                    text-transform: capitalize;
                }
                
                img {
                    padding-bottom: 0.5rem;
                }
                
                p {
                    margin: 0;
                }
                
                p:last-of-type {
                    margin-bottom: 0.5rem;
                }
                
                li > div {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.5rem;
                }
            `}</style>
            {delete_dialog}
        </>
    );
}

const mapStateToProps = (state) => {
    const { saveSlot } = state.game;
    return { saveSlot }
};

export default connect(mapStateToProps, { loadGame, selectCharacter, setSaveSlot, switchUi, toggleHUD })(Save);