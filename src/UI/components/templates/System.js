import React from "react"
import { connect } from "react-redux"
import { toggleUi } from "../../../store/gameReducer";
import Button from "../atoms/Button"
import "styled-components/macro"

const System = ({state, saveSlot, toggleUi}) => {
    console.log(state)
    return (
        <>
            <Button text="Save" onClick={e => {
                localStorage.setItem(saveSlot, JSON.stringify(state))
                toggleUi();
            }} />
            <Button text="Load" onClick={e => {
                console.log("LOAD")
            }} />
            <Button text="Quit" onClick={e => {
                window.location.reload()
            }} />
        </>
    );
}

const mapStateToProps = (state) => {
    const { saveSlot } = state;
    return { state, saveSlot }
};

export default connect(mapStateToProps, {toggleUi})(System);