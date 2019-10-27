import React from "react";
import ReactTooltip from 'react-tooltip';
import 'styled-components/macro';
import Stats from "./Stats";

const Tooltip = ({ id, item }) => {
    const { color, stats } = item;
    return (
        <ReactTooltip 
            id={id}
            css={`
                border: 5px solid ${color}
            `}
            type="light"
            globalEventOff="click"
        ><Stats size={1.2}>{ stats }</Stats></ReactTooltip>
    );
}

export default Tooltip;