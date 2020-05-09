import React from "react";
import { darken } from 'polished';
import 'styled-components/macro';

const StatBar = ({colour, label, value, max}) => {
    max = max || value;

    return (
        <div css={`
            &:before {
                position: absolute;
                background-color: ${colour};
                bottom: 0;
                content: '';
                left: 0;
                right: 0;
                top: 0;
                transform: scaleX(${value/max});
                transform-origin: left;
            }
            border: 3px solid black;
            background-color: ${darken(0.3, colour)};
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
            <label css="position:relative;">{label}</label>:
            <span css="position:relative;">{value}</span>
            <span css="position:relative;float:right">{max}</span>
        </div>
    )
}

export default StatBar;