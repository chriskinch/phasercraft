import React, { useState } from "react"
import { connect } from "react-redux"
import { switchUi, toggleUi } from "@store/gameReducer";
import Button from "@components/Button"
import Dialog from "@components/Dialog"
import { dialog_overlay } from "@ui/themes"


const System = ({state, saveSlot, switchUi, toggleUi}) => {
    const [showDialog, setShowDialog] = useState(false);

    const save_dialog = showDialog ? (
        <Dialog>
            <div className="dialog-overlay">
                <p>Overwrite your existing save game?</p>
                <Button text="Yes" onClick={() => {
                    localStorage.setItem(saveSlot, JSON.stringify(state))
                    toggleUi()
                    setShowDialog(false)
                }} />
                <Button text="Cancel" onClick={() => setShowDialog(false)} />
                <style jsx>{`
                    .dialog-overlay {
                        ${dialog_overlay()}
                    }
                `}</style>
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
    const { saveSlot } = state.game;
    return { state, saveSlot }
};

export default connect(mapStateToProps, {switchUi, toggleUi})(System);