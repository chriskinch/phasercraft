import React, { useEffect } from "react"
import "styled-components/macro"
import { useDrop, useDrag } from "react-dnd"
import { getEmptyImage } from "react-dnd-html5-backend"
import Loot from "@molecules/Loot"
import { selectLootVar, equippedVar } from "@root/cache"
import { lootMutations } from "@mutations"

const Inventory = ({cols=6, name, items}) => {
    const equipment = equippedVar();
    const equipped = Object.keys(equipment).map(slot => equipment[slot]?.id);
    const inventory = items.filter(item => !equipped.includes(item.id));
    
    // This must go here rather then inside the Loot component due to this bug:
    // https://github.com/react-dnd/react-dnd/issues/1589
    // Wraps the Loot component instead. Means some duplication of code. :(
    const LootDrag = (props) => {
        const { loot } = props;
        const { category, color, icon, set, id } = loot;
        let [{ isDragging }, drag, preview] = useDrag({
            item: { type: set, category, color, icon, id },
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult();
                if (item && dropResult) {
                    switch(dropResult.slot) {
                        case "amulet":
                        case "body":
                        case "helm":
                        case "weapon":
                            if(equipment[set]) lootMutations.unequipLoot(equipment[set]);
                            lootMutations.equipLoot(loot);
                            break;
                        default:
                            console.log("Unrecognized slot!");
                    }                
                }
            },
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            })
        })

        const draggingCSS = isDragging ? `
            opacity: 0.1;
            filter: grayscale(100%);
        ` : null

        useEffect(() => {
            preview(getEmptyImage(), { captureDraggingState: true })
        });

        return (
            <div ref={drag} css={draggingCSS}>
                <Loot {...props} />
            </div>
        );
    };

    const [, drop] = useDrop({
        accept: ["amulet", "body", "helm", "weapon"],
        drop: () => ({ slot: name })
    })

    return (
        <div 
            ref={drop}
            css={`
                display: grid;
                grid-template-columns: repeat(${cols}, 1fr);
                grid-gap: 1em;
                overflow-y: scroll;
            `}
        >
            { inventory &&
                inventory.map((loot, i) => {
                    // Check for matching selected uuid
                    return <LootDrag loot={loot} setSelected={() => {
                        selectLootVar(loot)
                    }} key={loot.id} id={i.toString()} />
                })
            }
        </div>
    );
}

export default Inventory;