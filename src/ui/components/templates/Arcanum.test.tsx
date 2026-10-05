import { describe, it, expect, afterEach } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import store from "@store";
import { loadGame, setArcanumTab } from "@store/gameReducer";
import Arcanum from "@components/Arcanum";
import type { GameState } from "@store/gameReducer";
import { SCROLL_DECONSTRUCT_COST, SPELL_RECIPES } from "@/types/game";

// Seeds the singleton store (as Equipment.test) so the grid and the Merge
// button read the same state; restored after each test.
const initialGame: GameState = JSON.parse(JSON.stringify(store.getState().game));

function open(partial: Partial<GameState>) {
    store.dispatch(
        loadGame({ ...initialGame, character: "Mage", currentArea: "town", ...partial })
    );
    renderWithProviders(<Arcanum />, { store });
}

afterEach(() => {
    store.dispatch(loadGame(initialGame));
});

describe("Arcanum", () => {
    it("lists held scrolls with Merge disabled until a pick", () => {
        open({ scrolls: { Fireball: { 1: 3 }, Whirlwind: { 2: 1 } } });
        expect(screen.getByRole("button", { name: "Fireball Scroll L1 ×3" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Whirlwind Scroll L2 ×1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Merge" })).toBeDisabled();
    });

    it("merges 3 into 1 of the next level and shows a toast", () => {
        open({ scrolls: { Fireball: { 1: 4 } } });
        fireEvent.click(screen.getByRole("button", { name: "Fireball Scroll L1 ×4" }));
        fireEvent.click(screen.getByRole("button", { name: "Merge" }));

        expect(store.getState().game.scrolls).toEqual({ Fireball: { 1: 1, 2: 1 } });
        expect(screen.getByText("Merged 3 Fireball L1 → L2")).toBeInTheDocument();
        // 1 left at L1: the still-selected stack can't merge again.
        expect(screen.getByRole("button", { name: "Merge" })).toBeDisabled();
    });

    it("merges off-class scrolls", () => {
        open({ scrolls: { Whirlwind: { 2: 3 } } });
        fireEvent.click(screen.getByRole("button", { name: "Whirlwind Scroll L2 ×3" }));
        fireEvent.click(screen.getByRole("button", { name: "Merge" }));
        expect(store.getState().game.scrolls).toEqual({ Whirlwind: { 3: 1 } });
    });

    it("keeps Merge disabled below 3 and at max level", () => {
        open({ scrolls: { Fireball: { 1: 2, 3: 3 } } });
        fireEvent.click(screen.getByRole("button", { name: "Fireball Scroll L1 ×2" }));
        expect(screen.getByRole("button", { name: "Merge" })).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: "Fireball Scroll L3 ×3" }));
        expect(screen.getByRole("button", { name: "Merge" })).toBeDisabled();
    });

    it("shows an empty state with no scrolls", () => {
        open({ scrolls: {} });
        expect(screen.getByText("No scrolls yet. Find them in dungeons.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Merge" })).toBeDisabled();
    });

    it("Trade consumes the scroll and learns its recipe", () => {
        open({ scrolls: { Whirlwind: { 2: 1 } }, spellRecipes: [] });
        fireEvent.click(screen.getByRole("button", { name: "Whirlwind Scroll L2 ×1" }));
        expect(screen.getByTestId("arcanum-hints")).toHaveTextContent(
            "Trade: Trade to learn the Whirlwind recipe."
        );
        expect(screen.getByRole("button", { name: "Deconstruct" })).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: "Trade" }));

        expect(store.getState().game.spellRecipes).toEqual(["Whirlwind"]);
        expect(store.getState().game.scrolls).toEqual({});
        expect(screen.getByText("Learnt the Whirlwind recipe")).toBeInTheDocument();
    });

    it("disables Trade once the recipe is known and Deconstruct pays the fee", () => {
        open({
            scrolls: { Fireball: { 2: 1 } },
            spellRecipes: ["Fireball"],
            coins: SCROLL_DECONSTRUCT_COST,
            components: [],
            specials: {},
        });
        fireEvent.click(screen.getByRole("button", { name: "Fireball Scroll L2 ×1" }));
        expect(screen.getByRole("button", { name: "Trade" })).toBeDisabled();
        fireEvent.click(screen.getByRole("button", { name: "Deconstruct" }));

        const game = store.getState().game;
        expect(game.coins).toBe(0);
        expect(game.scrolls).toEqual({});
        expect(game.specials).toEqual({ [SPELL_RECIPES.Fireball.special]: 3 });
    });

    it("shows the Craft view on the Craft tab", () => {
        open({ spellRecipes: [] });
        act(() => {
            store.dispatch(setArcanumTab("craft"));
        });
        expect(screen.getByTestId("spell-forge")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Merge" })).not.toBeInTheDocument();
    });
});
