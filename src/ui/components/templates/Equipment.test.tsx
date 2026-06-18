import { describe, it, expect, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import store from "@store";
import { loadGame } from "@store/gameReducer";
import Equipment from "@components/Equipment";
import type { GameState } from "@store/gameReducer";
import type { LootItem } from "@/types/game";

// Equipment renders the singleton `@store`-backed <Inventory>, which reads
// `store.getState().game.inventory` directly rather than via useSelector. To keep
// the inventory grid and the useSelector-driven sections consistent, drive the
// real singleton store here and restore its initial slice after each test.
const initialGame: GameState = JSON.parse(JSON.stringify(store.getState().game));

function makeItem(overrides: Partial<LootItem> = {}): LootItem {
    return {
        __typename: "Item",
        id: "item-1",
        category: "helmet",
        color: "#abcdef",
        icon: "iron-helm",
        set: "helm",
        uuid: "uuid-1",
        stats: [{ id: "stat-def", name: "defence", value: 5 }],
        cost: 30,
        name: "Iron Helm",
        ...overrides,
    };
}

function seed(partial: Partial<GameState>) {
    store.dispatch(loadGame({ ...initialGame, ...partial }));
}

afterEach(() => {
    store.dispatch(loadGame(initialGame));
});

describe("Equipment template", () => {
    it("renders the four equipment slots, the inventory grid, and action buttons", () => {
        seed({ character: "Warrior", inventory: [], stats: { health_max: 100 } as never });
        const { container } = renderWithProviders(<Equipment />, { store });

        expect(container.querySelectorAll(`[data-testid="droppable-slot"]`)).toHaveLength(4);
        expect(container.querySelector(`[data-testid="loot-grid"]`)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sell" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Scrap" })).toBeInTheDocument();
    });

    it("renders equipped items in their slots and inventory items in the grid", () => {
        const helm = makeItem({ id: "equipped-helm", set: "helm", icon: "worn-helm" });
        const invItem = makeItem({
            id: "inv-sword",
            set: "weapon",
            category: "sword",
            icon: "rusty",
        });
        seed({
            character: "Warrior",
            equipment: { amulet: null, body: null, helm, weapon: null },
            inventory: [invItem],
            stats: {} as never,
        });
        const { container } = renderWithProviders(<Equipment />, { store });

        const icons = Array.from(container.querySelectorAll(`img[alt="Loot!"]`)).map((n) =>
            n.getAttribute("src")
        );
        expect(icons).toContain("graphics/images/loot/helmet/worn-helm.png");
        expect(icons).toContain("graphics/images/loot/sword/rusty.png");
    });

    it("sells the selected item only when it is in the inventory", () => {
        const sellable = makeItem({
            id: "sell-me",
            set: "weapon",
            category: "sword",
            icon: "blade",
        });
        seed({
            character: "Warrior",
            inventory: [sellable],
            selected: sellable,
            coins: 100,
            stats: {} as never,
        });
        renderWithProviders(<Equipment />, { store });

        fireEvent.click(screen.getByRole("button", { name: "Sell" }));

        const state = store.getState().game;
        // sellLoot removes the item from inventory and credits a third of its cost.
        expect(state.inventory.map((l) => l.id)).not.toContain("sell-me");
        expect(state.coins).toBe(100 + Math.round(sellable.cost / 3));
        expect(state.selected).toBeNull();
    });

    it("does not sell when the selected item is not in the inventory", () => {
        const notOwned = makeItem({ id: "ghost", set: "weapon" });
        seed({
            character: "Warrior",
            inventory: [],
            selected: notOwned,
            coins: 100,
            stats: {} as never,
        });
        renderWithProviders(<Equipment />, { store });

        fireEvent.click(screen.getByRole("button", { name: "Sell" }));

        const state = store.getState().game;
        expect(state.coins).toBe(100);
        expect(state.selected?.id).toBe("ghost");
    });
});
