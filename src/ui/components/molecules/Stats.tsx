import React from "react";
import Stat from "@components/Stat";

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
    <dl className="stats-list">
      {stats.map(stat => {
        return <Stat key={stat.id} value={stat.value} label={stat.name} polarity={stat.polarity} />;
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
  );
};

export default Stats;