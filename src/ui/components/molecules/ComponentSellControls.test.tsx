import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import ComponentSellControls from "./ComponentSellControls";
import { COMPONENT_DEFS, type ComponentStack } from "@/types/game";

const cloth: ComponentStack = { id: "c1", type: "cloth", quantity: 5 };

describe("ComponentSellControls", () => {
    it("prompts to select a component when nothing is selected", () => {
        renderWithProviders(<ComponentSellControls stack={null} />);
        expect(screen.getByText("Select a component to sell.")).toBeInTheDocument();
        expect(screen.queryByTestId("sell-controls")).not.toBeInTheDocument();
    });

    it("shows the running value for the stepped quantity", () => {
        renderWithProviders(<ComponentSellControls stack={cloth} />, {
            preloadedGame: { components: [cloth] },
        });
        expect(screen.getByTestId("sell-qty")).toHaveTextContent("1");
        expect(screen.getByTestId("sell-value")).toHaveTextContent(
            `+${COMPONENT_DEFS.cloth.sellValue}`
        );

        fireEvent.click(screen.getByRole("button", { name: "+" }));
        fireEvent.click(screen.getByRole("button", { name: "+" }));
        expect(screen.getByTestId("sell-qty")).toHaveTextContent("3");
        expect(screen.getByTestId("sell-value")).toHaveTextContent(
            `+${COMPONENT_DEFS.cloth.sellValue * 3}`
        );
    });

    it("clamps the stepper to [1, stack.quantity]", () => {
        const single: ComponentStack = { id: "s", type: "scrap", quantity: 1 };
        renderWithProviders(<ComponentSellControls stack={single} />, {
            preloadedGame: { components: [single] },
        });
        expect(screen.getByRole("button", { name: "-" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "+" })).toBeDisabled();
    });

    it("Sell 1 sells a single unit", () => {
        const { store } = renderWithProviders(<ComponentSellControls stack={cloth} />, {
            preloadedGame: { components: [cloth] },
        });
        const coinsBefore = store.getState().game.coins;

        fireEvent.click(screen.getByRole("button", { name: "Sell 1" }));

        const state = store.getState().game;
        expect(state.components[0].quantity).toBe(4);
        expect(state.coins).toBe(coinsBefore + COMPONENT_DEFS.cloth.sellValue);
    });

    it("Sell N sells the stepped quantity", () => {
        const { store } = renderWithProviders(<ComponentSellControls stack={cloth} />, {
            preloadedGame: { components: [cloth] },
        });
        const coinsBefore = store.getState().game.coins;

        fireEvent.click(screen.getByRole("button", { name: "+" })); // qty 2
        fireEvent.click(screen.getByRole("button", { name: "Sell 2" }));

        const state = store.getState().game;
        expect(state.components[0].quantity).toBe(3);
        expect(state.coins).toBe(coinsBefore + COMPONENT_DEFS.cloth.sellValue * 2);
    });

    it("Sell All removes the whole stack", () => {
        const { store } = renderWithProviders(<ComponentSellControls stack={cloth} />, {
            preloadedGame: { components: [cloth] },
        });
        const coinsBefore = store.getState().game.coins;

        fireEvent.click(screen.getByRole("button", { name: "Sell All" }));

        const state = store.getState().game;
        expect(state.components).toEqual([]);
        expect(state.coins).toBe(coinsBefore + COMPONENT_DEFS.cloth.sellValue * cloth.quantity);
    });
});
