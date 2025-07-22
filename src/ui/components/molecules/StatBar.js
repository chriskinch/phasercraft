import React from "react";
import { darken } from "polished";
import { getResourceColour } from "@helpers/getResourceColour";

const StatBar = ({type, colour, label, value, max}) => {
    max = max || value;
    colour = colour || getResourceColour(type);
    const percentage = (value / max);
    const borderWidth = label ? 3 : 2;

    return (
        <div className="stat-bar-container">
            <div className="progress-fill" />
            <div className="inner-shadow" />
            
            { label &&
                <>
                    <label className="label">{label}</label>:
                    <span className="value">{value}</span>
                    <span className="max-value">{max}</span>
                </>
            }
            
            <style jsx>{`
                .stat-bar-container {
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 0.125rem;
                    padding: 0.125rem 0.25rem;
                    border: ${borderWidth}px solid black;
                    background-color: ${darken(0.3, colour)};
                }
                
                .progress-fill {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: ${colour};
                    transform-origin: left;
                    transform: scaleX(${percentage});
                }
                
                .inner-shadow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-right: 1px solid rgba(0, 0, 0, 0.2);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                }
                
                .label {
                    position: relative;
                }
                
                .value {
                    position: relative;
                }
                
                .max-value {
                    position: relative;
                    float: right;
                }
            `}</style>
        </div>
    )
}

export default StatBar;