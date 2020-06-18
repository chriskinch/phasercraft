import React from "react"
import { connect } from "react-redux"
import StatBar from "@molecules/StatBar"
import Spells from "@molecules/Spells"
import 'styled-components/macro'

const HUD = ({level}) => {
    return (
        <div css={`
            position: relative;
            padding: 0.5em 1em;
            box-sizing: border-box;
            height: 100vh;
        `}>
            <div css="width:100px">
                <label>LV {level.currentLevel}</label>
                <StatBar colour={"#eee"} value={level.xpRemaining} max={level.toNextLevel} />
            </div>

            <Spells />
        </div>
    );
}

const mapStateToProps = (state) => {
    const { level } = state.game;
    return { level }
};

export default connect(mapStateToProps)(HUD);