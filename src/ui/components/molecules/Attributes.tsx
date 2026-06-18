import React from "react";
import Attribute from "@components/Attribute";

import { v4 as uuid } from "uuid";
import listStyles from "./Attributes.module.css";

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
            {Object.entries(stats).map((stat, i) => {
                return (
                    <Attribute key={uuid()} value={stat[1]} label={stat[0].split("_").join(" ")} />
                );
            })}
        </dl>
    );
};

export default Attributes;
