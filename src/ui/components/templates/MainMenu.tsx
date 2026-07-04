import React from "react";
import { useDispatch } from "react-redux";
import { switchUi } from "@store/gameReducer";
import Button from "@components/Button";
import { readAllSaves, SAVE_SLOTS } from "@services/saveStorage";
import styles from "./MainMenu.module.css";

// Landing screen for the game startup flow (#382). Renders the title/logo
// placeholder and the four top-level actions. New Game / Load availability is
// derived from the persisted save slots so the menu reflects storage on render.
const MainMenu: React.FC = () => {
    const dispatch = useDispatch();
    const saves = readAllSaves([...SAVE_SLOTS]);
    // New Game needs a free slot; Load needs at least one populated slot.
    const allSlotsFull = saves.every((save) => save !== null);
    const hasSaves = saves.some((save) => save !== null);

    return (
        <div className={styles.menu}>
            <div className={styles.logo}>
                <h1 className={styles.title}>Phasercraft</h1>
                <img className={styles.sprite} src="ui/player/warrior.gif" alt="" />
            </div>
            <div className={styles.actions}>
                <Button
                    text="New Game"
                    disabled={allSlotsFull}
                    onClick={() => dispatch(switchUi("save"))}
                />
                {hasSaves && <Button text="Load" onClick={() => dispatch(switchUi("load"))} />}
                <Button text="Settings" onClick={() => dispatch(switchUi("settings"))} />
                <Button
                    text="Quit"
                    onClick={() => {
                        // Browsers only honour close() for script-opened windows, so
                        // in a normal tab it is a no-op and the reload runs instead.
                        window.close();
                        window.location.reload();
                    }}
                />
            </div>
        </div>
    );
};

export default MainMenu;
