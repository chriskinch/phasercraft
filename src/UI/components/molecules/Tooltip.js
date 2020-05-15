import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import "styled-components/macro"
import Stats from "./Stats"
import Price from "@atoms/Price"
import { connect } from "react-redux"

const Tooltip = ({ id, loot, equipment }) => {
    const { color, stats, info, cost } = loot;
    const [compare, setCompare] = useState(null);
    const afterShowHandler = e => {
        setCompare(equipment[loot.set])
    }
    const styles = `
        border-style: solid;
        border-width: 5px;
        background: white;
        padding: 0.5em 1em;
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
            { compare && 
                <div css={`
                    ${styles}
                    border-color: ${compare.color};
                    margin-bottom: 0.5em;
                    color: grey;
                `}>
                    <h5>Equipped</h5>
                    <Stats info={compare.info} compare={loot}>{ compare.stats }</Stats>
                </div>
            }
            <div css={`
                ${styles}
                border-color ${color};  
            `}>
                <Stats info={info} compare={compare}>{ stats }</Stats>
                <Price cost={cost} color={color} />
            </div>
        </ReactTooltip>
    );
}

const mapStateToProps = (state) => {
    const { equipment } = state;
    return { equipment }
};

export default connect(mapStateToProps)(Tooltip);