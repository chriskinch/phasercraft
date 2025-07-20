import React from "react"
import Attribute from "@components/Attribute"

import { v4 as uuid } from 'uuid';

const Attributes = ({ children: stats, styles={} }) => {
    return (
        <dl className="attributes-list">
            { Object.entries(stats).map((stat, i) => {
                return <Attribute key={uuid()} value={stat[1]} label={stat[0].split("_").join(" ")} />
            })}
            
            <style jsx>{`
                .attributes-list {
                    clear: both;
                    overflow: hidden;
                    margin: 0;
                    width: ${styles.width || 'auto'};
                }
            `}</style>
        </dl>
    )
}

export default Attributes;