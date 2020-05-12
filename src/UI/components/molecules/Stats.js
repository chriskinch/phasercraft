import React from "react"
import Stat from "@atoms/Stat"
import "styled-components/macro"

const Stats = ({ info, children: { health, resource, ...stats }, styles={} }) => {
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            font-size: ${styles.size || 1}em;
            margin: 0;
            width: ${styles.width || 'auto'};
        `}>
            { Object.entries(stats).map((stat, i) => <Stat key={i} label={stat[0]} value={stat[1]} info={info} /> ) }
        </dl>
    )
}

export default Stats;