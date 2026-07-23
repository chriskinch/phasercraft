import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@components/Button";
import { sellComponent, sellComponentStack } from "@store/gameReducer";
import { COMPONENT_DEFS } from "@/types/game";
import type { ComponentStack } from "@/types/game";
import styles from "./ComponentSellControls.module.css";

interface ComponentSellControlsProps {
    // The currently selected stack, or null when nothing is selected / the
    // selection was just sold out.
    stack: ComponentStack | null;
}

// Sell controls for the selected component stack: a quantity stepper (clamped to
// the stack) plus Sell 1 / Sell N / Sell All. Prices come from COMPONENT_DEFS.
const ComponentSellControls: React.FC<ComponentSellControlsProps> = ({ stack }) => {
    const dispatch = useDispatch();
    // Raw requested quantity; clamped on read to [1, stack.quantity] so a shrinking
    // stack or a change of selection can never leave it out of range.
    const [rawQty, setRawQty] = useState(1);

    if (!stack) {
        return (
            <div className={styles.controls}>
                <p className={styles.empty}>Select a component to sell.</p>
            </div>
        );
    }

    const def = COMPONENT_DEFS[stack.type];
    const qty = Math.min(Math.max(1, rawQty), stack.quantity);

    return (
        <div className={styles.controls} data-testid="sell-controls">
            <div className={styles.stepper}>
                <Button text="-" size={1} disabled={qty <= 1} onClick={() => setRawQty(qty - 1)} />
                <span className={styles.qty} data-testid="sell-qty">
                    {qty}
                </span>
                <Button
                    text="+"
                    size={1}
                    disabled={qty >= stack.quantity}
                    onClick={() => setRawQty(qty + 1)}
                />
            </div>
            <span className={styles.value} data-testid="sell-value">
                +{def.sellValue * qty}
            </span>
            <Button text="Sell 1" size={1} onClick={() => dispatch(sellComponent(stack.id, 1))} />
            {qty > 1 && (
                // Only shown when it differs from "Sell 1"; at qty 1 it would duplicate it.
                <Button
                    text={`Sell ${qty}`}
                    size={1}
                    onClick={() => dispatch(sellComponent(stack.id, qty))}
                />
            )}
            <Button
                text="Sell All"
                size={1}
                onClick={() => dispatch(sellComponentStack(stack.id))}
            />
        </div>
    );
};

export default ComponentSellControls;
