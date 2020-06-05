import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import "styled-components/macro"
import Stats from "./Stats"
import StatsCompared from "./StatsCompared"
import Price from "@atoms/Price"
import { connect } from "react-redux"

const Tooltip = ({ id, loot, equipment }) => {
    const { color, stats, cost } = loot;
    const [compare, setCompare] = useState(null);
    const afterShowHandler = () => {
        compareStats(loot, equipment[loot.set]);
        setCompare(equipment[loot.set])
    }
    const compareStats = (l, e) => {
        console.log(l, e)
        return {}
    }
    const styles = `
        border-style: solid;
        border-width: 5px;
        background: white;
        padding: 0.5em 1em;
        border-radius: 3px;
        border-color: ${color};
    `;
    return (
        <ReactTooltip 
            css={`
                font-size: 1em;
                background-color: transparent !important;
                padding: 0;
                text-align: left;
            `}
            id={id}
            type="light"
            globalEventOff="click"
            afterShow={afterShowHandler}
        >
            <div css={`
                display: grid;
                grid-template-columns: 1fr min-content;
                align-items: end;
                grid-gap: 0.5em;
            `}>
                <div css={`${styles}`}>
                    <Stats>{ stats }</Stats>
                </div>
                <Price cost={cost} color={color} />
                { compare && 
                    <div css={`${styles} border-color: #333;`}>
                        <h4>Stat comparison</h4>
                        <Stats label={'label'}>{ stats }</Stats>
                    </div>
                }
            </div>
            
        </ReactTooltip>
    );
}

const mapStateToProps = (state) => {
    const { equipment } = state;
    return { equipment }
};

export default connect(mapStateToProps)(Tooltip);