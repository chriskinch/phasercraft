import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ComponentsGrid from "./ComponentsGrid";
import type { ComponentStack } from "@/types/game";

const stacks: ComponentStack[] = [
    { id: "a", type: "scrap", quantity: 5 },
    { id: "b", type: "cloth", quantity: 12 },
];

describe("ComponentsGrid", () => {
    it("renders one slot per stack with the type icon and a quantity badge", () => {
        renderWithProviders(<ComponentsGrid />, { preloadedGame: { components: stacks } });

        const grid = screen.getByTestId("components-grid");
        expect(within(grid).getAllByRole("button")).toHaveLength(2);

        const icons = Array.from(grid.querySelectorAll('img[alt="Loot!"]')).map((n) =>
            n.getAttribute("src")
        );
        expect(icons).toContain("graphics/images/loot/crafting/scrap.png");
        expect(icons).toContain("graphics/images/loot/crafting/cloth.png");

        expect(within(grid).getByText("5")).toBeInTheDocument();
        expect(within(grid).getByText("12")).toBeInTheDocument();
    });

    it("renders an empty grid for no components", () => {
        renderWithProviders(<ComponentsGrid />, { preloadedGame: { components: [] } });
        const grid = screen.getByTestId("components-grid");
        expect(within(grid).queryAllByRole("button")).toHaveLength(0);
    });

    it("selects a stack on click", () => {
        renderWithProviders(<ComponentsGrid />, { preloadedGame: { components: stacks } });
        const grid = screen.getByTestId("components-grid");
        const [first] = within(grid).getAllByRole("button");

        expect(first).toHaveAttribute("aria-pressed", "false");
        fireEvent.click(first);
        expect(first).toHaveAttribute("aria-pressed", "true");
    });

    it("reflects a controlled selection and reports clicks to the parent", () => {
        const selected: string[] = [];
        renderWithProviders(
            <ComponentsGrid selectedId="b" onSelectStack={(id) => selected.push(id)} />,
            { preloadedGame: { components: stacks } }
        );
        const grid = screen.getByTestId("components-grid");
        const buttons = within(grid).getAllByRole("button");

        // Stack "b" is the controlled selection.
        expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
        expect(buttons[0]).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(buttons[0]);
        expect(selected).toEqual(["a"]);
    });

    it("paginates when there are more stacks than fit on a page", () => {
        const many: ComponentStack[] = Array.from({ length: 20 }, (_, i) => ({
            id: `s${i}`,
            type: "scrap",
            quantity: i + 1,
        }));
        renderWithProviders(<ComponentsGrid />, { preloadedGame: { components: many } });

        const grid = screen.getByTestId("components-grid");
        // Not every stack fits on the first page.
        expect(within(grid).getAllByRole("button").length).toBeLessThan(many.length);

        // Controls appear and Next advances the page indicator.
        const controls = screen.getByTestId("pagination-controls");
        const indicatorBefore = controls.textContent;
        fireEvent.click(within(controls).getByText("›"));
        expect(controls.textContent).not.toEqual(indicatorBefore);
    });
});
