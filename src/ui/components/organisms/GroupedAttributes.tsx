import React from "react";
import Attributes from "@components/Attributes";
import pick from "lodash/pick";

interface GroupedAttributesProps {
  stats: Record<string, number>;
}

const GroupedAttributes: React.FC<GroupedAttributesProps> = ({ stats }) => {
  const offence_stats = pick(stats, ["attack_power", "magic_power", "attack_speed", "critical_chance"]);
  const defence_stats = pick(stats, ["health_regen_rate", "health_regen_value", "defence", "speed"]);
  const support_stats = pick(stats, ["resource_regen_rate", "resource_regen_value"]);

  return (
    <>
      <Attributes>
        {offence_stats}
      </Attributes>
      <Attributes>
        {defence_stats}
      </Attributes>
      <Attributes>
        {support_stats}
      </Attributes>
    </>
  );
};

export default GroupedAttributes;