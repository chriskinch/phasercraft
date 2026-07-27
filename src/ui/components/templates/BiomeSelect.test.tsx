import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { BIOMES, BIOME_IDS } from "@config/biomes";
import BiomeSelect from "@components/BiomeSelect";

describe("BiomeSelect", () => {
    it("renders a card per biome with its name and colour swatch", () => {
        renderWithProviders(<BiomeSelect />);

        BIOME_IDS.forEach((id) => {
            expect(screen.getByText(BIOMES[id].name)).toBeInTheDocument();
            expect(screen.getByTestId(`biome-swatch-${id}`)).toBeInTheDocument();
        });
    });

    it("records the chosen biome as the travel intent", () => {
        const { store } = renderWithProviders(<BiomeSelect />);

        fireEvent.click(screen.getAllByRole("button", { name: "Travel" })[1]);

        expect(store.getState().game.travelTo).toBe(BIOME_IDS[1]);
    });

    it("closes the overlay as it sets the intent", () => {
        // Load-bearing: the HUD's showUi subscription pauses whichever scene owns
        // it, so a scene started while showUi is still true would pause itself on
        // arrival.
        const { store } = renderWithProviders(<BiomeSelect />, {
            preloadedGame: { showUi: true },
        });

        fireEvent.click(screen.getAllByRole("button", { name: "Travel" })[0]);

        expect(store.getState().game.showUi).toBe(false);
    });
});
