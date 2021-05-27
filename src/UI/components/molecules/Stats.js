import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"

const Stats = ({ stats, styles={} }) => {
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { stats.map((stat, i) => {
                return <Stat key={stat.id} stat={stat} polarity={stat.polarity} />
            })}
        </dl>
    )
}

export default Stats;