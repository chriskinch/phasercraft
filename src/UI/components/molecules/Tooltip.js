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
    return (
        <ReactTooltip 
            id={id}
            css={`
                border: 5px solid ${color};
                font-size: 1em;
            `}
            type="light"
            globalEventOff="click"
            afterShow={afterShowHandler}
        >
            <div>
                <h5>Store</h5>
                <Stats info={info}>{ stats }</Stats>
                <Price cost={cost} color={color} />
            </div>
            { compare && 
                <div>
                    <h5>Equipped</h5>
                    <Stats info={compare.info}>{ compare.stats }</Stats>
                </div>
            }
        </ReactTooltip>
    );
}

const mapStateToProps = (state) => {
    const { equipment } = state;
    return { equipment }
};

export default connect(mapStateToProps)(Tooltip);