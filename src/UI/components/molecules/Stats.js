import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"

const Stats = ({ label, children: { health, resource, ...stats }, styles={} }) => {
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { Object.entries(stats).map((stat, i) => {
                console.log("STAT: ", stat)
                return <Stat key={i} type={stat[0]} value={stat[1]} label={label} />
            })}
        </dl>
    )
}

export default Stats;