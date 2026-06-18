import React from "react";
import round from "lodash/round";
import styles from "./Stat.module.css";

interface StatProps {
    delimeter?: string;
    label: string;
    value: number;
    polarity?: number;
}

const Stat: React.FC<StatProps> = ({ delimeter = ":", label, value, polarity }) => {
    const getColor = (): string => {
        if (!polarity) return "black";
        return polarity > 0 ? "#10b981" : "#ef4444";
    };

    const formatValue = (): string => {
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
