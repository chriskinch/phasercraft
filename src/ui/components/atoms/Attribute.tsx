import React from "react";
import round from "lodash/round";
import styles from "./Attribute.module.css";

interface AttributeProps {
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

const Attribute: React.FC<AttributeProps> = ({
    delimeter = ":",
    label,
    value,
    polarity,
    display,
}) => {
    const getColor = (): string => {
        if (!polarity) return "black";
        return polarity > 0 ? "#10b981" : "#ef4444";
    };

    return (
        <>
            <dt className={styles.label}>
                {label}
                {delimeter}
            </dt>
            <dd
                className={styles.value}
                style={{ "--attribute-color": getColor() } as React.CSSProperties}
            >
                {display ?? round(value, 2)}
            </dd>
        </>
    );
};

export default Attribute;
