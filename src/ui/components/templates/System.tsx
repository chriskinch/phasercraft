import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchUi, toggleUi } from "@store/gameReducer";
import Button from "@components/Button";
import Dialog from "@components/Dialog";
import theme from "@ui/themes.module.css";
import { writeSave } from "@services/saveStorage";
import type { RootState } from "@store";

const System: React.FC = () => {
    const dispatch = useDispatch();
    // Saves persist the whole root state, so read it from the store rather than
    // taking it as a prop: the menu registry in UI.tsx renders templates through
    // a prop-erased component type, so a required prop it forgot to pass arrived
    // as `undefined` with no type error, and every save wrote the string
    // "undefined" into the slot.
    const state = useSelector((state: RootState) => state);
    const saveSlot = useSelector((state: RootState) => state.game.saveSlot);
    const [showDialog, setShowDialog] = useState(false);

    const save_dialog = showDialog ? (
        <Dialog>
            <div className={theme.dialogOverlay}>
                <p>Overwrite your existing save game?</p>
                <Button
                    text="Yes"
                    onClick={() => {
                        if (saveSlot) {
                            writeSave(saveSlot, state);
                        }
                        dispatch(toggleUi("system"));
                        setShowDialog(false);
                    }}
                />
                <Button text="Cancel" onClick={() => setShowDialog(false)} />
            </div>
        </Dialog>
    ) : null;

    return (
        <>
            <Button text="Save" onClick={() => setShowDialog(true)} />
            {/* <Button text="Load" onClick={e => {
          console.log("LOAD")
          dispatch(switchUi("load"));
      }} /> */}
            <Button text="Settings" onClick={() => dispatch(switchUi("settings"))} />
            <Button
                text="Quit"
                onClick={() => {
                    window.location.reload();
                }}
            />
            {save_dialog}
        </>
    );
};

export default System;
