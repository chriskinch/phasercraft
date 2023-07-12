import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"

const Stats = ({ children: stats, styles={} }) => {
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { stats.map(stat => {
                return <Stat key={stat.id} value={stat.value} label={stat.name} />
            })}
        </dl>
    )
}

export default Stats;