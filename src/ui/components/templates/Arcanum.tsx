import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { combineScrolls } from "@store/gameReducer";
import Button from "@components/Button";
import ScrollsGrid from "@components/ScrollsGrid";
import Toast from "@components/Toast";
import { SCROLL_MERGE_COUNT, SPELL_DEFS } from "@/types/game";
import { mergeStatus, scrollStacks } from "@/lib/scrollStatus";
import type { ScrollStackView } from "@/lib/scrollStatus";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Arcanum.module.css";

// Merge button colour (as Equipment "Learn" / Blacksmith "Use item").
const MERGE_COLOR = "#c9a3ff";

const statusFor = ({ spell, level, count }: ScrollStackView) => mergeStatus(spell, level, count);

// Arcanum (#386): the town shop where held scrolls are merged, 3 of a spell at
// one level → 1 of the next level (docs/specs/abilities-ui.md). Same scroll grid
// as Equipment → Scrolls; its tooltip hint carries the Merge rule instead.
const Arcanum: React.FC = () => {
    const dispatch = useDispatch();
    const scrolls = useSelector((state: RootState) => state.game.scrolls);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const clearToast = useCallback(() => setToast(null), []);

    // Resolved against the live store, so a stack merged down to zero drops the
    // selection.
    const stacks = scrollStacks(scrolls);
    const scroll = stacks.find((s) => s.key === selectedKey) ?? null;
    const status = scroll ? statusFor(scroll) : null;

    const merge = () => {
        if (!scroll || !status?.readable) return;
        const { spell, level } = scroll;
        dispatch(combineScrolls(spell, level));
        const message = `Merged ${SCROLL_MERGE_COUNT} ${SPELL_DEFS[spell].name} L${level} → L${level + 1}`;
        setToast((t) => ({ id: (t?.id ?? 0) + 1, message }));
    };

    return (
        <div className={styles.container}>
            <section className={`${theme.pixelEmboss} ${styles.inventorySection}`}>
                {stacks.length === 0 ? (
                    <p className={styles.empty}>No scrolls yet. Find them in dungeons.</p>
                ) : (
                    <ScrollsGrid
                        selectedKey={selectedKey}
                        onSelect={setSelectedKey}
                        statusFor={statusFor}
                    />
                )}
                {toast && <Toast key={toast.id} message={toast.message} onDone={clearToast} />}
            </section>
            <section className={styles.actionsSection}>
                {/* Disabled (grey) whenever the merge would be refused; the
                    tooltip's hint line says why. */}
                <Button
                    text="Merge"
                    bg_color={status?.readable ? MERGE_COLOR : undefined}
                    disabled={!status?.readable}
                    onClick={merge}
                />
            </section>
        </div>
    );
};

export default Arcanum;
