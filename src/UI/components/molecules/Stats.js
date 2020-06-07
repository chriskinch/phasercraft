import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"
import store from "@store"

const Stats = ({ children: { health, resource, ...stats }, styles={} }) => {
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
                return <Stat key={i} value={statValue(stat[1])} label={statLabel(stat[0], stat[1])} />
            })}
        </dl>
    )
}

export default Stats;