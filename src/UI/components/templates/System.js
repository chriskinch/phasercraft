import React, { useState } from "react"
import { connect } from "react-redux"
import { switchUi, toggleUi } from "../../../store/gameReducer";
import Button from "../atoms/Button"
import Dialog from "../organisms/Dialog"
import { dialog_overlay } from "../../themes"
import "styled-components/macro"

const System = ({state, saveSlot, switchUi, toggleUi}) => {
    const [showDialog, setShowDialog] = useState(false);

    const save_dialog = showDialog ? (
        <Dialog>
            <div css={ dialog_overlay() }>
                <p>Overwrite your existing save game?</p>
                <Button text="Yes" onClick={() => {
                    localStorage.setItem(saveSlot, JSON.stringify(state))
                    toggleUi()
                    setShowDialog(false)
                }} />
                <Button text="Cancel" onClick={() => setShowDialog(false)} />
            </div>
        </Dialog>
    ) : null;

    return (
        <>
            <Button text="Save" onClick={() => setShowDialog(true)} />
            {/* <Button text="Load" onClick={e => {
                console.log("LOAD")
                switchUi("load");
            }} /> */}
            <Button text="Quit" onClick={e => {
                window.location.reload()
            }} />
            {save_dialog}
        </>
    );
}

const mapStateToProps = (state) => {
    const { saveSlot } = state;
    return { state, saveSlot }
};

export default connect(mapStateToProps, {switchUi, toggleUi})(System);