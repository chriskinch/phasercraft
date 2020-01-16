import React from "react";
import 'styled-components/macro';
import { darken, grayscale } from 'polished';

const Button = (props) => {
    const { disabled } = props;
    const { 
        bg_color= disabled ? "grey" : "#ffc93e",
        color= disabled ? "#444" : "#222",
        text,
        text_shadow_color="rgba(255, 255, 255, 0.5)",
        onClick
    } = props;
    return (
        <button 
            disabled={disabled}
            css={`
                display: inline-block;
                padding: 0 12px;
                height: 32px;
                background: ${bg_color};
                border: none;
                border-bottom: 2px solid ${darken(0.3, bg_color)};
                color: ${color};
                outline: none;
                font-weight: bold;
                font-size: 21px;
                border-radius: 3px;
                box-shadow: 0 3px 0px ${darken(0.3, bg_color)};
                text-shadow: 0 1px ${text_shadow_color};
                margin-bottom: 0.5em;
                margin-left: 0.25em;
                margin-right: 0.25em;
                width: 100%;
                &:active{
                    transform:translateY(3px);
                    border-bottom-width: 2px;
                    box-shadow: none;
                }
                &:disabled {
                    color: #333;
                    background: grey;
                    border-color: ${grayscale(darken(0.3, bg_color))};
                    box-shadow: 0 3px 0px ${grayscale(darken(0.3, bg_color))};
                }
            `}
            onClick={onClick}>{ text }</button>
    );
}

export default Button;