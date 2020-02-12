import React from "react"
import ReactTooltip from "react-tooltip"
import "styled-components/macro"
import Stats from "./Stats"
import Price from "@atoms/Price"

const Tooltip = ({ id, loot }) => {
    const { color, stats, info, cost } = loot;
    return (
        <ReactTooltip 
            id={id}
            css={`
                border: 5px solid ${color}
            `}
            type="light"
            globalEventOff="click"
        >
            <Stats size={1.2} info={info}>{ stats }</Stats>
            <Price cost={cost} color={color} />
        </ReactTooltip>
    );
}

export default Tooltip;