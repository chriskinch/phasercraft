import React from "react";
import Attribute from "@components/Attribute";

import listStyles from "./Attributes.module.css";
import { formatStatValue } from "@/lib/statConversion";

interface AttributesStyles {
    width?: string;
}

interface AttributesProps {
    children: Record<string, number>;
    styles?: AttributesStyles;
}

const Attributes: React.FC<AttributesProps> = ({ children: stats, styles = {} }) => {
    return (
        <dl
            className={listStyles.attributesList}
            style={{ "--attributes-width": styles.width || "auto" } as React.CSSProperties}
        >
            {Object.entries(stats).map(([name, value]) => {
                return (
                    <Attribute
                        // The stat name is stable and unique within a group; the previous
                        // uuid() key minted a fresh one on every render, remounting each row.
                        key={name}
                        value={value}
                        label={name.split("_").join(" ")}
                        // Units come from the same table the reducer applies, so attack
                        // speed reads "0.98s" and crit reads "13%" rather than bare numbers.
                        display={formatStatValue(name, value)}
                    />
                );
            })}
        </dl>
    );
};

export default Attributes;
