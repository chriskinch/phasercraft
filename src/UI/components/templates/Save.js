import React from "react"
import { connect } from "react-redux"
import { switchUi } from "../../../store/gameReducer"
import Button from "../atoms/Button"
import 'styled-components/macro'

const Save = ({switchUi}) => {
    return (
        <ol css={`
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
        `}>
            { ["A", "B", "C"].map(i => {
                return (
                    <li key={i} css={`
                        flex: 1;
                        padding: 0.5em;
                        text-align: center;
                        &:first-child {
                            padding-left: 0;
                        }
                        &:last-child {
                            padding-right: 0;
                        }
                    `}>
                        <h2>Slot {i}</h2>
                        <Button text="Select" onClick={()=> switchUi("character") } />
                    </li>
                )
            })}
        </ol>
    );
}

const mapStateToProps = (state) => {
    const { saveSlot } = state;
    return { saveSlot }
};

export default connect(mapStateToProps, { switchUi })(Save);