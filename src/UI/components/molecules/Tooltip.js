import React from "react";
import ReactTooltip from 'react-tooltip';
import 'styled-components/macro';
import Stats from "./Stats";

const Tooltip = ({ id, loot }) => {
    const { color, stats, info } = loot;
    return (
        <ReactTooltip 
            id={id}
            css={`
                border: 5px solid ${color}
            `}
            type="light"
            globalEventOff="click"
        ><Stats size={1.2} info={info}>{ stats }</Stats></ReactTooltip>
    );
}

export default Tooltip;