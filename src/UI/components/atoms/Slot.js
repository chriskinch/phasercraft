import React from "react"

const Slot = ({loot, component, background, compare}) => {
    const Component = component;
    return (
        <>
            <div 
                className={`capitalize ${background ? 'pixel-emboss' : ''}`}
            >
                { loot && <Component loot={loot} compare={compare} /> }
            </div>
            
            <style jsx>{`
                .capitalize {
                    text-transform: capitalize;
                }
                
                .pixel-emboss {
                    background: rgba(0,0,0,0.1);
                    border-top: 6px solid rgba(0,0,0,0.1);
                    box-shadow: 0 -6px 0 rgba(0,0,0,0.3);
                    margin: 6px;
                    text-align: center;
                    position: relative;
                }
            `}</style>
        </>
    );
}

export default Slot;