import React from "react"
import { connect } from "react-redux"
import StatBar from "@molecules/StatBar"
import 'styled-components/macro'

const HUD = ({level}) => {
    return (
        <div css={`
            padding: 0.5em 1em;
        `}>
            <div css="width:100px">
                <label>LV {level.currentLevel}</label>
                <StatBar colour={"#eee"} value={level.xpRemaining} max={level.toNextLevel} />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { level } = state;
    return { level }
};

export default connect(mapStateToProps)(HUD);