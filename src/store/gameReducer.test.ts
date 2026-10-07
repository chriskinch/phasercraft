import { describe, it, expect } from "vitest";
import {
    gameReducer,
    addCoins,
    setCoins,
    addXP,
    toggleFilter,
    setSaveSlot,
    setCurrentArea,
    setPlayerPosition,
    sellLoot,
    buyLoot,
    switchUi,
    addComponent,
    buyComponent,
    buyGear,
    refreshMerchant,
    setMerchantMode,
    sellComponent,
    sellComponentStack,
    craftItem,
    componentTotal,
    missingMaterials,
    loadGame,
    requestTravel,
    clearTravelRequest,
    equipLoot,
    unequipLoot,
    setBaseStats,
    addSpecial,
    grantStarterItems,
    starterScrolls,
    STARTER_ITEMS,
    selectCharacter,
    readScroll,
    addScroll,
    equipAbility,
    sellScroll,
    combineScrolls,
    tradeScroll,
    craftSpell,
    dispelScroll,
    setArcanumTab,
} from "./gameReducer";
import type { GameState } from "./gameReducer";
import type { LootItem, SpellLevel, SpellType } from "@/types/game";
import type { PlayerName } from "@entities/Player/AssignClass";
import { CLASS_KITS } from "@/lib/classKits";
import {
    ABILITY_SLOTS,
    SCROLL_SELL_VALUE,
    COMPONENT_DEFS,
    SPECIAL_ITEMS,
    INITIAL_RECIPES,
    componentBuyPrice,
    merchantPartsBase,
    recipeById,
    specialById,
    SPELL_RECIPES,
    SCROLL_DISPEL_COST,
} from "@/types/game";

// A fixed restock window with a large positive stock delta layered on, so buy
// tests never depend on the current wall-clock window's random base roll.
const STOCKED_WINDOW = 1_000;
const stockedMerchant = () => ({
    mode: "buy" as const,
    partsWindow: STOCKED_WINDOW,
    partsDelta: { scrap: 50, cloth: 50, ichor: 50, bone: 50 },
    gearStock: [],
});

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
        // Sold gear also enters the Merchant's buyable gear stock.
        expect(next.merchant.gearStock).toContainEqual(item);
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
            // Selling raises the Merchant's stock for the type by the count sold.
            expect(next.merchant.partsDelta.cloth).toBe(3);
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
            expect(next.merchant.partsDelta.ichor).toBe(4);
        });

        it("buyComponent deducts the price, adds a stack, and removes one from shop stock", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stateWithCoins = {
                ...initial,
                coins: 100,
                components: [],
                merchant: stockedMerchant(),
            };

            const next = gameReducer(stateWithCoins, buyComponent("scrap"));
            expect(next.coins).toBe(100 - componentBuyPrice("scrap"));
            expect(next.components).toHaveLength(1);
            expect(next.components[0]).toMatchObject({ type: "scrap", quantity: 1 });
            // Buying decrements the shop's net stock delta for the type.
            expect(next.merchant.partsDelta.scrap).toBe(49);
        });

        it("buyComponent stacks onto an existing non-full stack of the same type", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stack = { id: "stack-1", type: "scrap" as const, quantity: 5 };
            const stateWithStack = {
                ...initial,
                coins: 100,
                components: [stack],
                merchant: stockedMerchant(),
            };

            const next = gameReducer(stateWithStack, buyComponent("scrap"));
            expect(next.components).toHaveLength(1);
            expect(next.components[0].quantity).toBe(6);
            expect(next.coins).toBe(100 - componentBuyPrice("scrap"));
        });

        it("buyComponent refuses the purchase when coins are insufficient", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stateBroke = {
                ...initial,
                coins: 5,
                components: [],
                merchant: stockedMerchant(),
            };

            // ichor costs 8 * 3 = 24, well over the 5 coins on hand.
            const next = gameReducer(stateBroke, buyComponent("ichor"));
            expect(next.coins).toBe(5);
            expect(next.components).toEqual([]);
            // Stock is untouched when the purchase is refused.
            expect(next.merchant.partsDelta.ichor).toBe(50);
        });

        it("buyComponent refuses the purchase when the shop is out of stock", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            // Cancel out the window's base roll so scrap is at zero stock.
            const base = merchantPartsBase(STOCKED_WINDOW, "scrap");
            const stateSoldOut = {
                ...initial,
                coins: 100,
                components: [],
                merchant: {
                    mode: "buy" as const,
                    partsWindow: STOCKED_WINDOW,
                    partsDelta: { scrap: -base },
                    gearStock: [],
                },
            };

            const next = gameReducer(stateSoldOut, buyComponent("scrap"));
            expect(next.coins).toBe(100);
            expect(next.components).toEqual([]);
        });

        it("buyComponent ignores unknown component types", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const stateWithCoins = {
                ...initial,
                coins: 100,
                components: [],
                merchant: stockedMerchant(),
            };

            const next = gameReducer(stateWithCoins, buyComponent("bogus" as "scrap"));
            expect(next.coins).toBe(100);
            expect(next.components).toEqual([]);
        });
    });

    describe("blacksmith crafting", () => {
        // A recipe every crafting test works against, taken from the real catalog
        // so the tests break if its materials change rather than drifting from it.
        const RECIPE_ID = "scrappers-blade";
        const recipe = recipeById(RECIPE_ID)!;

        // State holding exactly `multiplier` × the recipe's materials, in one
        // stack per type, plus enough coins. `multiplier` 1 is the exact cost.
        const stocked = (multiplier = 1, coins = 999) => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            return {
                ...initial,
                coins,
                components: Object.entries(recipe.materials).map(([type, count], i) => ({
                    id: `stack-${i}`,
                    type: type as "scrap",
                    quantity: count * multiplier,
                })),
            };
        };

        it("seeds a new character with the starter recipes", () => {
            const state = gameReducer(undefined, { type: "@@INIT" });
            expect(state.recipes).toEqual(INITIAL_RECIPES);
        });

        it("componentTotal sums a type across every stack of it", () => {
            const components = [
                { id: "a", type: "scrap" as const, quantity: 99 },
                { id: "b", type: "scrap" as const, quantity: 4 },
                { id: "c", type: "cloth" as const, quantity: 7 },
            ];
            expect(componentTotal(components, "scrap")).toBe(103);
            expect(componentTotal(components, "cloth")).toBe(7);
            expect(componentTotal(components, "ichor")).toBe(0);
        });

        it("missingMaterials reports only the shortfall", () => {
            const short = gameReducer(stocked(1), sellComponent("stack-0", 5));
            expect(missingMaterials(short.components, recipe)).toEqual({ scrap: 5 });
            expect(missingMaterials(stocked(1).components, recipe)).toEqual({});
        });

        it("craftItem consumes the materials and coins and adds the item", () => {
            const before = stocked(2);
            const next = gameReducer(before, craftItem(RECIPE_ID));

            expect(next.coins).toBe(before.coins - recipe.coins);
            expect(next.inventory).toHaveLength(1);
            expect(next.inventory[0]).toMatchObject({
                name: recipe.result.name,
                category: recipe.result.category,
                set: recipe.result.set,
                cost: recipe.result.cost,
            });
            // One recipe's worth spent, one left.
            for (const [type, count] of Object.entries(recipe.materials)) {
                expect(componentTotal(next.components, type as "scrap")).toBe(count);
            }
        });

        it("craftItem gives each craft a distinct id so copies don't collide", () => {
            const once = gameReducer(stocked(2), craftItem(RECIPE_ID));
            const twice = gameReducer(once, craftItem(RECIPE_ID));
            expect(twice.inventory).toHaveLength(2);
            expect(twice.inventory[0].id).not.toBe(twice.inventory[1].id);
        });

        it("craftItem drains partial stacks before breaking into a full one", () => {
            const base = stocked(1);
            const [first] = Object.entries(recipe.materials) as Array<["scrap", number]>;
            const [type, count] = first;
            // Same total, split into a small partial stack and a larger one.
            const split = {
                ...base,
                components: [
                    { id: "partial", type, quantity: 2 },
                    { id: "full", type, quantity: count - 2 },
                    ...base.components.filter((s) => s.type !== type),
                ],
            };
            const next = gameReducer(split, craftItem(RECIPE_ID));
            // Both stacks of that type are spent exactly, so neither survives.
            expect(next.components.some((s) => s.type === type)).toBe(false);
        });

        it("craftItem is a no-op when materials are short", () => {
            const short = gameReducer(stocked(1), sellComponent("stack-0", 1));
            const next = gameReducer(short, craftItem(RECIPE_ID));
            expect(next.inventory).toEqual([]);
            expect(next.coins).toBe(short.coins);
            expect(next.components).toEqual(short.components);
        });

        it("craftItem is a no-op when coins are short, leaving materials intact", () => {
            const poor = stocked(1, recipe.coins - 1);
            const next = gameReducer(poor, craftItem(RECIPE_ID));
            expect(next.inventory).toEqual([]);
            expect(next.coins).toBe(poor.coins);
            expect(next.components).toEqual(poor.components);
        });

        it("craftItem refuses a recipe the player has not learnt", () => {
            const unlearnt = { ...stocked(1), recipes: [] };
            const next = gameReducer(unlearnt, craftItem(RECIPE_ID));
            expect(next.inventory).toEqual([]);
            expect(next.components).toEqual(unlearnt.components);
        });

        it("craftItem ignores an unknown recipe id", () => {
            const before = stocked(1);
            const next = gameReducer(before, craftItem("no-such-recipe"));
            expect(next.inventory).toEqual([]);
            expect(next.coins).toBe(before.coins);
        });

        describe("special items", () => {
            // Scrapper's Blade rolls attack_power and critical_chance, so the Void
            // Pearl (critical_chance) merges and the Frost Shard (defence) appends.
            const pearl = specialById("void-pearl")!;
            const shard = specialById("frost-shard")!;
            const withSpecials = (specials: Record<string, number>, multiplier = 1) => ({
                ...stocked(multiplier),
                specials,
            });

            it("addSpecial counts owned specials and ignores unknown ids", () => {
                const once = gameReducer(stocked(1), addSpecial("void-pearl"));
                const twice = gameReducer(once, addSpecial("void-pearl"));
                expect(twice.specials).toEqual({ "void-pearl": 2 });
                expect(gameReducer(twice, addSpecial("bogus")).specials).toEqual(twice.specials);
            });

            it("consumes the special and merges its bonus into an existing stat", () => {
                const next = gameReducer(
                    withSpecials({ "void-pearl": 1 }),
                    craftItem(RECIPE_ID, "void-pearl")
                );
                expect(next.specials).toEqual({});
                const crit = next.inventory[0].stats.filter((s) => s.name === pearl.bonus.name);
                const base = recipe.result.stats.find((s) => s.name === pearl.bonus.name)!;
                expect(crit).toHaveLength(1);
                expect(crit[0].value).toBe(base.value + pearl.bonus.value);
            });

            it("appends a bonus stat the recipe does not roll", () => {
                const next = gameReducer(
                    withSpecials({ "frost-shard": 2 }),
                    craftItem(RECIPE_ID, "frost-shard")
                );
                expect(next.specials).toEqual({ "frost-shard": 1 });
                expect(next.inventory[0].stats).toHaveLength(recipe.result.stats.length + 1);
                expect(next.inventory[0].stats.at(-1)).toMatchObject(shard.bonus);
            });

            it("adds the special's worth to the crafted item's cost", () => {
                const next = gameReducer(
                    withSpecials({ "void-pearl": 1 }),
                    craftItem(RECIPE_ID, "void-pearl")
                );
                expect(next.inventory[0].cost).toBe(recipe.result.cost + pearl.cost);
            });

            it("refuses the whole craft when the special is not owned", () => {
                const before = withSpecials({});
                const next = gameReducer(before, craftItem(RECIPE_ID, "void-pearl"));
                expect(next.inventory).toEqual([]);
                expect(next.coins).toBe(before.coins);
                expect(next.components).toEqual(before.components);
            });

            it("refuses an unknown special id", () => {
                const before = withSpecials({ bogus: 1 });
                const next = gameReducer(before, craftItem(RECIPE_ID, "bogus"));
                expect(next.inventory).toEqual([]);
                expect(next.specials).toEqual({ bogus: 1 });
            });

            it("keeps the special when the craft is refused for materials", () => {
                const short = {
                    ...gameReducer(stocked(1), sellComponent("stack-0", 1)),
                    specials: { "void-pearl": 1 },
                };
                const next = gameReducer(short, craftItem(RECIPE_ID, "void-pearl"));
                expect(next.inventory).toEqual([]);
                expect(next.specials).toEqual({ "void-pearl": 1 });
            });
        });
    });

    describe("merchant shop", () => {
        it("refreshMerchant wipes the parts delta only when the window changes", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const seeded = {
                ...initial,
                merchant: {
                    mode: "buy" as const,
                    partsWindow: STOCKED_WINDOW,
                    partsDelta: { scrap: 4 },
                    gearStock: [],
                },
            };

            // Same window: the run's sold/bought counts survive.
            const same = gameReducer(seeded, refreshMerchant(STOCKED_WINDOW));
            expect(same.merchant.partsDelta.scrap).toBe(4);

            // New window: stock rolls over, forgetting the counts.
            const rolled = gameReducer(seeded, refreshMerchant(STOCKED_WINDOW + 1));
            expect(rolled.merchant.partsWindow).toBe(STOCKED_WINDOW + 1);
            expect(rolled.merchant.partsDelta).toEqual({});
        });

        it("buyGear moves sold gear back into the inventory for the sell refund", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const item = makeItem({ id: "buyback", cost: 30 });
            const seeded = {
                ...initial,
                coins: 100,
                inventory: [],
                loot: [item],
                merchant: { ...initial.merchant, gearStock: [item] },
            };

            const next = gameReducer(seeded, buyGear(item));
            expect(next.inventory).toContainEqual(item);
            // No margin: buy-back price equals the sell refund, round(cost / 3).
            expect(next.coins).toBe(100 - Math.round(30 / 3));
            expect(next.merchant.gearStock).toEqual([]);
            // Kept in sync with the armory loot pool sellLoot pushed it into.
            expect(next.loot).toEqual([]);
        });

        it("buyGear ignores gear that is not in the shop's stock", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const item = makeItem({ id: "not-here", cost: 30 });
            const seeded = { ...initial, coins: 100, inventory: [] };

            const next = gameReducer(seeded, buyGear(item));
            expect(next.inventory).toEqual([]);
            expect(next.coins).toBe(100);
        });

        it("buyGear refuses when the player cannot afford the refund price", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const item = makeItem({ id: "pricey", cost: 300 }); // refund 100
            const seeded = {
                ...initial,
                coins: 50,
                inventory: [],
                merchant: { ...initial.merchant, gearStock: [item] },
            };

            const next = gameReducer(seeded, buyGear(item));
            expect(next.inventory).toEqual([]);
            expect(next.coins).toBe(50);
            expect(next.merchant.gearStock).toContainEqual(item);
        });

        it("loadGame resets the merchant to fresh, ephemeral stock", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const item = makeItem({ id: "stale" });
            const withStock = {
                ...initial,
                merchant: {
                    mode: "sell" as const,
                    partsWindow: 42,
                    partsDelta: { scrap: 9 },
                    gearStock: [item],
                },
            };

            const next = gameReducer(withStock, loadGame(withStock));
            expect(next.merchant.mode).toBe("buy");
            expect(next.merchant.partsDelta).toEqual({});
            expect(next.merchant.gearStock).toEqual([]);
        });

        it("setMerchantMode switches the shop side", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            expect(initial.merchant.mode).toBe("buy");
            const selling = gameReducer(initial, setMerchantMode("sell"));
            expect(selling.merchant.mode).toBe("sell");
            expect(gameReducer(selling, setMerchantMode("buy")).merchant.mode).toBe("buy");
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

        it("defaults a missing specials slice to none owned", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const legacySave = { ...initial } as Record<string, unknown>;
            delete legacySave.specials;

            const next = gameReducer(
                initial,
                loadGame(legacySave as Parameters<typeof loadGame>[0])
            );
            expect(next.specials).toEqual({});
        });

        it("seeds the starter recipes into a save written before the Blacksmith", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const legacySave = { ...initial } as Record<string, unknown>;
            delete legacySave.recipes;

            const next = gameReducer(
                initial,
                loadGame(legacySave as Parameters<typeof loadGame>[0])
            );
            expect(next.recipes).toEqual(INITIAL_RECIPES);
        });

        it("keeps the recipes a save already carries", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const save = { ...initial, recipes: ["ichorbound-amulet"] };

            const next = gameReducer(initial, loadGame(save));
            expect(next.recipes).toEqual(["ichorbound-amulet"]);
        });

        it("drops the legacy wave counter and kill-count fields", () => {
            const initial = gameReducer(undefined, { type: "@@INIT" });
            const legacySave = {
                ...initial,
                wave: 12,
                enemiesRemaining: 7,
                bossActive: true,
            } as Record<string, unknown>;

            const next = gameReducer(
                initial,
                loadGame(legacySave as Parameters<typeof loadGame>[0])
            );

            expect(next).not.toHaveProperty("wave");
            expect(next).not.toHaveProperty("enemiesRemaining");
            expect(next).not.toHaveProperty("bossActive");
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

describe("grantStarterItems", () => {
    it("replaces the purse, parts and specials with the starter kit", () => {
        const before = {
            ...gameReducer(undefined, { type: "@@INIT" }),
            coins: 5,
            components: [{ id: "old", type: "scrap" as const, quantity: 3 }],
            specials: { "void-pearl": 1 },
        };

        const state = gameReducer(before, grantStarterItems());

        expect(state.coins).toBe(STARTER_ITEMS.coins);
        for (const type of Object.keys(COMPONENT_DEFS) as (keyof typeof COMPONENT_DEFS)[]) {
            expect(componentTotal(state.components, type)).toBe(STARTER_ITEMS.componentsEach);
            // Stacks respect each part's stackMax.
            for (const stack of state.components.filter((s) => s.type === type)) {
                expect(stack.quantity).toBeLessThanOrEqual(COMPONENT_DEFS[type].stackMax);
            }
        }
        expect(state.specials).toEqual(
            Object.fromEntries(SPECIAL_ITEMS.map((s) => [s.id, STARTER_ITEMS.specialsEach]))
        );
    });
});

describe("starterScrolls", () => {
    it("covers merge, upgrade and off-class states for the class", () => {
        // Mage kit: Fireball, Frostbolt, …; Aimed Shot is the first off-class spell.
        expect(starterScrolls("Mage")).toEqual({
            Fireball: { 1: 3, 2: 1 },
            Frostbolt: { 3: 1 },
            AimedShot: { 1: 2 },
        });
    });

    it("grants none without a class", () => {
        expect(starterScrolls(null)).toEqual({});
    });

    it("grantStarterItems gives the current class's starter scrolls", () => {
        const mage = gameReducer(
            gameReducer(undefined, { type: "@@INIT" }),
            selectCharacter("Mage")
        );
        expect(gameReducer(mage, grantStarterItems()).scrolls).toEqual(starterScrolls("Mage"));
        expect(gameReducer(mage, grantStarterItems()).spellRecipes).toEqual(
            CLASS_KITS.Mage.slice(0, 2)
        );
    });
});

describe("abilities", () => {
    const init = () => gameReducer(undefined, { type: "@@INIT" });
    // A Mage with the seeded kit, standing in town.
    const mage = (overrides: Partial<GameState> = {}): GameState => ({
        ...gameReducer(init(), selectCharacter("Mage")),
        currentArea: "town",
        ...overrides,
    });
    const occultist = (overrides: Partial<GameState> = {}): GameState => ({
        ...gameReducer(init(), selectCharacter("Occultist")),
        ...overrides,
    });

    it("starts with no abilities and five empty active and passive slots", () => {
        const state = init();
        expect(state.learnedSpells).toEqual({});
        expect(state.scrolls).toEqual({});
        expect(state.abilityLoadout).toEqual([null, null, null, null, null]);
        expect(state.passiveLoadout).toEqual([null, null, null, null, null]);
    });

    describe("seed on selectCharacter", () => {
        it.each(Object.keys(CLASS_KITS) as PlayerName[])(
            "%s learns its class kit at L1 and slots it in kit order",
            (character) => {
                const kit = CLASS_KITS[character];
                const state = gameReducer(init(), selectCharacter(character));
                expect(state.learnedSpells).toEqual(
                    Object.fromEntries(kit.map((spell) => [spell, 1]))
                );
                expect(state.abilityLoadout).toHaveLength(ABILITY_SLOTS);
                expect(state.abilityLoadout).toEqual([
                    ...kit,
                    ...Array(ABILITY_SLOTS - kit.length).fill(null),
                ]);
                expect(state.passiveLoadout).toEqual(Array(ABILITY_SLOTS).fill(null));
                expect(state.scrolls).toEqual({});
            }
        );

        it("leaves the trailing slots empty for smaller kits", () => {
            expect(gameReducer(init(), selectCharacter("Warrior")).abilityLoadout).toEqual([
                "Whirlwind",
                "Enrage",
                "BattleStomp",
                "Retaliation",
                null,
            ]);
            expect(gameReducer(init(), selectCharacter("Ranger")).abilityLoadout[4]).toBeNull();
            expect(gameReducer(init(), selectCharacter("Occultist")).abilityLoadout[4]).toBeNull();
        });

        it("keeps loaded abilities when Load re-selects the same character", () => {
            const save = { ...mage(), learnedSpells: { Fireball: 3 as const } };
            const loaded = gameReducer(init(), loadGame(save));
            const next = gameReducer(loaded, selectCharacter("Mage"));
            expect(next.learnedSpells).toEqual({ Fireball: 3 });
        });
    });

    describe("readScroll", () => {
        it("learns an on-class spell, consumes the scroll and fills the first empty slot", () => {
            const before = occultist({
                learnedSpells: { Fireball: 1, Enfeeble: 1 },
                abilityLoadout: ["Fireball", null, "Enfeeble", null, null],
                scrolls: { SiphonSoul: { 2: 1 } },
            });
            const state = gameReducer(before, readScroll("SiphonSoul", 2));
            expect(state.learnedSpells.SiphonSoul).toBe(2);
            expect(state.scrolls).toEqual({});
            expect(state.abilityLoadout).toEqual([
                "Fireball",
                "SiphonSoul",
                "Enfeeble",
                null,
                null,
            ]);
        });

        it("auto-fills even outside town", () => {
            const before = occultist({
                currentArea: "forest",
                learnedSpells: {},
                abilityLoadout: [null, null, null, null, null],
                scrolls: { Fireball: { 1: 1 } },
            });
            const state = gameReducer(before, readScroll("Fireball", 1));
            expect(state.abilityLoadout[0]).toBe("Fireball");
        });

        it("upgrades a learned spell to a higher scroll level without moving it", () => {
            const before = mage({ scrolls: { Frostbolt: { 3: 2, 1: 4 } } });
            const state = gameReducer(before, readScroll("Frostbolt", 3));
            expect(state.learnedSpells.Frostbolt).toBe(3);
            expect(state.scrolls).toEqual({ Frostbolt: { 1: 4, 3: 1 } });
            expect(state.abilityLoadout).toEqual(before.abilityLoadout);
        });

        it("refuses a scroll at or below the spell's level", () => {
            const before = mage({
                learnedSpells: { ...mage().learnedSpells, Fireball: 2 },
                scrolls: { Fireball: { 1: 1, 2: 1 } },
            });
            expect(gameReducer(before, readScroll("Fireball", 2))).toEqual(before);
            expect(gameReducer(before, readScroll("Fireball", 1))).toEqual(before);
        });

        it("refuses an off-class scroll", () => {
            const before = mage({ scrolls: { Whirlwind: { 1: 1 } } });
            expect(gameReducer(before, readScroll("Whirlwind", 1))).toEqual(before);
        });

        it("refuses a scroll the player doesn't hold", () => {
            const before = mage({ learnedSpells: {}, scrolls: { Fireball: { 2: 1 } } });
            expect(gameReducer(before, readScroll("Fireball", 1))).toEqual(before);
        });

        it("refuses when no character is selected", () => {
            const before = { ...init(), scrolls: { Fireball: { 1: 1 } } };
            expect(gameReducer(before, readScroll("Fireball", 1))).toEqual(before);
        });
    });

    describe("addScroll", () => {
        it("adds one unread scroll at its level, keeping other levels and spells", () => {
            const before = mage({ scrolls: { Fireball: { 2: 1 } } });
            const once = gameReducer(before, addScroll("Fireball", 1));
            const twice = gameReducer(once, addScroll("Fireball", 1));
            expect(twice.scrolls).toEqual({ Fireball: { 1: 2, 2: 1 } });
            expect(gameReducer(twice, addScroll("Whirlwind", 1)).scrolls).toEqual({
                Fireball: { 1: 2, 2: 1 },
                Whirlwind: { 1: 1 },
            });
        });

        it("leaves learned spells and the loadout alone", () => {
            const before = mage();
            const state = gameReducer(before, addScroll("Smite", 1));
            expect(state.learnedSpells).toEqual(before.learnedSpells);
            expect(state.abilityLoadout).toEqual(before.abilityLoadout);
        });

        it("ignores unknown spells and levels", () => {
            const before = mage({ scrolls: { Fireball: { 1: 1 } } });
            const bogusSpell = addScroll("Bogus" as SpellType, 1);
            const bogusLevel = addScroll("Fireball", 4 as SpellLevel);
            expect(gameReducer(before, bogusSpell)).toEqual(before);
            expect(gameReducer(before, bogusLevel)).toEqual(before);
        });
    });

    describe("equipAbility", () => {
        it("puts a learned spell in an empty slot", () => {
            const before = mage({ abilityLoadout: ["Fireball", null, null, null, null] });
            const state = gameReducer(before, equipAbility(3, "Frostbolt"));
            expect(state.abilityLoadout).toEqual(["Fireball", null, null, "Frostbolt", null]);
        });

        it("swaps when the spell already sits in another slot", () => {
            const before = mage();
            const state = gameReducer(before, equipAbility(0, "ManaShield"));
            expect(state.abilityLoadout).toEqual([
                "ManaShield",
                "Frostbolt",
                "EarthShield",
                "Fireball",
                "Invocation",
            ]);
        });

        it("moves a slotted spell into an empty slot, leaving its old slot empty", () => {
            const before = mage({ abilityLoadout: ["Fireball", null, null, null, null] });
            const state = gameReducer(before, equipAbility(4, "Fireball"));
            expect(state.abilityLoadout).toEqual([null, null, null, null, "Fireball"]);
        });

        it("empties a slot with null", () => {
            const state = gameReducer(mage(), equipAbility(1, null));
            expect(state.abilityLoadout[1]).toBeNull();
        });

        it("is refused outside town", () => {
            const before = mage({ currentArea: "forest" });
            expect(gameReducer(before, equipAbility(0, "ManaShield"))).toEqual(before);
            expect(gameReducer(before, equipAbility(0, null))).toEqual(before);
        });

        it("refuses an unlearned spell", () => {
            const before = mage({ learnedSpells: { Fireball: 1 } });
            expect(gameReducer(before, equipAbility(4, "Frostbolt"))).toEqual(before);
        });

        it("refuses an out-of-range slot", () => {
            const before = mage();
            expect(gameReducer(before, equipAbility(5, "Fireball"))).toEqual(before);
            expect(gameReducer(before, equipAbility(-1, null))).toEqual(before);
        });
    });

    describe("combineScrolls", () => {
        it("merges 3 of a level into 1 of the next, keeping any remainder", () => {
            const before = mage({ scrolls: { Fireball: { 1: 4, 2: 1 } } });
            const state = gameReducer(before, combineScrolls("Fireball", 1));
            expect(state.scrolls).toEqual({ Fireball: { 1: 1, 2: 2 } });
        });

        it("drops the emptied level and merges off-class scrolls too", () => {
            const before = mage({ scrolls: { Whirlwind: { 2: 3 } } });
            const state = gameReducer(before, combineScrolls("Whirlwind", 2));
            expect(state.scrolls).toEqual({ Whirlwind: { 3: 1 } });
        });

        it("does not touch learned spells", () => {
            const before = mage({
                learnedSpells: { Fireball: 1 },
                scrolls: { Fireball: { 1: 3 } },
            });
            expect(gameReducer(before, combineScrolls("Fireball", 1)).learnedSpells).toEqual({
                Fireball: 1,
            });
        });

        it("refuses fewer than 3, max level, unknown spells and outside town", () => {
            const before = mage({ scrolls: { Fireball: { 1: 2, 3: 5 } } });
            expect(gameReducer(before, combineScrolls("Fireball", 1))).toEqual(before);
            expect(gameReducer(before, combineScrolls("Fireball", 3))).toEqual(before);
            expect(gameReducer(before, combineScrolls("Nope" as SpellType, 1))).toEqual(before);
            const away = mage({ currentArea: "forest", scrolls: { Fireball: { 1: 3 } } });
            expect(gameReducer(away, combineScrolls("Fireball", 1))).toEqual(away);
        });
    });

    // Fireball's recipe: cloth 6, ichor 3, 25 coins, 1 Ember Core (placeholder
    // values — read from SPELL_RECIPES so tuning doesn't break these tests).
    const fireball = SPELL_RECIPES.Fireball;
    const stockedFor = (times: number) =>
        (Object.entries(fireball.materials) as [string, number][]).map(([type, n]) => ({
            id: type,
            type: type as "cloth",
            quantity: n * times,
        }));

    describe("setArcanumTab", () => {
        it("switches tabs, ignores unknown ones and resets to merge on load", () => {
            const craft = gameReducer(mage(), setArcanumTab("craft"));
            expect(craft.arcanumTab).toBe("craft");
            expect(gameReducer(craft, setArcanumTab("nope" as "craft")).arcanumTab).toBe("craft");
            expect(gameReducer(init(), loadGame(craft)).arcanumTab).toBe("merge");
        });
    });

    describe("tradeScroll", () => {
        it("consumes 1 scroll of any level and learns the recipe", () => {
            const before = mage({ scrolls: { Fireball: { 2: 2 } } });
            const state = gameReducer(before, tradeScroll("Fireball", 2));
            expect(state.scrolls).toEqual({ Fireball: { 2: 1 } });
            expect(state.spellRecipes).toEqual(["Fireball"]);
        });

        it("learns off-class recipes too", () => {
            const state = gameReducer(
                mage({ scrolls: { Whirlwind: { 1: 1 } } }),
                tradeScroll("Whirlwind", 1)
            );
            expect(state.spellRecipes).toEqual(["Whirlwind"]);
            expect(state.scrolls).toEqual({});
        });

        it("refuses a known recipe, a scroll not held, unknown spells and outside town", () => {
            const known = mage({ spellRecipes: ["Fireball"], scrolls: { Fireball: { 1: 1 } } });
            expect(gameReducer(known, tradeScroll("Fireball", 1))).toEqual(known);
            const none = mage({ scrolls: { Fireball: { 1: 1 } } });
            expect(gameReducer(none, tradeScroll("Fireball", 2))).toEqual(none);
            expect(gameReducer(none, tradeScroll("Nope" as SpellType, 1))).toEqual(none);
            const away = mage({ currentArea: "forest", scrolls: { Fireball: { 1: 1 } } });
            expect(gameReducer(away, tradeScroll("Fireball", 1))).toEqual(away);
        });
    });

    describe("craftSpell", () => {
        const ready = (overrides: Partial<GameState> = {}) =>
            mage({
                spellRecipes: ["Fireball"],
                components: stockedFor(1),
                specials: { [fireball.special]: 1 },
                coins: fireball.coins + 5,
                ...overrides,
            });

        it("consumes components, coins and the special, and adds 1 L1 scroll", () => {
            const state = gameReducer(
                ready({ scrolls: { Fireball: { 1: 1 } } }),
                craftSpell("Fireball")
            );
            expect(state.scrolls).toEqual({ Fireball: { 1: 2 } });
            expect(state.components).toEqual([]);
            expect(state.specials).toEqual({});
            expect(state.coins).toBe(5);
        });

        it("refuses an unlearnt recipe, short parts, special or coins, and outside town", () => {
            const cases = [
                ready({ spellRecipes: [] }),
                ready({ components: [] }),
                ready({ specials: {} }),
                ready({ coins: fireball.coins - 1 }),
                ready({ currentArea: "forest" }),
            ];
            for (const before of cases) {
                expect(gameReducer(before, craftSpell("Fireball"))).toEqual(before);
            }
        });
    });

    describe("dispelScroll", () => {
        const learnt = (overrides: Partial<GameState> = {}) =>
            mage({
                spellRecipes: ["Fireball"],
                components: [],
                specials: {},
                coins: SCROLL_DISPEL_COST,
                ...overrides,
            });

        it.each([
            [1, 1],
            [2, 3],
            [3, 9],
        ] as [SpellLevel, number][])(
            "returns L%i parts and specials ×%i for the flat fee",
            (level, times) => {
                const before = learnt({ scrolls: { Fireball: { [level]: 1 } } });
                const state = gameReducer(before, dispelScroll("Fireball", level));
                expect(state.scrolls).toEqual({});
                expect(state.coins).toBe(0);
                for (const [type, n] of Object.entries(fireball.materials)) {
                    expect(componentTotal(state.components, type as "cloth")).toBe(n * times);
                }
                expect(state.specials).toEqual({ [fireball.special]: times });
            }
        );

        it("refuses an unlearnt recipe, no scroll, short fee and outside town", () => {
            const cases = [
                learnt({ spellRecipes: [], scrolls: { Fireball: { 1: 1 } } }),
                learnt({ scrolls: {} }),
                learnt({ coins: SCROLL_DISPEL_COST - 1, scrolls: { Fireball: { 1: 1 } } }),
                learnt({ currentArea: "forest", scrolls: { Fireball: { 1: 1 } } }),
            ];
            for (const before of cases) {
                expect(gameReducer(before, dispelScroll("Fireball", 1))).toEqual(before);
            }
        });
    });

    describe("sellScroll", () => {
        it("adds the per-level sell value for each scroll sold", () => {
            const before = mage({ coins: 0, scrolls: { Fireball: { 2: 3 } } });
            const state = gameReducer(before, sellScroll("Fireball", 2, 2));
            expect(state.coins).toBe(SCROLL_SELL_VALUE[2] * 2);
            expect(state.scrolls).toEqual({ Fireball: { 2: 1 } });
        });

        it("clamps to the held count and removes emptied entries", () => {
            const before = mage({ coins: 5, scrolls: { Whirlwind: { 1: 2 } } });
            const state = gameReducer(before, sellScroll("Whirlwind", 1, 10));
            expect(state.coins).toBe(5 + SCROLL_SELL_VALUE[1] * 2);
            expect(state.scrolls).toEqual({});
        });

        it("ignores a non-positive count or a scroll not held", () => {
            const before = mage({ scrolls: { Fireball: { 1: 1 } } });
            expect(gameReducer(before, sellScroll("Fireball", 1, 0))).toEqual(before);
            expect(gameReducer(before, sellScroll("Fireball", 1, NaN))).toEqual(before);
            expect(gameReducer(before, sellScroll("Fireball", 3, 1))).toEqual(before);
        });
    });

    describe("loadGame migration", () => {
        const legacyFor = (character: PlayerName) => {
            const save = { ...init(), character } as Record<string, unknown>;
            delete save.learnedSpells;
            delete save.scrolls;
            delete save.abilityLoadout;
            delete save.passiveLoadout;
            delete save.spellRecipes;
            return save as Parameters<typeof loadGame>[0];
        };

        it.each(Object.keys(CLASS_KITS) as PlayerName[])(
            "seeds a legacy %s save exactly like a new character",
            (character) => {
                const loaded = gameReducer(init(), loadGame(legacyFor(character)));
                const fresh = gameReducer(init(), selectCharacter(character));
                expect(loaded.learnedSpells).toEqual(fresh.learnedSpells);
                expect(loaded.abilityLoadout).toEqual(fresh.abilityLoadout);
                expect(loaded.scrolls).toEqual({});
                expect(loaded.passiveLoadout).toEqual(Array(ABILITY_SLOTS).fill(null));
                expect(loaded.spellRecipes).toEqual([]);
            }
        );

        it("keeps known spell recipes and drops unknown or duplicate ids", () => {
            const save = {
                ...init(),
                character: "Mage",
                spellRecipes: ["Fireball", "Meteor", "Fireball", "Whirlwind", 3],
            } as unknown as Parameters<typeof loadGame>[0];
            const loaded = gameReducer(init(), loadGame(save));
            expect(loaded.spellRecipes).toEqual(["Fireball", "Whirlwind"]);
        });

        it("loads a save with no character without throwing", () => {
            const save = { ...init() } as Record<string, unknown>;
            delete save.learnedSpells;
            delete save.abilityLoadout;
            const loaded = gameReducer(init(), loadGame(save as Parameters<typeof loadGame>[0]));
            expect(loaded.learnedSpells).toEqual({});
            expect(loaded.abilityLoadout).toEqual(Array(ABILITY_SLOTS).fill(null));
        });

        it("drops unknown spell ids, bad levels and counts, and normalises loadouts", () => {
            const save = {
                ...init(),
                character: "Mage",
                learnedSpells: { Fireball: 2, Meteor: 1, Frostbolt: 7 },
                scrolls: { Fireball: { 1: 2, 2: 0, 3: -1 }, Meteor: { 1: 1 }, Heal: "x" },
                abilityLoadout: ["Meteor", "Fireball", "Fireball", "Frostbolt"],
                passiveLoadout: ["Ghost", null],
            } as unknown as Parameters<typeof loadGame>[0];

            const loaded = gameReducer(init(), loadGame(save));
            expect(loaded.learnedSpells).toEqual({ Fireball: 2 });
            expect(loaded.scrolls).toEqual({ Fireball: { 1: 2 } });
            expect(loaded.abilityLoadout).toEqual([null, "Fireball", null, null, null]);
            expect(loaded.passiveLoadout).toEqual(Array(ABILITY_SLOTS).fill(null));
        });

        it("never throws on malformed abilities fields", () => {
            const save = {
                ...init(),
                character: "Warrior",
                learnedSpells: null,
                scrolls: [1, 2],
                abilityLoadout: "Whirlwind",
                passiveLoadout: 3,
            } as unknown as Parameters<typeof loadGame>[0];

            expect(() => gameReducer(init(), loadGame(save))).not.toThrow();
            const loaded = gameReducer(init(), loadGame(save));
            expect(loaded.scrolls).toEqual({});
            expect(loaded.abilityLoadout).toHaveLength(ABILITY_SLOTS);
        });

        it("round-trips abilities through a JSON save", () => {
            const played = gameReducer(
                gameReducer(
                    mage({ scrolls: { Fireball: { 3: 1, 2: 2 } }, spellRecipes: ["Heal"] }),
                    readScroll("Fireball", 3)
                ),
                equipAbility(4, "Fireball")
            );
            const save = JSON.parse(JSON.stringify(played)) as Parameters<typeof loadGame>[0];
            const loaded = gameReducer(init(), loadGame(save));

            expect(loaded.learnedSpells).toEqual(played.learnedSpells);
            expect(loaded.scrolls).toEqual({ Fireball: { 2: 2 } });
            expect(loaded.abilityLoadout).toEqual(played.abilityLoadout);
            expect(loaded.passiveLoadout).toEqual(played.passiveLoadout);
            expect(loaded.spellRecipes).toEqual(["Heal"]);
        });
    });
});
