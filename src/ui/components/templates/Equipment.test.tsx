import { describe, it, expect, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import store from "@store";
import { loadGame } from "@store/gameReducer";
import Equipment from "@components/Equipment";
import type { GameState } from "@store/gameReducer";
import type { LootItem } from "@/types/game";

// Equipment renders the Gear/Parts grids (Gear tab by default), which read
// the store via useSelector. Passing the singleton `@store` as the provider store
// and seeding it with `loadGame` keeps the grid and the other useSelector-driven
// sections consistent; the initial slice is restored after each test.
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
        expect(screen.getByRole("button", { name: "Gear" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Parts" })).toBeInTheDocument();
        // Sell All and the quantity stepper are component-only controls.
        expect(screen.queryByRole("button", { name: "Sell All" })).not.toBeInTheDocument();
        expect(screen.queryByTestId("sell-stepper")).not.toBeInTheDocument();
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

    describe("Parts tab", () => {
        function seedParts() {
            seed({
                character: "Warrior",
                components: [{ id: "stack-1", type: "ichor", quantity: 5 }],
                coins: 0,
                stats: {} as never,
            });
            renderWithProviders(<Equipment />, { store });
            fireEvent.click(screen.getByRole("button", { name: "Parts" }));
            fireEvent.click(screen.getByRole("button", { name: "Ichor ×5" }));
        }

        it("shows the stepper and Sell All once components are shown", () => {
            seedParts();

            expect(screen.getByTestId("sell-stepper")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Sell All" })).toBeInTheDocument();
            expect(screen.getByTestId("sell-value")).toHaveTextContent("+8");
            // The Sell button label is the only quantity readout.
            expect(screen.queryByTestId("sell-qty")).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Sell" })).toBeInTheDocument();
        });

        it("counts the Sell button up with + and sells that quantity", () => {
            seedParts();

            fireEvent.click(screen.getByRole("button", { name: "+" }));
            fireEvent.click(screen.getByRole("button", { name: "+" }));

            // No separate "Sell 1" — the single Sell button carries the quantity.
            expect(screen.queryByRole("button", { name: "Sell 1" })).not.toBeInTheDocument();
            expect(screen.getByTestId("sell-value")).toHaveTextContent("+24");
            fireEvent.click(screen.getByRole("button", { name: "Sell 3" }));

            const state = store.getState().game;
            expect(state.components[0].quantity).toBe(2);
            expect(state.coins).toBe(24);
        });

        it("shows the sell value popup inside the inventory box, tracking the stepper", () => {
            seedParts();

            const popup = screen.getByTestId("sell-value");
            // Lives in the inventory box, not the action column.
            expect(popup.closest("section")).toContainElement(
                screen.getByTestId("components-grid")
            );
            expect(popup).toHaveTextContent("+8");
            expect(screen.getByRole("img", { name: "Sell value:" })).toHaveAttribute(
                "src",
                "./UI/icons/coin.gif"
            );

            fireEvent.click(screen.getByRole("button", { name: "+" }));
            fireEvent.click(screen.getByRole("button", { name: "+" }));
            fireEvent.click(screen.getByRole("button", { name: "+" }));
            expect(screen.getByTestId("sell-value")).toHaveTextContent("+32");

            fireEvent.click(screen.getByRole("button", { name: "-" }));
            expect(screen.getByTestId("sell-value")).toHaveTextContent("+24");
        });

        it("hides the sell value popup with no stack selected", () => {
            seed({
                character: "Warrior",
                components: [{ id: "stack-1", type: "ichor", quantity: 5 }],
                stats: {} as never,
            });
            renderWithProviders(<Equipment />, { store });
            fireEvent.click(screen.getByRole("button", { name: "Parts" }));

            expect(screen.queryByTestId("sell-value")).not.toBeInTheDocument();
        });

        it("hides the sell value popup on the Gear and Special tabs", () => {
            seedParts();
            expect(screen.getByTestId("sell-value")).toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Gear" }));
            expect(screen.queryByTestId("sell-value")).not.toBeInTheDocument();

            fireEvent.click(screen.getByRole("button", { name: "Special" }));
            expect(screen.queryByTestId("sell-value")).not.toBeInTheDocument();
        });

        it("clamps the stepper to the stack and sells the whole stack with Sell All", () => {
            seedParts();

            for (let i = 0; i < 10; i++) {
                fireEvent.click(screen.getByRole("button", { name: "+" }));
            }
            expect(screen.getByRole("button", { name: "Sell 5" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "+" })).toBeDisabled();

            fireEvent.click(screen.getByRole("button", { name: "Sell All" }));

            const state = store.getState().game;
            expect(state.components).toHaveLength(0);
            expect(state.coins).toBe(40);
        });
    });

    it("shows owned specials under the Special tab, with Sell disabled", () => {
        seed({ character: "Warrior", stats: {} as never, specials: { "ember-core": 3 } });
        renderWithProviders(<Equipment />, { store });

        fireEvent.click(screen.getByRole("button", { name: "Special" }));

        expect(screen.getByTestId("specials-grid")).toBeInTheDocument();
        expect(screen.getByRole("img", { name: /^Ember Core ×3/ })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sell" })).toBeDisabled();
        expect(screen.queryByRole("button", { name: "Sell All" })).not.toBeInTheDocument();
    });

    describe("Scrolls tab", () => {
        function openScrolls(partial: Partial<GameState>) {
            seed({
                character: "Mage",
                stats: {} as never,
                coins: 0,
                learnedSpells: { Frostbolt: 1 },
                abilityLoadout: ["Frostbolt", null, null, null, null],
                ...partial,
            });
            renderWithProviders(<Equipment />, { store });
            fireEvent.click(screen.getByRole("button", { name: "Scrolls" }));
        }

        it("adds a Scrolls filter after Special and shows Learn + Sell, disabled until a pick", () => {
            openScrolls({ scrolls: { Fireball: { 1: 2 } } });

            const filters = screen.getByRole("tablist");
            expect(
                Array.from(filters.querySelectorAll("button")).map((b) => b.textContent)
            ).toEqual(["Gear", "Parts", "Special", "Scrolls"]);
            expect(screen.getByTestId("scrolls-grid")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Learn" })).toBeDisabled();
            expect(screen.getByRole("button", { name: "Sell" })).toBeDisabled();
            expect(screen.queryByTestId("sell-value")).not.toBeInTheDocument();
        });

        // Merging is Arcanum-only (#580): the inventory never offers it.
        it("has no Merge control, even with 3 of a stack", () => {
            openScrolls({ scrolls: { Fireball: { 1: 3 } } });
            fireEvent.click(screen.getByRole("button", { name: "Fireball Scroll L1 ×3" }));
            expect(screen.queryByRole("button", { name: /merge/i })).not.toBeInTheDocument();
        });

        it("Learn learns the spell, auto-equips it, decrements the stack and toasts", () => {
            openScrolls({ scrolls: { Fireball: { 1: 2 } } });
            fireEvent.click(screen.getByRole("button", { name: "Fireball Scroll L1 ×2" }));

            const learn = screen.getByRole("button", { name: "Learn" });
            expect(learn).toBeEnabled();
            fireEvent.click(learn);

            const state = store.getState().game;
            expect(state.learnedSpells.Fireball).toBe(1);
            expect(state.abilityLoadout).toEqual(["Frostbolt", "Fireball", null, null, null]);
            expect(state.scrolls.Fireball?.[1]).toBe(1);
            expect(screen.getByRole("status")).toHaveTextContent(
                "Learned Fireball (L1) — equipped in slot 2"
            );
            // Count badge follows the store; the read L1 is now not readable.
            expect(
                screen.getByRole("button", { name: "Fireball Scroll L1 ×1" })
            ).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Learn" })).toBeDisabled();
        });

        it("Learn upgrades a learned spell to the scroll's level", () => {
            openScrolls({
                learnedSpells: { Frostbolt: 1 },
                scrolls: { Frostbolt: { 3: 1 } },
            });
            fireEvent.click(screen.getByRole("button", { name: "Frostbolt Scroll L3 ×1" }));
            fireEvent.click(screen.getByRole("button", { name: "Learn" }));

            const state = store.getState().game;
            expect(state.learnedSpells.Frostbolt).toBe(3);
            expect(state.scrolls.Frostbolt).toBeUndefined();
            expect(screen.getByRole("status")).toHaveTextContent("Upgraded Frostbolt to L3");
        });

        it("keeps Learn disabled off-class and at or below the learned level", () => {
            openScrolls({
                learnedSpells: { Frostbolt: 2 },
                scrolls: { Whirlwind: { 1: 1 }, Frostbolt: { 2: 1 } },
            });
            fireEvent.click(screen.getByRole("button", { name: "Whirlwind Scroll L1 ×1" }));
            expect(screen.getByRole("button", { name: "Learn" })).toBeDisabled();
            fireEvent.click(screen.getByRole("button", { name: "Frostbolt Scroll L2 ×1" }));
            expect(screen.getByRole("button", { name: "Learn" })).toBeDisabled();
            expect(screen.getByRole("button", { name: "Sell" })).toBeEnabled();
        });

        it("Sell sells one scroll at a time, credits coins and shows the value", () => {
            openScrolls({ scrolls: { Whirlwind: { 2: 2 } } });
            fireEvent.click(screen.getByRole("button", { name: "Whirlwind Scroll L2 ×2" }));
            expect(screen.getByTestId("sell-value")).toHaveTextContent("+30");

            fireEvent.click(screen.getByRole("button", { name: "Sell" }));
            expect(store.getState().game.coins).toBe(30);
            expect(store.getState().game.scrolls.Whirlwind?.[2]).toBe(1);

            fireEvent.click(screen.getByRole("button", { name: "Sell" }));
            expect(store.getState().game.coins).toBe(60);
            expect(store.getState().game.scrolls.Whirlwind).toBeUndefined();
            // The emptied stack drops the selection.
            expect(screen.getByRole("button", { name: "Sell" })).toBeDisabled();
            expect(screen.queryByTestId("sell-value")).not.toBeInTheDocument();
        });

        it("hides Learn on the other tabs", () => {
            openScrolls({});
            fireEvent.click(screen.getByRole("button", { name: "Gear" }));
            expect(screen.queryByRole("button", { name: "Learn" })).not.toBeInTheDocument();
        });
    });
});
