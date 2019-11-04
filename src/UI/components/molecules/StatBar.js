import React from "react";
import 'styled-components/macro';

const StatBar = ({colour, label, value}) => { 
    return (
        <div css={`
            border: 3px solid black;
            background-color: ${colour};
            margin-bottom: 2px;
            overflow: hidden;
            padding: 0.1em 0.3em;
            position: relative;
            &:after {
                position: absolute;
                border-bottom: 1px solid rgba(0,0,0,0.2);
                border-right: 1px solid rgba(0,0,0,0.2);
                bottom: 0;
                content: '';
                left: 0;
                right: 0;
                top: 0;
            }
        `}>
            <label>{label}</label>: <span>{value}</span>
        </div>
    )
}

export default StatBar;