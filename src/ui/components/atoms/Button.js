import React from "react";
import { darken, grayscale } from 'polished';

const Button = (props) => {
    const { disabled } = props;
    const { 
        bg_color = disabled ? "grey" : "#ffc93e",
        color = disabled ? "#444" : "#222",
        text,
        text_shadow_color="rgba(255, 255, 255, 0.5)",
        onClick,
        size = 1.5,
        on
    } = props;

    const state_color = on ? 'lime' : bg_color;

    return (
        <button 
            disabled={disabled}
            onClick={onClick}>
            { text }
            
            <style jsx>{`
                button {
                    display: inline-block;
                    padding: 0 0.75rem;
                    height: 1.5em;
                    border: none;
                    outline: none;
                    font-weight: bold;
                    border-radius: 3px;
                    margin-bottom: 0.5rem;
                    width: 100%;
                    background-color: ${state_color};
                    border-bottom: 2px solid ${darken(0.3, state_color)};
                    color: ${color};
                    font-size: ${size}em;
                    box-shadow: ${disabled 
                        ? `0 3px 0px ${grayscale(darken(0.3, state_color))}` 
                        : `0 3px 0px ${darken(0.3, state_color)}`};
                    text-shadow: 0 1px ${text_shadow_color};
                }
                
                button:active {
                    transform: translateY(0.125rem);
                    box-shadow: none;
                }
                
                button:disabled {
                    color: ${grayscale(darken(0.3, state_color))};
                    background-color: grey;
                    border-color: ${grayscale(darken(0.3, state_color))};
                }
            `}</style>
        </button>
    );
};

export default Button;