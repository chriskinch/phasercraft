import React, { useEffect } from "react";

import { useDrop, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import Loot from "@components/Loot";
import { useSelector, useDispatch } from "react-redux";
import { equipLoot, selectLoot, unequipLoot } from "@store/gameReducer";
import type { LootItem } from "@/types/game";
import type { RootState } from "@store";
import styles from "./LootListDrag.module.css";

interface LootListDragProps {
    cols?: number;
    list: LootItem[];
    name: string;
}

const LootListDrag: React.FC<LootListDragProps> = ({ cols = 6, list, name }) => {
    const dispatch = useDispatch();
    const selected = useSelector((state: RootState) => state.game.selected);
    const equipment = useSelector((state: RootState) => state.game.equipment);

    const handleDropResult = (loot: LootItem, set: string) => {
        if (equipment[set as keyof typeof equipment])
            dispatch(unequipLoot(equipment[set as keyof typeof equipment]!));
        dispatch(equipLoot(loot));
    };
    // This must go here rather then inside the Loot component due to this bug:
    // https://github.com/react-dnd/react-dnd/issues/1589
    // Wraps the Loot component instead. Means some duplication of code. :(
    const LootDrag: React.FC<{
        loot: LootItem;
        isSelected?: boolean;
        setSelected: () => void;
        id: string;
    }> = (props) => {
        const { loot } = props;
        const { category, color, icon, set, uuid } = loot;
        // Items without a set (unrecognized categories) cannot be equipped; use a
        // placeholder type that no drop target accepts.
        const dragType = set ?? "__unequippable__";

        const [{ isDragging }, drag, preview] = useDrag({
            type: dragType,
            item: { category, color, icon, uuid },
            end: (item, monitor) => {
                const dropResult = monitor.getDropResult() as { slot: string } | null;
                if (item && dropResult && set) {
                    switch (dropResult.slot) {
                        case "amulet":
                        case "body":
                        case "helm":
                        case "weapon":
                            handleDropResult(loot, set);
                            break;
                        default:
                            console.log("Unrecognized slot!");
                    }
                }
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        useEffect(() => {
            preview(getEmptyImage(), { captureDraggingState: true });
        });

        return (
            <div
                ref={(node) => {
                    drag(node);
                }}
                className={isDragging ? styles.dragging : ""}
            >
                <Loot
                    loot={props.loot}
                    isSelected={props.isSelected}
                    setSelected={props.setSelected}
                />
            </div>
        );
    };

    const [, drop] = useDrop({
        accept: ["amulet", "body", "helm", "weapon"],
        drop: () => ({ slot: name }),
    });

    return (
        <div
            ref={(node) => {
                drop(node);
            }}
            className={styles.lootGrid}
            style={{ "--cols": cols } as React.CSSProperties}
            data-testid="loot-grid"
        >
            {list &&
                list.map((loot, i) => {
                    // Check for matching selected uuid
                    const isSelected = selected ? selected.id === loot.id : false;
                    return (
                        <LootDrag
                            loot={loot}
                            isSelected={isSelected}
                            setSelected={() => {
                                dispatch(selectLoot(loot));
                            }}
                            key={loot.id}
                            id={i.toString()}
                        />
                    );
                })}
        </div>
    );
};

export default LootListDrag;
