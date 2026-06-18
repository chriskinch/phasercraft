import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadGame, selectCharacter, setSaveSlot, switchUi } from "@store/gameReducer";
import Button from "@components/Button";
import Dialog from "@components/Dialog";
import { readAllSaves, removeSave, SAVE_SLOTS } from "@services/saveStorage";
import type { RootState } from "@store";
import styles from "./Save.module.css";

interface SaveProps {
    load?: boolean;
}

const Save: React.FC<SaveProps> = ({ load = false }) => {
    const dispatch = useDispatch();
    const slots = [...SAVE_SLOTS];
    const [saveGames, setSaveGames] = useState<(RootState | null)[]>(() => readAllSaves(slots));
    const [showDialog, setShowDialog] = useState(false);
    const [currentSaveSlot, setCurrentSaveSlot] = useState<string | false>(false);
    const otherGames = load ? saveGames.filter((save) => save !== null) : saveGames;

    const delete_dialog = showDialog ? (
        <Dialog>
            <div className={styles.dialog}>
                <p>Are you sure you want to delete this save game?</p>
                <Button
                    text="Confirm"
                    onClick={() => {
                        if (currentSaveSlot) {
                            removeSave(currentSaveSlot);
                            setSaveGames(readAllSaves(slots));
                            setShowDialog(false);
                        }
                    }}
                />
                <Button text="Cancel" onClick={() => setShowDialog(false)} />
            </div>
        </Dialog>
    ) : null;

    return (
        <>
            <ol className={styles.slots}>
                {otherGames.map((save, i) => {
                    const { game: { saveSlot, character, coins, wave } = {} } = save || {};
                    return (
                        <li key={i}>
                            <h2>{"Slot " + Number(i + 1)}</h2>
                            {save && character && (
                                <>
                                    <img
                                        src={`ui/player/${character.toLowerCase()}.gif`}
                                        alt={`Load this save game.`}
                                    />
                                    <p>Wave: {wave}</p>
                                    <p>Gold: {coins}</p>
                                </>
                            )}
                            <div>
                                {save ? (
                                    <Button
                                        text={"Load"}
                                        onClick={() => {
                                            dispatch(loadGame(save.game));
                                            if (character) dispatch(selectCharacter(character));
                                        }}
                                    />
                                ) : (
                                    <Button
                                        text={"Select"}
                                        onClick={() => {
                                            dispatch(setSaveSlot(slots[i]));
                                            dispatch(switchUi("select"));
                                        }}
                                    />
                                )}
                                <Button
                                    text="Delete"
                                    disabled={save ? false : true}
                                    onClick={() => {
                                        setCurrentSaveSlot(
                                            typeof saveSlot === "string" ? saveSlot : false
                                        );
                                        setShowDialog(true);
                                    }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ol>
            {delete_dialog}
        </>
    );
};

export default Save;
