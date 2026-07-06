import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@ui/test-utils/renderWithProviders";
import Coop from "@components/Coop";
import type { CoopSession, CoopState } from "@/net/CoopSession";

// Drives the panel through session states with a fake CoopSession (the panel's
// injectable seam) — no WebRTC, no signaling.

interface FakeSessionHandle {
    session: CoopSession;
    setState(next: Partial<CoopState>): void;
    host: ReturnType<typeof vi.fn>;
    join: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
}

const makeFakeSession = (initial: Partial<CoopState> = {}): FakeSessionHandle => {
    let state: CoopState = {
        status: "idle",
        role: null,
        code: null,
        error: null,
        peerCharacter: null,
        ...initial,
    };
    const listeners = new Set<() => void>();
    const host = vi.fn();
    const join = vi.fn();
    const disconnect = vi.fn();

    const session = {
        subscribe: (fn: () => void) => {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        getState: () => state,
        host,
        join,
        disconnect,
    } as unknown as CoopSession;

    return {
        session,
        setState: (next) => {
            state = { ...state, ...next };
            listeners.forEach((fn) => fn());
        },
        host,
        join,
        disconnect,
    };
};

describe("Coop template", () => {
    it("asks the player to load a game first when no character is selected", () => {
        const fake = makeFakeSession();
        renderWithProviders(<Coop session={fake.session} />);
        expect(screen.getByText(/load or start a game/i)).toBeInTheDocument();
    });

    it("hosts a session with the selected character", () => {
        const fake = makeFakeSession();
        renderWithProviders(<Coop session={fake.session} />, {
            preloadedGame: { character: "Warrior" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Host Game" }));
        expect(fake.host).toHaveBeenCalledWith({ character: "Warrior" });
    });

    it("shows the join code while hosting", () => {
        const fake = makeFakeSession({ status: "hosting", role: "host", code: "ABCDE" });
        renderWithProviders(<Coop session={fake.session} />, {
            preloadedGame: { character: "Warrior" },
        });

        expect(screen.getByTestId("join-code")).toHaveTextContent("ABCDE");
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("only enables Join once a full code is typed, then joins with it", () => {
        const fake = makeFakeSession();
        renderWithProviders(<Coop session={fake.session} />, {
            preloadedGame: { character: "Mage" },
        });

        const joinButton = screen.getByRole("button", { name: "Join" });
        expect(joinButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText("Join code"), { target: { value: "abcde" } });
        expect(joinButton).toBeEnabled();

        fireEvent.click(joinButton);
        expect(fake.join).toHaveBeenCalledWith("ABCDE", { character: "Mage" });
    });

    it("shows the partner's class and a disconnect action when connected", () => {
        const fake = makeFakeSession({
            status: "connected",
            role: "guest",
            code: "ABCDE",
            peerCharacter: "Ranger",
        });
        renderWithProviders(<Coop session={fake.session} />, {
            preloadedGame: { character: "Mage" },
        });

        expect(screen.getByText(/playing with a ranger/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Disconnect" }));
        expect(fake.disconnect).toHaveBeenCalled();
    });

    it("surfaces errors and lets the player retry", () => {
        const fake = makeFakeSession({ status: "error", error: "The co-op session expired." });
        renderWithProviders(<Coop session={fake.session} />, {
            preloadedGame: { character: "Mage" },
        });

        expect(screen.getByRole("alert")).toHaveTextContent(/session expired/i);
        expect(screen.getByRole("button", { name: "Host Game" })).toBeInTheDocument();
    });

    it("re-renders when the session state changes", () => {
        const fake = makeFakeSession();
        renderWithProviders(<Coop session={fake.session} />, {
            preloadedGame: { character: "Warrior" },
        });
        expect(screen.getByRole("button", { name: "Host Game" })).toBeInTheDocument();

        act(() => fake.setState({ status: "hosting", role: "host", code: "ZZZZZ" }));
        expect(screen.getByTestId("join-code")).toHaveTextContent("ZZZZZ");
    });
});
