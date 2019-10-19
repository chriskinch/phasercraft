import React from "react";
import 'styled-components/macro';
import { darken } from 'polished';

const Button = ({ button_color, className, text }) => {
    return (
        <button 
            className={ className }
            css={`
                display: inline-block;
                padding: 15px;
                margin-right: 5px;
                height: 50px;
                min-width: 100px;
                background: ${button_color};
                border: none;
                outline: none;
                color: black;
                font-family: inherit;
                font-weight: 400;
                font-size: 20px;
                border-radius: 3px;
                box-shadow: 0 5px 0px ${darken(0.1, button_color)};
                border-bottom: 2px solid ${darken(0.1, button_color)};
                &:hover{
                    background: ${darken(0.05, button_color)};
                    box-shadow: 0 4px 1px ${darken(0.05, button_color)};
                    border-bottom: 2px solid ${darken(0.08, button_color)};
                    transition: all 0.1s ease-in;
                }   
                &:active{
                    transform:translateY(4px);
                    border-bottom-width: 2px;
                    box-shadow: none;
                }
            `}
        >{ text }</button>
    );
}

export default Button;