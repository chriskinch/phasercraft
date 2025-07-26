import React from "react";

import LootIcon from "@components/LootIcon";
import Stats from "@components/Stats";

interface DetailedLootProps {
  id: string;
  loot: {
    info?: any;
    stats?: any;
    [key: string]: any; // TODO: Define proper loot type
  };
  compare?: any; // TODO: Define proper compare type
}

const DetailedLoot: React.FC<DetailedLootProps> = ({ id, loot, compare }) => {
  return (
    <div className="detailed-loot-container">
      <LootIcon 
        category={loot.category || 'default'} 
        color={loot.color || '#000'} 
        icon={loot.icon || 'default'} 
        styles={{ width: 16, override: 'margin-right:0.5em;' }} 
      />
      <Stats styles={{ width: '100%' }}>{loot.stats}</Stats>
      
      <style jsx>{`
        .detailed-loot-container {
          display: flex;
          align-items: flex-start;
          background-color: white;
          padding: 0.25rem;
          border: 2px solid #1f2937;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default DetailedLoot;