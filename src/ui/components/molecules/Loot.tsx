import React from "react";

import LootIcon from "@components/LootIcon";
import ItemTooltip from "./ItemTooltip";
import type { LootItem } from "@/types/game";

interface LootProps {
    loot: LootItem & { isHidden?: boolean };
    isSelected?: boolean;
    setSelected?: () => void;
    size?: number;
}

const Loot: React.FC<LootProps> = ({ loot, loot: { id }, isSelected, setSelected, size }) => {
    if (loot.isHidden) return null;

    return (
        <>
            <ItemTooltip id={id} loot={loot} />
            <div
                data-tooltip-id={id}
                onClick={setSelected ? () => setSelected() : undefined}
                onContextMenu={(e) => e.preventDefault()}
                className="leading-none"
            >
                <LootIcon {...loot} selected={isSelected} size={size} />
            </div>
        </>
    );
};

export default Loot;
