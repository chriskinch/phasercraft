import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { combineScrolls, deconstructScroll, tradeScroll } from "@store/gameReducer";
import Button from "@components/Button";
import ScrollsGrid from "@components/ScrollsGrid";
import Toast from "@components/Toast";
import ArcanumCraft from "@components/ArcanumCraft";
import { SCROLL_MERGE_COUNT, SPELL_DEFS } from "@/types/game";
import { mergeStatus, scrollStacks } from "@/lib/scrollStatus";
import { deconstructStatus, deconstructYield, tradeStatus, yieldText } from "@/lib/spellCraft";
import type { ScrollStackView } from "@/lib/scrollStatus";
import type { RootState } from "@store";
import theme from "@ui/themes.module.css";
import styles from "./Arcanum.module.css";

// Merge button colour (as Equipment "Learn" / Blacksmith "Use item").
const MERGE_COLOR = "#c9a3ff";

const statusFor = ({ spell, level, count }: ScrollStackView) => mergeStatus(spell, level, count);

// Arcanum (#386, #582): the town shop for scrolls. The header tabs pick Merge
// (3 of a spell at one level → 1 of the next; Trade a scroll to learn its
// recipe; Deconstruct one into parts) or Craft (learnt recipes → L1 scrolls).
// Same scroll grid as Equipment → Scrolls; its tooltip hint carries the Merge
// rule, and the selected stack's Trade/Deconstruct hints sit under the grid.
const Arcanum: React.FC = () => {
    const dispatch = useDispatch();
    const game = useSelector((state: RootState) => state.game);
    const { scrolls, arcanumTab } = game;
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
    const clearToast = useCallback(() => setToast(null), []);
    const notify = useCallback(
        (message: string) => setToast((t) => ({ id: (t?.id ?? 0) + 1, message })),
        []
    );

    if (arcanumTab === "craft") return <ArcanumCraft />;

    // Resolved against the live store, so a stack used up drops the selection.
    const stacks = scrollStacks(scrolls);
    const scroll = stacks.find((s) => s.key === selectedKey) ?? null;
    const merge = scroll ? statusFor(scroll) : null;
    const trade = scroll ? tradeStatus(game, scroll.spell, scroll.level) : null;
    const deconstruct = scroll ? deconstructStatus(game, scroll.spell, scroll.level) : null;

    const onMerge = () => {
        if (!scroll || !merge?.readable) return;
        const { spell, level } = scroll;
        dispatch(combineScrolls(spell, level));
        notify(`Merged ${SCROLL_MERGE_COUNT} ${SPELL_DEFS[spell].name} L${level} → L${level + 1}`);
    };

    const onTrade = () => {
        if (!scroll || !trade?.enabled) return;
        dispatch(tradeScroll(scroll.spell, scroll.level));
        notify(`Learnt the ${SPELL_DEFS[scroll.spell].name} recipe`);
    };

    const onDeconstruct = () => {
        if (!scroll || !deconstruct?.enabled) return;
        const { spell, level } = scroll;
        dispatch(deconstructScroll(spell, level));
        notify(`Got ${yieldText(deconstructYield(spell, level))}`);
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
            {trade && deconstruct && (
                <ul className={styles.hints} data-testid="arcanum-hints">
                    <li>Trade: {trade.hint}</li>
                    <li>Deconstruct: {deconstruct.hint}</li>
                </ul>
            )}
            <section className={styles.actionsSection}>
                {/* Disabled (grey) whenever the action would be refused; the
                    tooltip / hint lines say why. */}
                <Button
                    text="Merge"
                    bg_color={merge?.readable ? MERGE_COLOR : undefined}
                    disabled={!merge?.readable}
                    onClick={onMerge}
                />
                <Button
                    text="Trade"
                    bg_color={trade?.enabled ? MERGE_COLOR : undefined}
                    disabled={!trade?.enabled}
                    onClick={onTrade}
                />
                <Button
                    text="Deconstruct"
                    disabled={!deconstruct?.enabled}
                    onClick={onDeconstruct}
                />
            </section>
        </div>
    );
};

export default Arcanum;
