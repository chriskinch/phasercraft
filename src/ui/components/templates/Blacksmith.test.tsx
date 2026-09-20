import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Blacksmith from "@components/Blacksmith";
import { INITIAL_RECIPES, RECIPES, recipeById } from "@/types/game";
import type { ComponentType } from "@/types/game";
import type { GameState } from "@store/gameReducer";

// Every test works against a real recipe from the catalog, so a change to its
// materials breaks these rather than letting them drift from the shipped data.
const RECIPE_ID = "scrappers-blade";
const recipe = recipeById(RECIPE_ID)!;

// Components holding `multiplier` × the recipe's materials, one stack per type.
const materialsFor = (multiplier: number) =>
    Object.entries(recipe.materials).map(([type, count], i) => ({
        id: `stack-${i}`,
        type: type as ComponentType,
        quantity: count * multiplier,
    }));

const render = (partial: Partial<GameState> = {}) =>
    renderWithProviders(<Blacksmith />, {
        preloadedGame: { coins: 999, components: materialsFor(1), ...partial },
    });

const selectRecipe = () =>
    fireEvent.click(screen.getByRole("option", { name: recipe.result.name }));

describe("Blacksmith template", () => {
    it("lists every recipe, naming the known ones and hiding the rest", () => {
        render();
        const list = screen.getByTestId("recipe-list");
        expect(within(list).getAllByRole("option")).toHaveLength(RECIPES.length);
        // Starters are readable; everything else is an unnamed silhouette.
        expect(within(list).getAllByRole("option", { name: "Unknown recipe" })).toHaveLength(
            RECIPES.length - INITIAL_RECIPES.length
        );
    });

    it("cannot select a recipe the player has not learnt", () => {
        render({ recipes: [] });
        const locked = screen.getAllByRole("option", { name: "Unknown recipe" })[0];
        expect((locked as HTMLButtonElement).disabled).toBe(true);
    });

    it("prompts for a selection before one is made", () => {
        render();
        expect(screen.getByRole("button", { name: "Craft" })).toHaveProperty("disabled", true);
        expect(screen.getByText("Select a recipe")).toBeTruthy();
    });

    it("shows the selected recipe's have/need materials and coin cost", () => {
        render();
        selectRecipe();

        const materials = screen.getByTestId("recipe-materials");
        for (const [, count] of Object.entries(recipe.materials)) {
            expect(within(materials).getByText(`${count}/${count}`)).toBeTruthy();
        }
        expect(
            within(screen.getByTestId("recipe-cost")).getByText(String(recipe.coins))
        ).toBeTruthy();
    });

    it("crafts the item into the inventory, spending materials and coins", () => {
        const { store } = render({ components: materialsFor(2) });
        selectRecipe();
        fireEvent.click(screen.getByRole("button", { name: "Craft" }));

        const { inventory, coins } = store.getState().game;
        expect(inventory).toHaveLength(1);
        expect(inventory[0].name).toBe(recipe.result.name);
        expect(coins).toBe(999 - recipe.coins);
    });

    it("disables Craft and says why when materials are short", () => {
        render({ components: [] });
        selectRecipe();
        expect(screen.getByRole("button", { name: "Craft" })).toHaveProperty("disabled", true);
        expect(screen.getByText("Missing materials")).toBeTruthy();
    });

    it("disables Craft and says why when coins are short", () => {
        render({ coins: recipe.coins - 1 });
        selectRecipe();
        expect(screen.getByRole("button", { name: "Craft" })).toHaveProperty("disabled", true);
        expect(screen.getByText("Not enough coins")).toBeTruthy();
    });
});
