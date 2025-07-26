import React from "react";

interface LootIconStyles {
  width?: number;
  override?: string;
}

interface LootIconProps {
  category: string;
  color: string;
  icon: string;
  selected?: boolean;
  styles?: LootIconStyles;
}

const LootIcon: React.FC<LootIconProps> = ({ category, color, icon, selected, styles = {} }) => {
  // Parse the override style if provided
  const overrideProperty = styles.override?.split(':')[0];
  const overrideValue = styles.override?.split(':')[1];
  
  return (
    <>
      <img 
        className="styled-loot-icon"
        src={`graphics/images/loot/${category}/${icon}.png`} 
        alt="Loot!" 
      />
      
      <style jsx>{`
        .styled-loot-icon {
          border: 2px solid ${selected ? "red" : color};
          border-radius: 0.25rem;
          padding: 0.25rem;
          background-color: white;
          width: ${styles.width || 24}px;
          ${overrideProperty ? `${overrideProperty}: ${overrideValue};` : ''}
        }
      `}</style>
    </>
  );
}; 

export default LootIcon;