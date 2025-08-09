import React from "react";
import Stat from "@components/Stat";

interface HealthStats {
  health_max: number;
  health_regen_value: number;
  health_regen_rate: number;
}

interface HealthProps {
  stats: HealthStats;
}

const Health: React.FC<HealthProps> = ({ stats }) => {
  const { health_max, health_regen_value, health_regen_rate } = stats;
  const regen = health_regen_value * health_regen_rate;
  
  return (
    <>
      <dl className="health-bar">
        <Stat label={"HP"} value={health_max} />
      </dl>
      <dl className="health-regen">
        <Stat label="Regen" delimeter={" "} value={regen} />
      </dl>
      <style jsx>{`
        .health-bar {
          border: 4px solid black;
          background-color: red;
          margin-bottom: 0;
          overflow: hidden;
          padding: 0.25em;
          position: relative;
        }
        .health-bar:after {
          position: absolute;
          border-bottom: 2px solid rgba(0,0,0,0.2);
          border-right: 2px solid rgba(0,0,0,0.2);
          bottom: 0;
          content: '';
          left: 0;
          right: 0;
          top: 0;
        }
        .health-regen {
          float: left;
          margin-top: 0;
        }
      `}</style>
    </>
  );
};

export default Health;