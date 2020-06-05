import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"

const StatsCompared = ({ info, children: { health, resource, ...stats }, compare, styles={} }) => {
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { Object.entries(stats).map((stat, i) => {
                const compare_value = compare ? compare.stats[stat[0]] : null;
                return <Stat key={i} type={stat[0]} label='label' value={stat[1]} info={info} compare_value={compare_value} />
            })}
        </dl>
    )
}

export default StatsCompared;