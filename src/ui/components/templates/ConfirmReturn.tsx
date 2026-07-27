import React from "react";
import { useDispatch } from "react-redux";
import { setTravelTo, toggleUi } from "@store/gameReducer";
import Button from "@components/Button";
import styles from "./ConfirmReturn.module.css";

// Guards the HUD's return-to-town button. Leaving abandons the area's progress
// (re-entering rebuilds the whole pool), so the trip is worth confirming.
// The ESC keybinding stays as the unconfirmed instant exit.
const ConfirmReturn: React.FC = () => {
    const dispatch = useDispatch();

    return (
        <div className={styles.confirm}>
            <p>Leaving now abandons this area. Its enemies return if you come back.</p>
            <div className={styles.actions}>
                <Button text="Return" onClick={() => dispatch(setTravelTo("town"))} />
                <Button text="Cancel" onClick={() => dispatch(toggleUi("confirmReturn"))} />
            </div>
        </div>
    );
};

export default ConfirmReturn;
