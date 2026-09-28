import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Blacksmith from "@components/Blacksmith";
import { COMPONENT_DEFS, RECIPES, recipeById } from "@/types/game";
import { STAT_POSITIVE, STAT_NEGATIVE } from "@ui/themes";
import type { ComponentType } from "@/types/game";
import type { GameState } from "@store/gameReducer";
import { playSfx } from "@services/sfx";

// The clang (Step 4e) goes through the SFX service; stub it so the tests can
// count plays without a Phaser game.
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));

// Covers the test plan in docs/specs/blacksmith-crafting-ui.md. Every test works
// against a real recipe from the catalog, so a change to its materials breaks
// these rather than letting them drift from the shipped data.
const RECIPE_ID = "scrappers-blade";
const recipe = recipeById(RECIPE_ID)!;
const materials = Object.entries(recipe.materials) as Array<[ComponentType, number]>;

const materialsFor = (multiplier: number) =>
    materials.map(([type, count], i) => ({
        id: `stack-${i}`,
        type,
        quantity: count * multiplier,
    }));

const render = (partial: Partial<GameState> = {}) =>
    renderWithProviders(<Blacksmith />, {
        preloadedGame: { coins: 999, components: materialsFor(1), ...partial },
    });

/** Open the picker, choose the test recipe, and slot it onto the forge. */
const slotRecipe = () => {
    fireEvent.click(screen.getByTestId("recipe-card"));
    fireEvent.click(screen.getByRole("option", { name: new RegExp(recipe.result.name) }));
    fireEvent.click(screen.getByRole("button", { name: "Use recipe" }));
};

describe("Blacksmith recipe catalog", () => {
    // Decision 3: four component slots, so at most four materials per recipe.
    it("gives every recipe at most four materials", () => {
        for (const r of RECIPES) {
            expect(Object.keys(r.materials).length).toBeLessThanOrEqual(4);
        }
    });
});

describe("Blacksmith stat colours", () => {
    // .ready/.short read these custom properties with no hex fallback, so if a
    // root ever stopped supplying them the colours would silently go dark.
    it("feeds the shared stat colours to both view roots", () => {
        render();
        const forge = screen.getByTestId("forge");
        expect(forge.style.getPropertyValue("--stat-positive")).toBe(STAT_POSITIVE);
        expect(forge.style.getPropertyValue("--stat-negative")).toBe(STAT_NEGATIVE);

        fireEvent.click(screen.getByTestId("recipe-card"));
        const picker = screen.getByTestId("recipe-picker");
        expect(picker.style.getPropertyValue("--stat-positive")).toBe(STAT_POSITIVE);
        expect(picker.style.getPropertyValue("--stat-negative")).toBe(STAT_NEGATIVE);
    });
});

describe("Blacksmith forge", () => {
    it("starts empty, prompting for a recipe", () => {
        render();
        expect(screen.getByText("No recipe")).toBeTruthy();
        expect(screen.getByRole("button", { name: "Choose a recipe" })).toHaveProperty(
            "disabled",
            true
        );
    });

    it("renders four component slots, empty until a recipe is slotted", () => {
        render();
        const slots = within(screen.getByTestId("component-slots")).getAllByRole("listitem");
        expect(slots).toHaveLength(4);
        expect(screen.getAllByText("Not needed")).toHaveLength(4);
    });

    it("fills its component slots in catalog order, leaving unused ones empty", () => {
        render();
        slotRecipe();

        const slots = within(screen.getByTestId("component-slots")).getAllByRole("listitem");
        materials.forEach(([type, need], i) => {
            expect(slots[i].textContent).toContain(COMPONENT_DEFS[type].name);
            expect(slots[i].textContent).toContain(`${need}/${need}`);
        });
        // The recipe uses fewer than the four slots, so the rest stay empty.
        expect(screen.getAllByText("Not needed")).toHaveLength(4 - materials.length);
    });

    it("clearing the recipe empties the component slots", () => {
        render();
        slotRecipe();
        expect(screen.queryByText("No recipe")).toBeNull();

        fireEvent.click(screen.getByTestId("recipe-card"));
        expect(screen.getByText("No recipe")).toBeTruthy();
        expect(screen.getAllByText("Not needed")).toHaveLength(4);
    });

    it("shows have/need in green when met and red when short", () => {
        const { unmount } = render();
        slotRecipe();
        const [[, need]] = materials;
        // Exactly enough: the have/need row is the ready colour.
        expect(screen.getByText(`${need}/${need}`).className).toContain("ready");
        unmount();

        render({ components: [] });
        slotRecipe();
        expect(screen.getByText(`0/${need}`).className).toContain("short");
    });

    it("shows the item and its stats once a recipe is slotted", () => {
        render();
        slotRecipe();
        const card = screen.getByTestId("will-craft");
        expect(within(card).getByText(recipe.result.name)).toBeTruthy();
        // Stats are labelled and unit-formatted, not raw keys and bare numbers.
        expect(card.textContent).toContain("Attack Power");
    });

    it("names the first missing material in the shortfall line", () => {
        render({ components: [] });
        slotRecipe();
        const [[type, need]] = materials;
        expect(screen.getByTestId("shortfall").textContent).toBe(
            `Need ${need} more ${COMPONENT_DEFS[type].name} to craft`
        );
    });
});

describe("Blacksmith craft button", () => {
    it("says 'Choose a recipe' and is disabled with no recipe", () => {
        render();
        expect(screen.getByRole("button", { name: "Choose a recipe" })).toHaveProperty(
            "disabled",
            true
        );
    });

    it("says 'Missing parts' and is disabled when materials are short", () => {
        render({ components: [] });
        slotRecipe();
        const button = screen.getByRole("button", {
            name: `Missing parts · ${recipe.coins} coins`,
        });
        expect(button).toHaveProperty("disabled", true);
    });

    it("says 'Not enough coins' when only coins are short", () => {
        render({ coins: recipe.coins - 1 });
        slotRecipe();
        const button = screen.getByRole("button", {
            name: `Not enough coins · ${recipe.coins} coins`,
        });
        expect(button).toHaveProperty("disabled", true);
    });

    it("prefers 'Missing parts' when materials and coins are both short", () => {
        render({ coins: 0, components: [] });
        slotRecipe();
        expect(
            screen.getByRole("button", { name: `Missing parts · ${recipe.coins} coins` })
        ).toBeTruthy();
    });

    it("says 'Craft' and is enabled when everything is in", () => {
        render();
        slotRecipe();
        expect(
            screen.getByRole("button", { name: `Craft · ${recipe.coins} coins` })
        ).toHaveProperty("disabled", false);
    });
});

describe("Blacksmith recipe picker", () => {
    it("lists only known recipes, with no silhouettes for unknown ones", () => {
        render({ recipes: [RECIPE_ID] });
        fireEvent.click(screen.getByTestId("recipe-card"));

        const options = within(screen.getByTestId("recipe-picker")).getAllByRole("option");
        expect(options).toHaveLength(1);
        expect(options[0].textContent).toContain(recipe.result.name);
        // Decision 1: unlearnt recipes are absent entirely.
        expect(screen.queryByText("???")).toBeNull();
    });

    it("marks a recipe Ready or Missing parts from missingMaterials", () => {
        const { unmount } = render({ recipes: [RECIPE_ID] });
        fireEvent.click(screen.getByTestId("recipe-card"));
        expect(screen.getByText("Ready")).toBeTruthy();
        unmount();

        render({ recipes: [RECIPE_ID], components: [] });
        fireEvent.click(screen.getByTestId("recipe-card"));
        expect(screen.getByText("Missing parts")).toBeTruthy();
    });

    it("Back returns to the forge without slotting anything", () => {
        render();
        fireEvent.click(screen.getByTestId("recipe-card"));
        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(screen.getByTestId("forge")).toBeTruthy();
        expect(screen.getByText("No recipe")).toBeTruthy();
    });
});

describe("Blacksmith special slot", () => {
    // Decision 2: special items are Step 4d, and the slot is hidden until then.
    it("renders neither the special slot nor its picker", () => {
        render();
        slotRecipe();
        expect(screen.queryByText(/special/i)).toBeNull();
        expect(screen.queryByText("Optional")).toBeNull();
    });
});

describe("Blacksmith craft success", () => {
    it("shows the overlay after a craft the reducer accepts", () => {
        const { store } = render({ components: materialsFor(2) });
        slotRecipe();
        fireEvent.click(screen.getByRole("button", { name: `Craft · ${recipe.coins} coins` }));

        const overlay = screen.getByTestId("craft-success");
        expect(overlay.getAttribute("role")).toBe("status");
        expect(overlay.textContent).toContain("Crafted!");
        expect(overlay.textContent).toContain("Added to your inventory");
        expect(store.getState().game.inventory).toHaveLength(1);
    });

    it("does not show the overlay for a craft the reducer refuses", () => {
        const { store } = render({ components: [] });
        slotRecipe();
        // The button is disabled, so the craft never reaches the reducer.
        fireEvent.click(screen.getByRole("button", { name: /Missing parts/ }));
        expect(screen.queryByTestId("craft-success")).toBeNull();
        expect(store.getState().game.inventory).toHaveLength(0);
    });

    // The overlay's animation is CSS, so jsdom can't tell whether it *looks*
    // right — but it can catch the parts being deleted. Matched against the
    // scene's own children, and on whole class-name tokens: a bare
    // `[class*="anvil"]` search also matches the `anvilScene` wrapper, so the
    // anvil case would pass with no anvil in the tree.
    it("draws every part of the anvil scene", () => {
        render({ components: materialsFor(2) });
        slotRecipe();
        fireEvent.click(screen.getByRole("button", { name: `Craft · ${recipe.coins} coins` }));

        const scene = screen
            .getByTestId("craft-success")
            .querySelector('[class*="anvilScene"]') as HTMLElement;
        const partOf = (name: string) =>
            Array.from(scene.children).filter((child) =>
                new RegExp(`(^|[^A-Za-z])${name}([^A-Za-z]|$)`).test(child.className)
            );

        for (const part of ["anvil", "tang", "blade", "flash", "hammer"]) {
            expect(partOf(part)).toHaveLength(1);
        }
        expect(partOf("spark")).toHaveLength(14);
        // The hammer is a head on a handle, not a bar; both must be present or
        // the swing has nothing to strike with.
        const [hammer] = partOf("hammer");
        expect(hammer.querySelector('[class*="head"]')).toBeTruthy();
        expect(hammer.querySelector('[class*="handle"]')).toBeTruthy();
    });

    it("Craft another clears the forge", () => {
        render({ components: materialsFor(2) });
        slotRecipe();
        fireEvent.click(screen.getByRole("button", { name: `Craft · ${recipe.coins} coins` }));
        fireEvent.click(screen.getByRole("button", { name: "Craft another" }));

        expect(screen.queryByTestId("craft-success")).toBeNull();
        expect(screen.getByText("No recipe")).toBeTruthy();
    });

    it("Done dismisses the overlay and leaves the recipe slotted", () => {
        render({ components: materialsFor(2) });
        slotRecipe();
        fireEvent.click(screen.getByRole("button", { name: `Craft · ${recipe.coins} coins` }));
        fireEvent.click(screen.getByRole("button", { name: "Done" }));

        expect(screen.queryByTestId("craft-success")).toBeNull();
        // The name shows on both the recipe card and the result card, so scope
        // the check to the card that proves the recipe is still slotted.
        expect(within(screen.getByTestId("will-craft")).getByText(recipe.result.name)).toBeTruthy();
    });
});

describe("Blacksmith craft clang", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(playSfx).mockClear();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    const craft = () =>
        fireEvent.click(screen.getByRole("button", { name: `Craft · ${recipe.coins} coins` }));

    it("plays the clang once, on the hammer's impact frame, for an accepted craft", () => {
        render({ components: materialsFor(2) });
        slotRecipe();
        craft();

        vi.advanceTimersByTime(299);
        expect(playSfx).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(playSfx).toHaveBeenCalledTimes(1);
        expect(playSfx).toHaveBeenCalledWith("anvil-clang");

        vi.advanceTimersByTime(5000);
        expect(playSfx).toHaveBeenCalledTimes(1);
    });

    it("stays silent for a craft the reducer refuses", () => {
        render({ components: [] });
        slotRecipe();
        fireEvent.click(screen.getByRole("button", { name: /Missing parts/ }));

        vi.advanceTimersByTime(5000);
        expect(playSfx).not.toHaveBeenCalled();
    });

    it("plays again for the next craft", () => {
        render({ components: materialsFor(2) });
        slotRecipe();
        craft();
        vi.advanceTimersByTime(300);
        fireEvent.click(screen.getByRole("button", { name: "Done" }));
        craft();
        vi.advanceTimersByTime(300);

        expect(playSfx).toHaveBeenCalledTimes(2);
    });

    it("cancels a pending clang when the screen unmounts first", () => {
        const { unmount } = render({ components: materialsFor(2) });
        slotRecipe();
        craft();
        unmount();

        vi.advanceTimersByTime(5000);
        expect(playSfx).not.toHaveBeenCalled();
    });
});
