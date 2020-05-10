import React from "react"
import { connect } from "react-redux"
import StatBar from "@molecules/StatBar";
import 'styled-components/macro'

const HUD = ({xp}) => {
    const xpCurve = l => (l*l) + (l*10);
    const givenXpOf = (exp = 0, count = 1) => {
        const next = xpCurve(count);
        const remainder = exp - next;
        return (remainder < 0) ? {xpRemaining: exp, toNextLevel: next, currentLevel: count} : givenXpOf(remainder, count + 1);
    }
    const experience = givenXpOf(xp);
    return (
        <div css={`
            padding: 0.5em 1em;
        `}>
            <div css="width:100px">
                <label>LV {experience.currentLevel}</label>
                <StatBar colour={"#eee"} value={experience.xpRemaining} max={experience.toNextLevel} />
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    const { xp } = state;
    return { xp }
};

export default connect(mapStateToProps, null)(HUD);