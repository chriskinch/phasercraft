import React, { useContext } from "react"
import { MenuContext } from "@ui/UI"

const Price = ({ cost }) => {
    const menu = useContext(MenuContext);

    const {color, icon, value} = menu === 'equipment' ? { 
        value: Math.round(cost * 0.25),
        icon: 'sell',
        color: '#a5b4c1'
    } : {
        value: cost,
        icon: 'coin',
        color: '#ffc34d'
    }
    
    return (
        <div className="price-container">
            <img 
                className="price-icon"
                src={`./UI/icons/${icon}.gif`} 
                alt="Item cost:" 
            /> {value}
            
            <style jsx>{`
                .price-container {
                    background-color: rgba(255, 255, 255, 0.95);
                    border: 4px solid ${color};
                    border-radius: 0.125rem;
                    font-size: 1.125rem;
                    padding: 0.25rem 0.5rem;
                    white-space: nowrap;
                }
                
                .price-icon {
                    width: 0.5rem;
                    display: inline-block;
                }
            `}</style>
        </div>
    );
}

export default Price;