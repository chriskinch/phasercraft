import React from "react";
import 'styled-components/macro';
import { darken } from 'polished';

const Button = ({ bg_color="#999", className, color="#222", onClick, text, text_shadow_color="rgba(255, 255, 255, 0.5)" }) => {
    return (
        <button 
            className={ className }
            css={`
                display: inline-block;
                padding: 0 12px;
                height: 32px;
                min-width: 96px;
                background: ${bg_color};
                border: none;
                border-bottom: 2px solid ${darken(0.1, bg_color)};
                color: ${color};
                outline: none;
                font-weight: bold;
                font-size: 21px;
                border-radius: 3px;
                box-shadow: 0 3px 0px ${darken(0.1, bg_color)};
                text-shadow: 0 1px ${text_shadow_color};      
                &:active{
                    transform:translateY(3px);
                    border-bottom-width: 2px;
                    box-shadow: none;
                }
            `}
            onClick={onClick}>{ text }</button>
    );
}

export default Button;