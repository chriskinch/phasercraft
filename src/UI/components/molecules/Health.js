import React from "react";
import Stat from "@atoms/Stat";
import 'styled-components/macro';

const Health = ({stats}) => {
    const { health_max, health_regen_value, health_regen_rate } = stats;
    const regen = health_regen_value * health_regen_rate;
    return (
        <>
            <dl css={`
                border: 4px solid black;
                background-color: red;
                margin-bottom: 0;
                overflow: hidden;
                padding: 0.25em;
                position: relative;
                &:after {
                    position: absolute;
                    border-bottom: 2px solid rgba(0,0,0,0.2);
                    border-right: 2px solid rgba(0,0,0,0.2);
                    bottom: 0;
                    content: '';
                    left: 0;
                    right: 0;
                    top: 0;
                }
            `}>
                <Stat label={ "HP" } value={ health_max } />
            </dl>
            <dl css={`
                float: left;
                margin-top: 0;  
            `}>
                <Stat icon= { "./UI/icons/plus.gif" } delimeter={ " " } value={ `${regen} hp/s` } />
            </dl>
        </>
    )
}

export default Health;