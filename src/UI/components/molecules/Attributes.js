import React from "react"
import Attribute from "@atoms/Attribute"
import "styled-components/macro"
import { v4 as uuid } from 'uuid';

const Attributes = ({ children: stats, styles={} }) => {
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { Object.entries(stats).map((stat, i) => {
                return <Attribute key={uuid()} value={stat[1]} label={stat[0].split("_").join(" ")} />
            })}
        </dl>
    )
}

export default Attributes;