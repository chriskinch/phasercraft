import React from "react";
import { darken } from "polished";
import { getResourceColour } from "@helpers/getResourceColour";
import styles from "./StatBar.module.css";

interface StatBarProps {
    type: string;
    colour?: string;
    label?: string;
    value: number;
    max?: number;
}

const StatBar: React.FC<StatBarProps> = ({ type, colour, label, value, max }) => {
    const maxValue = max || value;
    const finalColour = colour || getResourceColour(type);
    const percentage = value / maxValue;
    const borderWidth = label ? 3 : 2;

    // Custom properties are set on the container; the fill inherits them.
    const style = {
        "--bar-border-w": `${borderWidth}px`,
        "--bar-bg-dark": darken(0.3, finalColour),
        "--bar-fill": finalColour,
        "--bar-pct": percentage,
    } as React.CSSProperties;

    return (
        <div className={styles.statBarContainer} style={style}>
            <div className={styles.progressFill} />
            <div className={styles.innerShadow} />

            {label && (
                <>
                    <label className={styles.label}>{label}</label>:
                    <span className={styles.value}>{value}</span>
                    <span className={styles.maxValue}>{maxValue}</span>
                </>
            )}
        </div>
    );
};

export default StatBar;
