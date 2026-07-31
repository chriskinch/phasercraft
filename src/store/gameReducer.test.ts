import { describe, it, expect } from "vitest";
import {
    gameReducer,
    addCoins,
    setCoins,
    addXP,
    setEnemiesRemaining,
    setBossActive,
    toggleFilter,
    setSaveSlot,
    setCurrentArea,
    setPlayerPosition,
    sellLoot,
    buyLoot,
    switchUi,
    addComponent,
    buyComponent,
    sellComponent,
    sellComponentStack,
    loadGame,
    requestTravel,
    clearTravelRequest,
    equipLoot,
    unequipLoot,
    setBaseStats,
} from "./gameReducer";
import type { LootItem } from "@/types/game";
import { COMPONENT_DEFS, componentBuyPrice } from "@/types/game";

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
        expect(state.enemiesRemaining).toBe(0);
        expect(state.bossActive).toBe(false);
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

    it("setCoins sets coins to an absolute value", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, setCoins(50));
        expect(next.coins).toBe(50);
    });

    it("addXP increments xp", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, addXP(25));
        expect(next.xp).toBe(25);
    });

    it("setEnemiesRemaining sets the area enemy count", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const next = gameReducer(initial, setEnemiesRemaining(17));
        expect(next.enemiesRemaining).toBe(17);
    });

    it("setBossActive toggles the boss flag", () => {
        const initial = gameReducer(undefined, { type: "@@INIT" });
        const on = gameReducer(initial, setBossActive(true));
        expect(on.bossActive).toBe(true);
        expect(gameReducer(on, setBossActive(false)).bossActive).toBe(false);
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

    describe("travel requests", () => {
        it("requestTravel records the destination", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const toBiome = gameReducer(initial, requestTravel("desert"));
            expect(toBiome.travelRequest).toBe("desert");

            const toTown = gameReducer(initial, requestTravel("town"));
            expect(toTown.travelRequest).toBe("town");
        });

        it("clearTravelRequest nulls it back out", () => {
            const withRequest = {
                ...gameReducer(undefined, { type: "@@INIT" }),
                travelRequest: "forest" as const,
            };
            const cleared = gameReducer(withRequest, clearTravelRequest());
            expect(cleared.travelRequest).toBeNull();
        });

        it("loadGame resets a captured travel request to null so a stale request cannot fire on load", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const legacySave = { ...initial, travelRequest: "tundra" } as Record<string, unknown>;

            const next = gameReducer(
                initial,
                loadGame(legacySave as Parameters<typeof loadGame>[0])
            );
            expect(next.travelRequest).toBeNull();
        });
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

        it("buyComponent deducts the price and adds a new stack of quantity 1", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stateWithCoins = { ...initial, coins: 100, components: [] };

            const next = gameReducer(stateWithCoins, buyComponent("scrap"));
            expect(next.coins).toBe(100 - componentBuyPrice("scrap"));
            expect(next.components).toHaveLength(1);
            expect(next.components[0]).toMatchObject({ type: "scrap", quantity: 1 });
        });

        it("buyComponent stacks onto an existing non-full stack of the same type", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stack = { id: "stack-1", type: "scrap" as const, quantity: 5 };
            const stateWithStack = { ...initial, coins: 100, components: [stack] };

            const next = gameReducer(stateWithStack, buyComponent("scrap"));
            expect(next.components).toHaveLength(1);
            expect(next.components[0].quantity).toBe(6);
            expect(next.coins).toBe(100 - componentBuyPrice("scrap"));
        });

        it("buyComponent refuses the purchase when coins are insufficient", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stateBroke = { ...initial, coins: 5, components: [] };

            // ichor costs 8 * 3 = 24, well over the 5 coins on hand.
            const next = gameReducer(stateBroke, buyComponent("ichor"));
            expect(next.coins).toBe(5);
            expect(next.components).toEqual([]);
        });

        it("buyComponent ignores unknown component types", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stateWithCoins = { ...initial, coins: 100, components: [] };

            const next = gameReducer(stateWithCoins, buyComponent("bogus" as "scrap"));
            expect(next.coins).toBe(100);
            expect(next.components).toEqual([]);
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

        it("drops the legacy wave counter and seeds the area-progress fields", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const legacySave = { ...initial, wave: 12 } as Record<string, unknown>;
            delete legacySave.enemiesRemaining;
            delete legacySave.bossActive;

            const next = gameReducer(
                initial,
                loadGame(legacySave as Parameters<typeof loadGame>[0])
            );

            expect(next).not.toHaveProperty("wave");
            expect(next.enemiesRemaining).toBe(0);
            expect(next.bossActive).toBe(false);
        });
    });

    describe("gear stat application", () => {
        // Regression: equip/unequip used to add the raw pool roll straight to
        // base_stats instead of the converted magnitude the tooltip advertises.
        // attack_speed is a delay in seconds (Player.attack -> delay: v * 1000), so a
        // +30 roll pushed a 1s cooldown to 31s -- gear made the player slower.
        const geared = (stats: LootItem["stats"]) => makeItem({ stats });

        const seeded = () =>
            gameReducer(
                gameReducer(undefined, { type: "@@INIT" }),
                setBaseStats({
                    attack_power: 50,
                    attack_speed: 1,
                    health_max: 1300,
                } as never)
            );

        it("applies the converted magnitude, not the raw roll", () => {
            const item = geared([{ id: "s1", name: "attack_power", value: 30 }]);
            const next = gameReducer(seeded(), equipLoot(item));
            expect(next.base_stats.attack_power).toBe(65); // 50 + 30/2
        });

        it("makes attack_speed faster, never slower", () => {
            const item = geared([{ id: "s1", name: "attack_speed", value: 30 }]);
            const before = seeded();
            const next = gameReducer(before, equipLoot(item));
            expect(next.base_stats.attack_speed as number).toBeLessThan(
                before.base_stats.attack_speed as number
            );
            expect(next.base_stats.attack_speed).toBeCloseTo(0.98, 5);
        });

        it("unequipping restores the original stats exactly", () => {
            const item = geared([
                { id: "s1", name: "attack_speed", value: 30 },
                { id: "s2", name: "health_max", value: 30 },
            ]);
            const before = seeded();
            const equipped = gameReducer(before, equipLoot(item));
            expect(equipped.base_stats.health_max).toBe(1420); // 1300 + 30*4

            const restored = gameReducer(equipped, unequipLoot(item));
            expect(restored.base_stats.health_max).toBe(before.base_stats.health_max);
            expect(restored.base_stats.attack_speed).toBeCloseTo(
                before.base_stats.attack_speed as number,
                5
            );
        });

        it("keeps stats in sync with base_stats", () => {
            const item = geared([{ id: "s1", name: "attack_power", value: 30 }]);
            const next = gameReducer(seeded(), equipLoot(item));
            expect(next.stats.attack_power).toBe(next.base_stats.attack_power);
        });
    });
});
