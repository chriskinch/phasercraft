import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import UI from "./HUD";
import store from "@store";
import { loadGame } from "@store/gameReducer";

// Regression tests for the Phase 2 HUD fixes (issue #307): the keyup-L
// handler crashed on corrupt save data (unguarded JSON.parse), and cleanup()
// removed keyboard listeners by event name only. The save/load/cleanup logic
// now lives in named methods, tested here against a minimal fake built on the
// real prototype — no Phaser boot.

interface HudUnderTest {
    save_slot: string;
    subscriptions: Array<ReturnType<typeof vi.fn>>;
    key_handlers: Record<string, () => void>;
    scene: { input: { keyboard: { off: ReturnType<typeof vi.fn> } } };
    saveGame(): void;
    deleteSaves(): void;
    loadSavedGame(): void;
    cleanup(): void;
}

function makeHud(): HudUnderTest {
    const hud = Object.create(UI.prototype) as HudUnderTest;
    hud.save_slot = "slot_a";
    hud.subscriptions = [];
    hud.key_handlers = {};
    hud.scene = { input: { keyboard: { off: vi.fn() } } };
    return hud;
}

describe("UI.loadSavedGame", () => {
    let dispatch: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        dispatch = vi.spyOn(store, "dispatch").mockImplementation((action) => action);
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it("unwraps the root save shape and dispatches loadGame with the game slice", () => {
        // Saves persist the *root* state ({ game: {...} }); loadGame expects the
        // inner slice. loadSavedGame now unwraps .game (matching the Save menu's
        // Load), fixing the round-trip that previously double-nested game.
        const game = { coins: 42, wave: 3 };
        localStorage.setItem("slot_a", JSON.stringify({ game }));

        makeHud().loadSavedGame();

        expect(dispatch).toHaveBeenCalledWith(loadGame(game));
    });

    it("does not throw or dispatch when the slot holds corrupt JSON", () => {
        localStorage.setItem("slot_a", "{ not valid json");
        const hud = makeHud();

        expect(() => hud.loadSavedGame()).not.toThrow();
        expect(dispatch).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
    });

    it("does not dispatch when the slot is empty", () => {
        makeHud().loadSavedGame();

        expect(dispatch).not.toHaveBeenCalled();
    });
});

describe("UI.saveGame", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it("writes the store state to the save slot", () => {
        makeHud().saveGame();

        expect(localStorage.getItem("slot_a")).toBe(JSON.stringify(store.getState()));
    });

    it("does not throw when localStorage rejects the write", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new DOMException("quota exceeded", "QuotaExceededError");
        });
        const hud = makeHud();

        expect(() => hud.saveGame()).not.toThrow();
        expect(console.warn).toHaveBeenCalled();
    });
});

describe("UI.cleanup", () => {
    it("unsubscribes store subscriptions and removes the registered key listeners", () => {
        const hud = makeHud();
        const unsubscribeA = vi.fn();
        const unsubscribeB = vi.fn();
        hud.subscriptions = [unsubscribeA, unsubscribeB];
        const handlerP = vi.fn();
        const handlerL = vi.fn();
        hud.key_handlers = { "keyup-P": handlerP, "keyup-L": handlerL };

        hud.cleanup();

        expect(unsubscribeA).toHaveBeenCalled();
        expect(unsubscribeB).toHaveBeenCalled();
        expect(hud.subscriptions).toEqual([]);
        expect(hud.scene.input.keyboard.off).toHaveBeenCalledWith("keyup-P", handlerP, hud);
        expect(hud.scene.input.keyboard.off).toHaveBeenCalledWith("keyup-L", handlerL, hud);
        expect(hud.scene.input.keyboard.off).toHaveBeenCalledTimes(2);
    });
});
