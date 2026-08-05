import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Merchant from "@components/Merchant";
import { componentBuyPrice, merchantWindow, merchantPartsBase } from "@/types/game";
import type { GameState, MerchantState, MerchantMode } from "@store/gameReducer";
import type { ComponentType, LootItem } from "@/types/game";

// A merchant slice pinned to the current wall-clock window (so the component's
// mount refresh doesn't wipe it) with plenty of every part in stock. Buy tests
// then never depend on the window's random base roll. The Buy/Sell toggle lives
// in the shared header (see MerchantModeToggle), so `mode` is seeded here rather
// than clicked in these panel-only tests.
function stockedMerchant(over: Partial<MerchantState> = {}): MerchantState {
    return {
        mode: "buy",
        partsWindow: merchantWindow(Date.now()),
        partsDelta: { scrap: 50, cloth: 50, ichor: 50, bone: 50 },
        gearStock: [],
        ...over,
    };
}

function makeItem(overrides: Partial<LootItem> = {}): LootItem {
    return {
        __typename: "Item",
        id: "item-1",
        category: "sword",
        color: "#abcdef",
        icon: "blade",
        set: "weapon",
        uuid: "uuid-1",
        stats: [{ id: "stat-def", name: "defence", value: 5 }],
        cost: 30,
        name: "Iron Blade",
        ...overrides,
    };
}

function render(partial: Partial<GameState>, mode: MerchantMode = "buy") {
    const base = partial.merchant ?? stockedMerchant();
    return renderWithProviders(<Merchant />, {
        preloadedGame: { ...partial, merchant: { ...base, mode } },
    });
}

const actions = () => within(screen.getByTestId("merchant-actions"));

describe("Merchant template", () => {
    it("shows the coin balance, tabs and (in Buy/Parts) the shop grid + countdown", () => {
        render({ coins: 42 });

        expect(screen.getByTestId("merchant-coins")).toHaveTextContent("42");
        expect(screen.getByRole("button", { name: "Gear" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Parts" })).toBeInTheDocument();
        // Buy + Parts (defaults) shows the shop grid and a restock countdown.
        expect(screen.getByTestId("parts-shop-grid")).toBeInTheDocument();
        expect(screen.getByTestId("restock-timer")).toHaveTextContent(/Refreshes in \d+:\d\d/);
    });

    describe("Buy — Parts", () => {
        it("buys the selected part: deducts price, adds a stack, drops shop stock", () => {
            const { store } = render({ coins: 100, components: [] });

            fireEvent.click(screen.getByRole("button", { name: /^Scrap/ }));
            fireEvent.click(actions().getByRole("button", { name: "Buy" }));

            const price = componentBuyPrice("scrap"); // 2 * 3 = 6
            const state = store.getState().game;
            expect(state.coins).toBe(100 - price);
            expect(state.components.find((s) => s.type === "scrap")?.quantity).toBe(1);
            expect(state.merchant.partsDelta.scrap).toBe(49);
        });

        it("buys a chosen quantity via the stepper", () => {
            const { store } = render({ coins: 100, components: [] });

            fireEvent.click(screen.getByRole("button", { name: /^Scrap/ }));
            const stepper = screen.getByTestId("buy-stepper");
            fireEvent.click(within(stepper).getByRole("button", { name: "+" }));
            fireEvent.click(actions().getByRole("button", { name: "Buy 2" }));

            const state = store.getState().game;
            expect(state.coins).toBe(100 - componentBuyPrice("scrap") * 2);
            expect(state.components.find((s) => s.type === "scrap")?.quantity).toBe(2);
        });

        it("cannot select or buy a sold-out part", () => {
            const window = merchantWindow(Date.now());
            const type: ComponentType = "scrap";
            // Cancel the window's base roll so scrap shows zero in stock.
            const base = merchantPartsBase(window, type);
            render({
                coins: 100,
                merchant: stockedMerchant({ partsWindow: window, partsDelta: { scrap: -base } }),
            });

            expect(screen.getByRole("button", { name: /^Scrap/ })).toBeDisabled();
        });
    });

    describe("Buy — Gear", () => {
        it("buys back sold gear for the refund price and returns it to the inventory", () => {
            const item = makeItem({ id: "buyback", cost: 30 });
            const { store } = render({
                coins: 100,
                inventory: [],
                loot: [item],
                selected: item,
                merchant: stockedMerchant({ gearStock: [item] }),
            });

            fireEvent.click(screen.getByRole("button", { name: "Gear" }));
            fireEvent.click(actions().getByRole("button", { name: "Buy" }));

            const state = store.getState().game;
            expect(state.inventory.map((l) => l.id)).toContain("buyback");
            expect(state.coins).toBe(100 - Math.round(item.cost / 3));
            expect(state.merchant.gearStock).toEqual([]);
        });
    });

    describe("Sell", () => {
        it("has no buy controls in sell mode", () => {
            render({ coins: 100 }, "sell");

            expect(screen.queryByTestId("buy-parts-controls")).not.toBeInTheDocument();
            expect(screen.queryByTestId("restock-timer")).not.toBeInTheDocument();
            expect(actions().getByRole("button", { name: "Sell" })).toBeInTheDocument();
        });

        it("sells the selected gear item and credits a third of its cost", () => {
            const sellable = makeItem({ id: "sell-me", cost: 30 });
            const { store } = render(
                { inventory: [sellable], selected: sellable, coins: 100 },
                "sell"
            );

            fireEvent.click(screen.getByRole("button", { name: "Gear" }));
            fireEvent.click(actions().getByRole("button", { name: "Sell" }));

            const state = store.getState().game;
            expect(state.inventory.map((l) => l.id)).not.toContain("sell-me");
            expect(state.coins).toBe(100 + Math.round(sellable.cost / 3));
            // Sold gear becomes buyable back from the merchant.
            expect(state.merchant.gearStock.map((l) => l.id)).toContain("sell-me");
        });

        it("sells a component stack and raises the merchant's stock", () => {
            const { store } = render(
                { components: [{ id: "stack-1", type: "cloth", quantity: 4 }], coins: 0 },
                "sell"
            );

            // Parts is the default tab; select the stack, then sell it all.
            fireEvent.click(screen.getByRole("button", { name: "Cloth ×4" }));
            fireEvent.click(actions().getByRole("button", { name: "Sell All" }));

            const state = store.getState().game;
            expect(state.components).toEqual([]);
            expect(state.coins).toBeGreaterThan(0);
            expect(state.merchant.partsDelta.cloth).toBeGreaterThanOrEqual(4);
        });
    });
});
