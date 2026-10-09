import { describe, it, expect, afterEach } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import store from "@store";
import { loadGame } from "@store/gameReducer";
import ArcanumCraft from "@components/ArcanumCraft";
import type { GameState } from "@store/gameReducer";
import { SPELL_RECIPES, specialById } from "@/types/game";

// Seeds the singleton store (as Arcanum.test); restored after each test.
const initialGame: GameState = JSON.parse(JSON.stringify(store.getState().game));
const fireball = SPELL_RECIPES.Fireball;

const stocked = () =>
    Object.entries(fireball.materials).map(([type, n]) => ({
        id: type,
        type: type as "cloth",
        quantity: n,
    }));

function open(partial: Partial<GameState>) {
    store.dispatch(
        loadGame({ ...initialGame, character: "Mage", currentArea: "town", ...partial })
    );
    renderWithProviders(<ArcanumCraft />, { store });
}

function slotFireball() {
    fireEvent.click(screen.getByTestId("spell-recipe-card"));
    fireEvent.click(screen.getByRole("option", { name: /Fireball/ }));
    fireEvent.click(screen.getByRole("button", { name: "Use recipe" }));
}

afterEach(() => {
    store.dispatch(loadGame(initialGame));
});

describe("ArcanumCraft", () => {
    it("picker lists only learnt recipes", () => {
        open({ spellRecipes: ["Fireball", "Heal"] });
        fireEvent.click(screen.getByTestId("spell-recipe-card"));
        const list = within(screen.getByRole("listbox", { name: "Your spell recipes" }));
        expect(list.getAllByRole("option").map((o) => o.textContent)).toEqual([
            expect.stringContaining("Fireball"),
            expect.stringContaining("Heal"),
        ]);
    });

    it("shows an empty picker before any recipe is learnt", () => {
        open({ spellRecipes: [] });
        fireEvent.click(screen.getByTestId("spell-recipe-card"));
        expect(screen.getByText(/No recipes yet/)).toBeInTheDocument();
    });

    it("requires the recipe's special item", () => {
        open({
            spellRecipes: ["Fireball"],
            components: stocked(),
            specials: {},
            coins: fireball.coins,
        });
        slotFireball();
        const special = within(screen.getByTestId("spell-special-slot"));
        expect(special.getByText(specialById(fireball.special)!.name)).toBeInTheDocument();
        expect(special.getByText("0/1")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Can't craft/ })).toBeDisabled();
        expect(screen.getByTestId("spell-shortfall")).toHaveTextContent(
            `1 ${specialById(fireball.special)!.name}`
        );
    });

    it("crafts an L1 scroll and spends the inputs", () => {
        open({
            spellRecipes: ["Fireball"],
            components: stocked(),
            specials: { [fireball.special]: 1 },
            coins: fireball.coins,
            scrolls: {},
        });
        slotFireball();
        fireEvent.click(screen.getByRole("button", { name: `Craft · ${fireball.coins} coins` }));

        const game = store.getState().game;
        expect(game.scrolls).toEqual({ Fireball: { 1: 1 } });
        expect(game.components).toEqual([]);
        expect(game.specials).toEqual({});
        expect(game.coins).toBe(0);
        expect(screen.getByText("Crafted 1 Fireball L1")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Can't craft/ })).toBeDisabled();
    });
});
