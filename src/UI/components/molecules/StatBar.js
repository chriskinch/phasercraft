import React from "react";
import { darken } from "polished";
import getResourceColour from "@Helpers/getResourceColour"
import "styled-components/macro";

const StatBar = ({type, colour, label, value, max}) => {
    max = max || value;
    colour = colour || getResourceColour(type);

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
            border: ${label ? '3px' : '2px'} solid black;
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
            { label &&
                <>
                    <label css="position:relative;">{label}</label>:
                    <span css="position:relative;">{value}</span>
                    <span css="position:relative;float:right">{max}</span>
                </>
            }
        </div>
    )
}

export default StatBar;