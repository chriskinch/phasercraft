import React, { useState } from "react";
import { useSelector } from "react-redux";
import ComponentsGrid from "./ComponentsGrid";
import ComponentSellControls from "./ComponentSellControls";
import type { RootState } from "@store";
import styles from "./ComponentsPanel.module.css";

// The Components tab: the stacked grid plus its batch-sell controls. Owns the
// selected-stack id and resolves it against the live store, so a stack that gets
// sold out (and removed) resolves to null and the controls fall back to their
// empty state without stale references.
const ComponentsPanel: React.FC = () => {
    const components = useSelector((state: RootState) => state.game.components);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = components.find((stack) => stack.id === selectedId) ?? null;

    return (
        <div className={styles.panel}>
            <div className={styles.gridArea}>
                <ComponentsGrid selectedId={selectedId} onSelectStack={setSelectedId} />
            </div>
            <ComponentSellControls stack={selected} />
        </div>
    );
};

export default ComponentsPanel;
