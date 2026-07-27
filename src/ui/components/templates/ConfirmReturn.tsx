import React from "react";
import { useDispatch } from "react-redux";
import Button from "@components/Button";
import { requestTravel, toggleUi } from "@store/gameReducer";
import styles from "./ConfirmReturn.module.css";

// Leaving a biome abandons its progress — the pool respawns and an un-killed
// boss is gone on re-entry — so the HUD's teleport button confirms first. The
// ESC key stays an unconfirmed instant exit.
const ConfirmReturn: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <div className={styles.confirm}>
            <p>
                Return to town? The creatures here will return, and any boss you have not felled
                will be gone.
            </p>
            <div className={styles.actions}>
                <Button
                    text="Return"
                    onClick={() => {
                        dispatch(requestTravel("town"));
                        // Close the overlay so the town scene is not started
                        // into a paused state by the showUi subscription.
                        dispatch(toggleUi("confirmReturn"));
                    }}
                />
                <Button text="Cancel" onClick={() => dispatch(toggleUi("confirmReturn"))} />
            </div>
        </div>
    );
};

export default ConfirmReturn;
