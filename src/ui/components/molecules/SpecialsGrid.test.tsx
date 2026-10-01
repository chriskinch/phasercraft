import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import SpecialsGrid from "./SpecialsGrid";

describe("SpecialsGrid", () => {
    it("shows one tile per owned special with its sprite, count and bonus", () => {
        renderWithProviders(<SpecialsGrid />, {
            preloadedGame: { specials: { "void-pearl": 2, "troll-heart": 1 } },
        });
        const grid = screen.getByTestId("specials-grid");
        const tiles = within(grid).getAllByRole("img", { name: /×/ });
        expect(tiles).toHaveLength(2);

        const pearl = within(grid).getByRole("img", { name: /^Void Pearl ×2/ });
        expect(pearl.getAttribute("aria-label")).toMatch(/Critical Chance/);
        expect(within(pearl).getByText("2")).toBeInTheDocument();
        expect(pearl.querySelector("img")?.getAttribute("src")).toBe(
            "graphics/images/loot/misc/misc_2.png"
        );
    });

    it("is empty when no specials are owned", () => {
        renderWithProviders(<SpecialsGrid />, { preloadedGame: { specials: {} } });
        const grid = screen.getByTestId("specials-grid");
        expect(within(grid).queryAllByRole("img", { name: /×/ })).toHaveLength(0);
    });
});

describe("SpecialsGrid tooltip", () => {
    it("anchors each tile to a special tooltip", () => {
        renderWithProviders(<SpecialsGrid />, { preloadedGame: { specials: { "void-pearl": 1 } } });
        const tile = within(screen.getByTestId("specials-grid")).getByRole("img", {
            name: /Void Pearl/,
        });
        expect(tile).toHaveAttribute("data-tooltip-id", "special-void-pearl");
    });
});
