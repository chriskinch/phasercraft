import { describe, it, expect, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import store from "@store";
import { loadGame } from "@store/gameReducer";
import Merchant from "@components/Merchant";
import { componentBuyPrice } from "@/types/game";
import type { GameState } from "@store/gameReducer";
import type { LootItem } from "@/types/game";

// Merchant reads the store via useSelector (coins, inventory, components), so we
// seed the singleton `@store` with `loadGame` and pass it as the provider store —
// the same approach as the Equipment tests. The initial slice is restored after
// each test.
const initialGame: GameState = JSON.parse(JSON.stringify(store.getState().game));

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

function seed(partial: Partial<GameState>) {
    store.dispatch(loadGame({ ...initialGame, ...partial }));
}

afterEach(() => {
    store.dispatch(loadGame(initialGame));
});

describe("Merchant template", () => {
    it("renders its heading, coin balance, tabs and the Sell button", () => {
        seed({ coins: 42, inventory: [], components: [] });
        renderWithProviders(<Merchant />, { store });

        expect(screen.getByRole("heading", { name: "Merchant" })).toBeInTheDocument();
        expect(screen.getByTestId("merchant-coins")).toHaveTextContent("42");
        expect(screen.getByRole("button", { name: "Gear" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Parts" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sell" })).toBeInTheDocument();
        // Buy controls are on the Parts tab only.
        expect(screen.queryByTestId("buy-section")).not.toBeInTheDocument();
    });

    it("sells the selected gear item and credits a third of its cost", () => {
        const sellable = makeItem({ id: "sell-me", cost: 30 });
        seed({ inventory: [sellable], selected: sellable, coins: 100 });
        renderWithProviders(<Merchant />, { store });

        fireEvent.click(screen.getByRole("button", { name: "Sell" }));

        const state = store.getState().game;
        expect(state.inventory.map((l) => l.id)).not.toContain("sell-me");
        expect(state.coins).toBe(100 + Math.round(sellable.cost / 3));
    });

    describe("Parts tab", () => {
        it("buys a part: deducts its price and adds it to the stacks", () => {
            seed({ coins: 100, components: [] });
            renderWithProviders(<Merchant />, { store });
            fireEvent.click(screen.getByRole("button", { name: "Parts" }));

            const price = componentBuyPrice("scrap"); // 2 * 3 = 6
            fireEvent.click(screen.getByRole("button", { name: `Scrap ${price}` }));

            const state = store.getState().game;
            expect(state.coins).toBe(100 - price);
            const scrap = state.components.find((s) => s.type === "scrap");
            expect(scrap?.quantity).toBe(1);
        });

        it("stacks a bought part onto an existing non-full stack", () => {
            seed({ coins: 100, components: [{ id: "stack-1", type: "scrap", quantity: 5 }] });
            renderWithProviders(<Merchant />, { store });
            fireEvent.click(screen.getByRole("button", { name: "Parts" }));

            const price = componentBuyPrice("scrap");
            fireEvent.click(screen.getByRole("button", { name: `Scrap ${price}` }));

            const state = store.getState().game;
            expect(state.components).toHaveLength(1);
            expect(state.components[0].quantity).toBe(6);
            expect(state.coins).toBe(100 - price);
        });

        it("disables a buy button the player cannot afford", () => {
            seed({ coins: 5, components: [] });
            renderWithProviders(<Merchant />, { store });
            fireEvent.click(screen.getByRole("button", { name: "Parts" }));

            const ichorPrice = componentBuyPrice("ichor"); // 8 * 3 = 24
            expect(screen.getByRole("button", { name: `Ichor ${ichorPrice}` })).toBeDisabled();
            // Scrap (6) is also unaffordable at 5 coins.
            expect(
                screen.getByRole("button", { name: `Scrap ${componentBuyPrice("scrap")}` })
            ).toBeDisabled();
        });
    });
});
