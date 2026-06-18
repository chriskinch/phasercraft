import React from "react";
import { darken, grayscale } from "polished";
import styles from "./Button.module.css";

interface ButtonProps {
    disabled?: boolean;
    bg_color?: string;
    color?: string;
    text: string;
    text_shadow_color?: string;
    onClick?: () => void;
    size?: number;
    on?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
    const { disabled } = props;
    const {
        bg_color = disabled ? "grey" : "#ffc93e",
        color = disabled ? "#444" : "#222",
        text,
        text_shadow_color = "rgba(255, 255, 255, 0.5)",
        onClick,
        size = 1.5,
        on,
    } = props;

    const state_color = on ? "lime" : bg_color;
    const dark = darken(0.3, state_color);
    const grayDark = grayscale(dark);

    const style = {
        "--btn-bg": state_color,
        "--btn-bg-dark": dark,
        "--btn-fg": color,
        "--btn-size": `${size}em`,
        "--btn-shadow": disabled ? `0 3px 0px ${grayDark}` : `0 3px 0px ${dark}`,
        "--btn-text-shadow": text_shadow_color,
        "--btn-disabled-color": grayDark,
    } as React.CSSProperties;

    return (
        <button className={styles.button} style={style} disabled={disabled} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
