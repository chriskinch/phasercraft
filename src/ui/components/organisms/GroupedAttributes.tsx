import React from "react";
import Attributes from "@components/Attributes";
import pick from "lodash/pick";
import type { PlayerStats } from "@/types/game";

interface GroupedAttributesProps {
    stats: PlayerStats;
}

// The picked groups only ever hold the numeric stat values shown below; the
// assertion narrows the PlayerStats index signature (number | string | undefined)
// to the Record<string, number> that Attributes consumes, without altering any
// runtime values.
type NumericStats = Record<string, number>;

const GroupedAttributes: React.FC<GroupedAttributesProps> = ({ stats }) => {
    const offence_stats = pick(stats, [
        "attack_power",
        "magic_power",
        "attack_speed",
        "critical_chance",
    ]) as NumericStats;
    const defence_stats = pick(stats, [
        "health_regen_rate",
        "health_regen_value",
        "defence",
        "speed",
    ]) as NumericStats;
    const support_stats = pick(stats, [
        "resource_regen_rate",
        "resource_regen_value",
    ]) as NumericStats;

    return (
        <>
            <Attributes>{offence_stats}</Attributes>
            <Attributes>{defence_stats}</Attributes>
            <Attributes>{support_stats}</Attributes>
        </>
    );
};

export default GroupedAttributes;
