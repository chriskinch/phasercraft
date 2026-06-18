import React from "react";
import Stat from "@components/Stat";
import listStyles from "./Stats.module.css";

interface StatItem {
    id: string;
    value: number;
    name: string;
    polarity?: number;
}

interface StatsStyles {
    width?: string;
}

interface StatsProps {
    children: StatItem[];
    styles?: StatsStyles;
}

const Stats: React.FC<StatsProps> = ({ children: stats, styles = {} }) => {
    return (
        <dl
            className={listStyles.statsList}
            style={{ "--stats-width": styles.width || "auto" } as React.CSSProperties}
        >
            {stats.map((stat) => {
                return (
                    <Stat
                        key={stat.id}
                        value={stat.value}
                        label={stat.name}
                        polarity={stat.polarity}
                    />
                );
            })}
        </dl>
    );
};

export default Stats;
