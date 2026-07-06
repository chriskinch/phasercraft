import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchUi, toggleUi } from "@store/gameReducer";
import Button from "@components/Button";
import Dialog from "@components/Dialog";
import theme from "@ui/themes.module.css";
import { writeSave } from "@services/saveStorage";
import type { RootState } from "@store";

interface SystemProps {
    state: RootState;
}

const System: React.FC<SystemProps> = ({ state }) => {
    const dispatch = useDispatch();
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
            <Button text="Co-op" onClick={() => dispatch(switchUi("coop"))} />
            {/* <Button text="Load" onClick={e => {
          console.log("LOAD")
          dispatch(switchUi("load"));
      }} /> */}
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
