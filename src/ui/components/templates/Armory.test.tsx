import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Armory from "@components/Armory";
import type { Item as ApiItem } from "../../../../api/_lib/types";

const ARMORY_URL = "http://localhost:9000";

const mockApiItem: ApiItem = {
    id: "item-1",
    createdAt: 0,
    name: "Iron Sword",
    category: "sword",
    set: "weapon",
    quality: "common",
    qualitySort: 1,
    cost: 5,
    pool: 20,
    icon: "sword_1",
    stats: [{ id: "s1", name: "attack_power", value: 10 }],
};

describe("Armory template", () => {
    beforeEach(() => {
        vi.stubEnv("VITE_ARMORY_URL", ARMORY_URL);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("renders the loading state while fetch is in flight", () => {
        vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders the error state when fetch throws a network error", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });
        await waitFor(() => expect(screen.getByText(/ERROR:/)).toBeInTheDocument());
        expect(screen.getByText(/network down/)).toBeInTheDocument();
    });

    it("renders the error state on a non-ok HTTP response", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response));
        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });
        await waitFor(() => expect(screen.getByText(/ERROR:/)).toBeInTheDocument());
        expect(screen.getByText(/HTTP 500/)).toBeInTheDocument();
    });

    it("renders the merchant unavailable state when VITE_ARMORY_URL is unset", () => {
        vi.unstubAllEnvs();
        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });
        expect(screen.getByText("Merchant unavailable")).toBeInTheDocument();
    });

    it("renders items when fetch succeeds", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve([mockApiItem]),
            } as unknown as Response)
        );
        renderWithProviders(<Armory />, { preloadedGame: { coins: 100, filters: [] } });
        await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
        expect(screen.queryByText(/ERROR:/)).not.toBeInTheDocument();
        expect(screen.queryByText("Merchant unavailable")).not.toBeInTheDocument();
    });
});
