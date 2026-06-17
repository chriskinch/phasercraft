import React from "react";
import round from "lodash/round";
import styles from "./Attribute.module.css";

interface AttributeProps {
    delimeter?: string;
    label: string;
    value: number;
    polarity?: number;
}

const Attribute: React.FC<AttributeProps> = ({ delimeter = ":", label, value, polarity }) => {
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
                {round(value, 2)}
            </dd>
        </>
    );
};

export default Attribute;
