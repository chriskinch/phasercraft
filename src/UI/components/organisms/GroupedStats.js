import { v4 as uuid } from "uuid"
import React from "react"
import Stats from "@molecules/Stats"
import pick from "lodash/pick"


const GroupedStats = ({ stats }) => {
    const statArray = Object.entries(stats).map(stat => ({id: uuid(), name: stat[0], value: stat[1]}));

    const offence_stats = statArray.filter(stat => ["attack_power", "magic_power", "attack_speed", "critical_chance"].includes(stat.name));
    const defence_stats = statArray.filter(stat => ["health_regen_rate", "health_regen_value", "defence", "speed"].includes(stat.name));
    // const support_stats = statArray.filter(stat => ["resource_regen_rate", "resource_regen_value"].includes(stat.name));

    return (
        <>
            <Stats stats={offence_stats} />
            <Stats stats={defence_stats} />
            {/* <Stats stats={support_stats} /> */}
        </>
    )
}

export default GroupedStats;