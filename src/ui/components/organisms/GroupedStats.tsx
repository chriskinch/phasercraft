import React from "react";
import Stats from "@components/Stats";
import pick from "lodash/pick";

interface GroupedStatsProps {
  stats: Record<string, any>; // TODO: Define proper stats type
}

const GroupedStats: React.FC<GroupedStatsProps> = ({ stats }) => {
  console.log("WAIT: ", stats);
  const offence_stats = pick(stats, ["attack_power", "magic_power", "attack_speed", "critical_chance"]);
  const defence_stats = pick(stats, ["health_regen_rate", "health_regen_value", "defence", "speed"]);
  const support_stats = pick(stats, ["resource_regen_rate", "resource_regen_value"]);

  const convertToStatItems = (statsObj: Record<string, any>) => {
    return Object.entries(statsObj).map(([key, value]) => ({
      id: key,
      name: key.replace(/_/g, ' '),
      value: value
    }));
  };

  return (
    <>
      <Stats>
        {convertToStatItems(offence_stats)}
      </Stats>
      <Stats>
        {convertToStatItems(defence_stats)}
      </Stats>
      <Stats>
        {convertToStatItems(support_stats)}
      </Stats>
    </>
  );
};

export default GroupedStats;