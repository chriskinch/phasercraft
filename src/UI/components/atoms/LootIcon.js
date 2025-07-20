import React from "react";

const LootIcon = ({ category, color, icon, selected, styles={} }) => {
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
    )
}; 

export default LootIcon;