import { describe, it, expect } from "vitest";
import {
    gameReducer,
    addCoins,
    addXP,
    nextWave,
    toggleFilter,
    setSaveSlot,
    setCurrentArea,
    setPlayerPosition,
    sellLoot,
    buyLoot,
    switchUi,
} from "./gameReducer";
import type { LootItem } from "@/types/game";

const makeItem = (overrides: Partial<LootItem> = {}): LootItem => ({
    __typename: "Item",
    id: "item-1",
    category: "weapon",
    color: "#ffffff",
    icon: "sword",
    set: "weapon",
    uuid: "uuid-1",
    stats: [],
    cost: 30,
    name: "Test Sword",
    ...overrides,
});

describe("gameReducer", () => {
    it("has sensible initial state", () => {
        const state = gameReducer(undefined, { type: "@@INIT" });
        expect(state.wave).toBe(1);
        expect(state.xp).toBe(0);
        expect(state.coins).toBe(999);
        expect(state.currentArea).toBe("town");
        expect(state.inventory).toEqual([]);
        expect(state.filters).toEqual([]);
    });

    it("addCoins increments coins", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, addCoins(50));
        expect(next.coins).toBe(initial.coins + 50);
    });

    it("addXP increments xp", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, addXP(25));
        expect(next.xp).toBe(25);
    });

    it("nextWave increments the wave counter", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, nextWave());
        expect(next.wave).toBe(initial.wave + 1);
    });

    it("toggleFilter adds, removes, and resets filters", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const added = gameReducer(initial, toggleFilter("rare"));
        expect(added.filters).toEqual(["rare"]);

        const removed = gameReducer(added, toggleFilter("rare"));
        expect(removed.filters).toEqual([]);

        const withTwo = gameReducer(
            gameReducer(initial, toggleFilter("rare")),
            toggleFilter("epic")
        );
        expect(withTwo.filters).toEqual(["rare", "epic"]);

        const cleared = gameReducer(withTwo, toggleFilter(""));
        expect(cleared.filters).toEqual([]);
    });

    it("switchUi swaps the menu and records the previous one", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const toMenu = gameReducer({ ...initial, menu: "menu" }, switchUi("settings"));
        // The new screen is shown, and where we came from is remembered so a
        // close button can navigate back to it.
        expect(toMenu.menu).toBe("settings");
        expect(toMenu.previousMenu).toBe("menu");

        const back = gameReducer(toMenu, switchUi("menu"));
        expect(back.menu).toBe("menu");
        expect(back.previousMenu).toBe("settings");
    });

    it("setSaveSlot updates the save slot", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, setSaveSlot("A"));
        expect(next.saveSlot).toBe("A");
    });

    it("setCurrentArea and setPlayerPosition update navigation state", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const moved = gameReducer(
            gameReducer(initial, setCurrentArea("dungeon")),
            setPlayerPosition({ x: 42, y: 84 })
        );
        expect(moved.currentArea).toBe("dungeon");
        expect(moved.playerPosition).toEqual({ x: 42, y: 84 });
    });

    it("buyLoot moves item from loot pool to inventory and deducts coins", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const item = makeItem({ cost: 100 });
        const stateWithLoot = { ...initial, loot: [item] };

        const next = gameReducer(stateWithLoot, buyLoot(item));
        expect(next.loot).toEqual([]);
        expect(next.inventory).toContainEqual(item);
        expect(next.coins).toBe(initial.coins - 100);
        expect(next.selected).toBeNull();
    });

    it("sellLoot moves item from inventory back to loot pool and refunds 1/3 cost", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const item = makeItem({ cost: 30 });
        const stateWithItem = { ...initial, inventory: [item] };

        const next = gameReducer(stateWithItem, sellLoot(item));
        expect(next.inventory).toEqual([]);
        expect(next.loot).toContainEqual(item);
        expect(next.coins).toBe(initial.coins + Math.round(30 / 3));
        expect(next.selected).toBeNull();
    });
});
