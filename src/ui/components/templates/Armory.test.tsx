import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Armory from "@components/Armory";

// Armory now drives its UI off the REST `useArmory` hook (Phase 8), so these
// tests mock `fetch` and `VITE_ARMORY_URL` rather than Apollo. They cover the
// three states: in-flight (loading), loaded (stock rendered), and the graceful
// "merchant unavailable" state (no endpoint configured, or the request failed).

const sampleItems = [
    {
        id: "item-1",
        name: "Sword of Testing",
        category: "sword",
        set: "weapon",
        icon: "sword_1",
        quality: "rare",
        qualitySort: 3,
        cost: 40,
        pool: 50,
        stats: [{ id: "stat-1", name: "attack_power", value: 12 }],
    },
];

describe("Armory template", () => {
    beforeEach(() => {
        vi.stubEnv("VITE_ARMORY_URL", "http://test.local/api/armory");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("renders the loading state, then the stock once items load", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({ ok: true, json: async () => sampleItems })
        );

        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
        // Ready state renders the merchant controls and the loaded item.
        expect(screen.getByText("Restock")).toBeInTheDocument();
        expect(screen.getAllByAltText("Loot!").length).toBeGreaterThan(0);
    });

    it("shows the merchant-unavailable state when no endpoint is configured", async () => {
        vi.stubEnv("VITE_ARMORY_URL", "");

        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });

        await waitFor(() =>
            expect(screen.getByText(/merchant is currently unavailable/i)).toBeInTheDocument()
        );
    });

    it("shows the merchant-unavailable state when the request fails", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });

        await waitFor(() =>
            expect(screen.getByText(/merchant is currently unavailable/i)).toBeInTheDocument()
        );
    });
});
