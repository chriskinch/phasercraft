import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import System from "@components/System";
import type { RootState } from "@store";

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    localStorage.clear();
});

describe("System template", () => {
    it("renders the in-game system actions", () => {
        renderWithProviders(<System state={{} as RootState} />);

        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Quit" })).toBeInTheDocument();
    });

    it("Settings navigates to the settings screen and records the return path", () => {
        const { store } = renderWithProviders(<System state={{} as RootState} />, {
            preloadedGame: { menu: "system" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Settings" }));

        const { menu, previousMenu } = store.getState().game;
        // Settings can now be reached mid-run; closing it returns to the system menu.
        expect(menu).toBe("settings");
        expect(previousMenu).toBe("system");
    });
});
