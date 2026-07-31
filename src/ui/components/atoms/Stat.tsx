import React from "react";
import round from "lodash/round";
import styles from "./Stat.module.css";

interface StatProps {
    delimeter?: string;
    label: string;
    value: number;
    polarity?: number;
    /**
     * Preformatted value carrying its unit (`0.98s`, `13%`). Supplied by callers that
     * know the stat name; falls back to the bare rounded number when absent.
     */
    display?: string;
}

const Stat: React.FC<StatProps> = ({ delimeter = ":", label, value, polarity, display }) => {
    const getColor = (): string => {
        if (!polarity) return "black";
        return polarity > 0 ? "#10b981" : "#ef4444";
    };

    const formatValue = (): string => {
        if (display !== undefined) return display;
        const roundedValue = round(value, 2);
        if (polarity !== undefined) {
            return polarity > 0 ? `+${roundedValue}` : `${roundedValue}`;
        }
        return `${roundedValue}`;
    };

    return (
        <>
            <dt className={styles.label}>
                {label}
                {delimeter}
            </dt>
            <dd
                className={styles.value}
                style={{ "--stat-color": getColor() } as React.CSSProperties}
            >
                {formatValue()}
            </dd>
        </>
    );
};

export default Stat;
