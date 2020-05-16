import React from "react";
import 'styled-components/macro';
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
            css={`
                display: inline-block;
                padding: 0 12px;
                height: 1.5em;
                background: ${state_color};
                border: none;
                border-bottom: 2px solid ${darken(0.3, state_color)};
                color: ${color};
                outline: none;
                font-weight: bold;
                font-size: ${size}em;
                border-radius: 3px;
                box-shadow: 0 3px 0px ${darken(0.3, state_color)};
                text-shadow: 0 1px ${text_shadow_color};
                margin-bottom: 0.5em;
                width: 100%;
                &:active{
                    transform:translateY(3px);
                    border-bottom-width: 2px;
                    box-shadow: none;
                }
                &:disabled {
                    color: #333;
                    background: grey;
                    border-color: ${grayscale(darken(0.3, state_color))};
                    box-shadow: 0 3px 0px ${grayscale(darken(0.3, state_color))};
                }
            `}
            onClick={onClick} className={text}>{ text }</button>
    );
};

export default Button;