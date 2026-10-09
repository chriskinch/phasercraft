import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";

import UpdateBanner from "./UpdateBanner";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";

// The banner is driven entirely by `useRegisterSW` from vite-plugin-pwa's
// virtual module (aliased to test/stubs/pwaRegister.ts under vitest). Mock it so
// each test can put the service worker in the "waiting" state or not.

const setNeedRefresh = vi.fn();
const updateServiceWorker = vi.fn().mockResolvedValue(undefined);
let needRefresh = false;

vi.mock("virtual:pwa-register/react", () => ({
    useRegisterSW: () => ({
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [false, vi.fn()],
        updateServiceWorker,
    }),
}));

beforeEach(() => {
    needRefresh = false;
    vi.clearAllMocks();
});

describe("UpdateBanner", () => {
    it("stays hidden while no new service worker is waiting", () => {
        renderWithProviders(<UpdateBanner />);
        expect(screen.queryByTestId("update-banner")).toBeNull();
    });

    it("prompts once an update is waiting", () => {
        needRefresh = true;
        renderWithProviders(<UpdateBanner />);
        expect(screen.getByTestId("update-banner")).toBeInTheDocument();
    });

    it("activates the waiting worker when the player reloads", () => {
        needRefresh = true;
        renderWithProviders(<UpdateBanner />);

        fireEvent.click(screen.getByRole("button", { name: /^Reload$/i }));

        expect(updateServiceWorker).toHaveBeenCalledTimes(1);
    });

    it("clears the prompt on dismiss without updating", () => {
        needRefresh = true;
        renderWithProviders(<UpdateBanner />);

        fireEvent.click(screen.getByRole("button", { name: /Dismiss update banner/i }));

        expect(setNeedRefresh).toHaveBeenCalledWith(false);
        expect(updateServiceWorker).not.toHaveBeenCalled();
    });
});
