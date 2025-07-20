import React from "react"
import Stats from "@components/Stats"
import pick from "lodash/pick"

const GroupedAttributes = ({ stats }) => {
    console.log("WAIT: ", stats)
    const offence_stats = pick(stats, ["attack_power", "magic_power", "attack_speed", "critical_chance"]);
    const defence_stats = pick(stats, ["health_regen_rate", "health_regen_value", "defence", "speed"]);
    const support_stats = pick(stats, ["resource_regen_rate", "resource_regen_value"]);

    return (
        <>
            <Stats>
                {offence_stats}
            </Stats>
            <Stats>
                {defence_stats}
            </Stats>
            <Stats>
                {support_stats}
            </Stats>
        </>
    )
}

export default GroupedAttributes;