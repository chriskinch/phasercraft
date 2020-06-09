import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"
import { v4 as uuid } from 'uuid';

const Stats = ({ children: stats, styles={} }) => {
    const statValue = stat => typeof stat === 'number' ? stat : stat.rounded;
    const statLabel = (key, stat) => typeof stat === 'number' ? key.split("_").join(" ") : stat.label;
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { Object.entries(stats).map((stat, i) => {
                return <Stat key={uuid()} value={statValue(stat[1])} label={statLabel(stat[0], stat[1])} polarity={stat[1].polarity} />
            })}
        </dl>
    )
}

export default Stats;