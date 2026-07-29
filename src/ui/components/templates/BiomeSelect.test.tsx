import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import { BIOME_IDS, BIOMES } from "@/scenes/biomes/biomes";
import BiomeSelect from "@components/BiomeSelect";

// Template tests for the temporary destination picker. Verify picking a biome
// records the right travel request and closes the overlay — the actual scene
// transition is TownScene's job (see BiomeScene.test.ts / TownScene coverage),
// not this component's.

describe("BiomeSelect template", () => {
    it("lists every biome by name", () => {
        renderWithProviders(<BiomeSelect />);

        BIOME_IDS.forEach((id) => {
            expect(screen.getByText(BIOMES[id].name)).toBeInTheDocument();
        });
    });

    it("dispatches requestTravel for the clicked biome and closes the overlay", () => {
        const { store } = renderWithProviders(<BiomeSelect />, {
            preloadedGame: { showUi: true, menu: "biomeSelect" },
        });

        const desertItem = screen.getByText(BIOMES.desert.name).closest("li");
        expect(desertItem).not.toBeNull();
        fireEvent.click((desertItem as HTMLLIElement).querySelector("button") as HTMLButtonElement);

        expect(store.getState().game.travelRequest).toBe("desert");
        expect(store.getState().game.showUi).toBe(false);
    });
});
