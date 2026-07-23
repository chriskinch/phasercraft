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
    addComponent,
    sellComponent,
    sellComponentStack,
    loadGame,
} from "./gameReducer";
import type { LootItem } from "@/types/game";
import { COMPONENT_DEFS } from "@/types/game";

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

    describe("components", () => {
        it("addComponent creates a stack of quantity 1 for a new type", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const next = gameReducer(initial, addComponent("scrap"));
            expect(next.components).toHaveLength(1);
            expect(next.components[0]).toMatchObject({ type: "scrap", quantity: 1 });
            expect(typeof next.components[0].id).toBe("string");
        });

        it("addComponent stacks onto an existing non-full stack of the same type", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const once = gameReducer(initial, addComponent("scrap"));
            const twice = gameReducer(once, addComponent("scrap"));
            expect(twice.components).toHaveLength(1);
            expect(twice.components[0].quantity).toBe(2);
        });

        it("addComponent keeps different types in separate stacks", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const withScrap = gameReducer(initial, addComponent("scrap"));
            const withCloth = gameReducer(withScrap, addComponent("cloth"));
            expect(withCloth.components).toHaveLength(2);
            expect(withCloth.components.map((s) => s.type)).toEqual(["scrap", "cloth"]);
        });

        it("addComponent overflows into a new stack once a stack hits stackMax", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const max = COMPONENT_DEFS.ichor.stackMax;
            let state = initial;
            for (let i = 0; i < max + 1; i++) {
                state = gameReducer(state, addComponent("ichor"));
            }
            expect(state.components).toHaveLength(2);
            expect(state.components[0].quantity).toBe(max);
            expect(state.components[1].quantity).toBe(1);
        });

        it("addComponent ignores unknown component types", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            // Simulate a stray/corrupt loot name with no COMPONENT_DEFS entry.
            const next = gameReducer(initial, addComponent("bogus" as "scrap"));
            expect(next.components).toEqual([]);
        });

        it("sellComponent decrements the stack and credits sellValue × count", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stack = { id: "stack-1", type: "cloth" as const, quantity: 5 };
            const stateWithStack = { ...initial, components: [stack] };

            const next = gameReducer(stateWithStack, sellComponent("stack-1", 3));
            expect(next.components[0].quantity).toBe(2);
            expect(next.coins).toBe(initial.coins + COMPONENT_DEFS.cloth.sellValue * 3);
        });

        it("sellComponent removes the stack when it reaches zero", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stack = { id: "stack-1", type: "scrap" as const, quantity: 2 };
            const stateWithStack = { ...initial, components: [stack] };

            const next = gameReducer(stateWithStack, sellComponent("stack-1", 2));
            expect(next.components).toEqual([]);
            expect(next.coins).toBe(initial.coins + COMPONENT_DEFS.scrap.sellValue * 2);
        });

        it("sellComponent clamps count to the stack quantity", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stack = { id: "stack-1", type: "scrap" as const, quantity: 3 };
            const stateWithStack = { ...initial, components: [stack] };

            const next = gameReducer(stateWithStack, sellComponent("stack-1", 99));
            expect(next.components).toEqual([]);
            expect(next.coins).toBe(initial.coins + COMPONENT_DEFS.scrap.sellValue * 3);
        });

        it("sellComponentStack sells the whole stack and credits the total", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stack = { id: "stack-1", type: "ichor" as const, quantity: 4 };
            const stateWithStack = { ...initial, components: [stack] };

            const next = gameReducer(stateWithStack, sellComponentStack("stack-1"));
            expect(next.components).toEqual([]);
            expect(next.coins).toBe(initial.coins + COMPONENT_DEFS.ichor.sellValue * 4);
        });
    });

    describe("loadGame migration", () => {
        it("wipes legacy crafting-category items from inventory and keeps gear", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const gear = makeItem({ id: "gear-1", category: "weapon" });
            const legacyComponent = makeItem({
                id: "legacy-1",
                category: "crafting",
                set: "crafting",
                name: "scrap",
            });
            const legacySave = {
                ...initial,
                inventory: [gear, legacyComponent],
            } as unknown as Parameters<typeof loadGame>[0];

            const next = gameReducer(initial, loadGame(legacySave));
            expect(next.inventory).toEqual([gear]);
            expect(next.components).toEqual([]);
        });

        it("defaults a missing components slice to an empty array", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const legacySave = { ...initial } as Record<string, unknown>;
            delete legacySave.components;

            const next = gameReducer(
                initial,
                loadGame(legacySave as Parameters<typeof loadGame>[0])
            );
            expect(next.components).toEqual([]);
        });
    });
});
