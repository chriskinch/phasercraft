import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ComponentsPanel from "./ComponentsPanel";
import { COMPONENT_DEFS, type ComponentStack } from "@/types/game";

const scrap: ComponentStack = { id: "a", type: "scrap", quantity: 3 };

describe("ComponentsPanel", () => {
    it("shows the empty sell prompt until a stack is selected", () => {
        renderWithProviders(<ComponentsPanel />, { preloadedGame: { components: [scrap] } });
        expect(screen.getByText("Select a component to sell.")).toBeInTheDocument();
        expect(screen.queryByTestId("sell-controls")).not.toBeInTheDocument();
    });

    it("reveals sell controls for a selected stack", () => {
        renderWithProviders(<ComponentsPanel />, { preloadedGame: { components: [scrap] } });

        const grid = screen.getByTestId("components-grid");
        fireEvent.click(within(grid).getAllByRole("button")[0]);

        expect(screen.getByTestId("sell-controls")).toBeInTheDocument();
        expect(screen.getByTestId("sell-value")).toHaveTextContent(
            `+${COMPONENT_DEFS.scrap.sellValue}`
        );
    });

    it("sells the selected stack and falls back to the empty prompt when it is gone", () => {
        const { store } = renderWithProviders(<ComponentsPanel />, {
            preloadedGame: { components: [scrap] },
        });

        const grid = screen.getByTestId("components-grid");
        fireEvent.click(within(grid).getAllByRole("button")[0]);
        fireEvent.click(screen.getByRole("button", { name: "Sell All" }));

        // Stack is gone from the store and the controls reset to the prompt.
        expect(store.getState().game.components).toEqual([]);
        expect(screen.getByText("Select a component to sell.")).toBeInTheDocument();
        expect(screen.queryByTestId("sell-controls")).not.toBeInTheDocument();
    });
});
