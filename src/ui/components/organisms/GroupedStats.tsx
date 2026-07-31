import React from "react";
import Stats from "@components/Stats";
import pick from "lodash/pick";
import type { PlayerStats } from "@/types/game";
import { formatStatValue } from "@/lib/statConversion";

interface StatItem {
    id: string;
    name: string;
    value: number;
    display: string;
}

interface GroupedStatsProps {
    stats: Partial<PlayerStats>;
}

const GroupedStats: React.FC<GroupedStatsProps> = ({ stats }) => {
    const offence_stats = pick(stats, [
        "attack_power",
        "magic_power",
        "attack_speed",
        "critical_chance",
    ]);
    const defence_stats = pick(stats, [
        "health_regen_rate",
        "health_regen_value",
        "defence",
        "speed",
    ]);
    const support_stats = pick(stats, ["resource_regen_rate", "resource_regen_value"]);

    const convertToStatItems = (statsObj: Record<string, number>): StatItem[] => {
        return Object.entries(statsObj).map(([key, value]) => ({
            id: key,
            name: key.replace(/_/g, " "),
            value: value,
            // `key` is the raw stat name, so the unit comes from the same table the
            // reducer uses — attack speed reads "0.98s", crit reads "13%".
            display: formatStatValue(key, value),
        }));
    };

    return (
        <>
            <Stats>{convertToStatItems(offence_stats)}</Stats>
            <Stats>{convertToStatItems(defence_stats)}</Stats>
            <Stats>{convertToStatItems(support_stats as Record<string, number>)}</Stats>
        </>
    );
};

export default GroupedStats;
