import React from "react"
import Stat from "@components/Stat"


const Stats = ({ children: stats, styles={} }) => {
    return (
        <dl className="stats-list">
            { stats.map(stat => {
                return <Stat key={stat.id} value={stat.value} label={stat.name} />
            })}
            <style jsx>{`
                .stats-list {
                    clear: both;
                    overflow: hidden;
                    margin: 0;
                    width: ${styles.width || 'auto'};
                }
            `}</style>
        </dl>
    )
}

export default Stats;