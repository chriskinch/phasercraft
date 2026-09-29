import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { writeSettings, DEFAULT_SETTINGS } from "@services/settingsStorage";
import { STARTER_ITEMS } from "@store/gameReducer";
import CharacterCard from "./CharacterCard";

// Starting a new game applies the Starter items setting before the run begins.

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    localStorage.clear();
});

describe("CharacterCard", () => {
    it("starts with an empty purse and no parts while Starter items is off", () => {
        const { store } = renderWithProviders(<CharacterCard type="Cleric" />);

        fireEvent.click(screen.getByRole("button", { name: "Cleric" }));

        const game = store.getState().game;
        expect(game.coins).toBe(0);
        expect(game.components).toEqual([]);
        expect(game.specials).toEqual({});
        expect(game.character).toBe("Cleric");
    });

    it("grants the starter kit while Starter items is on", () => {
        writeSettings({ ...DEFAULT_SETTINGS, starterItems: true });
        const { store } = renderWithProviders(<CharacterCard type="Cleric" />);

        fireEvent.click(screen.getByRole("button", { name: "Cleric" }));

        const game = store.getState().game;
        expect(game.coins).toBe(STARTER_ITEMS.coins);
        expect(game.components.length).toBeGreaterThan(0);
        expect(Object.values(game.specials)).toContain(STARTER_ITEMS.specialsEach);
        expect(game.character).toBe("Cleric");
    });
});
