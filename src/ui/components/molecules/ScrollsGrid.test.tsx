import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ScrollsGrid from "./ScrollsGrid";

const preloadedGame = {
    character: "Mage" as const,
    scrolls: { Fireball: { 1: 3, 2: 1 }, Whirlwind: { 1: 2 } },
};

describe("ScrollsGrid", () => {
    it("renders one tile per spell + level with the scroll frame and a count badge", () => {
        renderWithProviders(<ScrollsGrid selectedKey={null} onSelect={() => {}} />, {
            preloadedGame,
        });
        const grid = screen.getByTestId("scrolls-grid");
        const tiles = within(grid).getAllByRole("button");
        expect(tiles.map((t) => t.getAttribute("aria-label"))).toEqual([
            "Fireball Scroll L1 ×3",
            "Fireball Scroll L2 ×1",
            "Whirlwind Scroll L1 ×2",
        ]);
        expect(tiles[1].querySelector("[data-frame]")).toHaveAttribute("data-frame", "Fireball_l2");
        expect(within(tiles[0]).getByText("3")).toBeInTheDocument();
        // No level number on the tile: colour carries the level.
        expect(within(tiles[1]).queryByText(/L2/)).not.toBeInTheDocument();
    });

    it("reflects the controlled selection and reports clicks", () => {
        const picked: string[] = [];
        renderWithProviders(
            <ScrollsGrid selectedKey="Whirlwind_l1" onSelect={(k) => picked.push(k)} />,
            { preloadedGame }
        );
        const tiles = within(screen.getByTestId("scrolls-grid")).getAllByRole("button");
        expect(tiles[2]).toHaveAttribute("aria-pressed", "true");
        expect(tiles[0]).toHaveAttribute("aria-pressed", "false");
        fireEvent.click(tiles[0]);
        expect(picked).toEqual(["Fireball_l1"]);
    });

    it("anchors each tile to its tooltip", () => {
        renderWithProviders(<ScrollsGrid selectedKey={null} onSelect={() => {}} />, {
            preloadedGame,
        });
        const [first] = within(screen.getByTestId("scrolls-grid")).getAllByRole("button");
        expect(first).toHaveAttribute("data-tooltip-id", "scroll-Fireball_l1");
    });

    it("renders an empty grid with no scrolls", () => {
        renderWithProviders(<ScrollsGrid selectedKey={null} onSelect={() => {}} />, {
            preloadedGame: { scrolls: {} },
        });
        expect(within(screen.getByTestId("scrolls-grid")).queryAllByRole("button")).toHaveLength(0);
    });
});
