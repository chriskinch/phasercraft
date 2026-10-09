import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import UI, { HUD_LAYOUT } from "./HUD";
import store from "@store";
import { loadGame, setCoins } from "@store/gameReducer";

// Regression tests for the Phase 2 HUD fixes (issue #307): the keyup-L
// handler crashed on corrupt save data (unguarded JSON.parse), and cleanup()
// removed keyboard listeners by event name only. The save/load/cleanup logic
// now lives in named methods, tested here against a minimal fake built on the
// real prototype — no Phaser boot.

interface HudUnderTest {
    save_slot: string;
    subscriptions: Array<ReturnType<typeof vi.fn>>;
    key_handlers: Record<string, () => void>;
    buttons: Array<{
        disableInteractive: ReturnType<typeof vi.fn>;
        setInteractive: ReturnType<typeof vi.fn>;
    }>;
    scene?: { input: { keyboard: { off: ReturnType<typeof vi.fn> } } };
    coins?: { text: { setText: ReturnType<typeof vi.fn> } };
    saveGame(): void;
    deleteSaves(): void;
    loadSavedGame(): void;
    renderCoinCount(): void;
    setButtonsEnabled(enabled: boolean): void;
    cleanup(): void;
}

function makeHud(): HudUnderTest {
    const hud = Object.create(UI.prototype) as HudUnderTest;
    hud.save_slot = "slot_a";
    hud.subscriptions = [];
    hud.key_handlers = {};
    hud.buttons = [
        { disableInteractive: vi.fn(), setInteractive: vi.fn() },
        { disableInteractive: vi.fn(), setInteractive: vi.fn() },
    ];
    hud.scene = { input: { keyboard: { off: vi.fn() } } };
    hud.coins = { text: { setText: vi.fn() } };
    return hud;
}

// Town opts out of the coin purse entirely, so a
// store-driven coin update must be safe when the container was never mounted.
describe("UI.renderCoinCount", () => {
    afterEach(() => {
        store.dispatch(setCoins(0));
    });

    it("reads the current coin balance into the purse", () => {
        const hud = makeHud();
        store.dispatch(setCoins(73));

        hud.renderCoinCount();

        expect(hud.coins!.text.setText).toHaveBeenCalledWith("Coins: 73");
    });

    it("does nothing when the coin purse is not mounted", () => {
        const hud = makeHud();
        delete hud.coins;

        expect(() => hud.renderCoinCount()).not.toThrow();
    });
});

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
        const game = { coins: 42, xp: 3 };
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
        expect(hud.scene!.input.keyboard.off).toHaveBeenCalledWith("keyup-P", handlerP, hud);
        expect(hud.scene!.input.keyboard.off).toHaveBeenCalledWith("keyup-L", handlerL, hud);
        expect(hud.scene!.input.keyboard.off).toHaveBeenCalledTimes(2);
    });

    // The HUD is a Container, so Phaser's destroy() clears `this.scene` — and
    // the scene calls cleanup() from its own shutdown(), which can land after
    // that. Guarding is only half the requirement: the store unsubscribes must
    // stay ABOVE the guard, or a future refactor sliding them below it would
    // silently reintroduce the subscription leak of #307.
    it("still unsubscribes, and does not throw, when the HUD was already destroyed", () => {
        const hud = makeHud();
        const unsubscribeA = vi.fn();
        const unsubscribeB = vi.fn();
        hud.subscriptions = [unsubscribeA, unsubscribeB];
        hud.key_handlers = { "keyup-P": vi.fn() };
        // Phaser's destroy() leaves the container in exactly this state.
        hud.scene = undefined;

        expect(() => hud.cleanup()).not.toThrow();

        expect(unsubscribeA).toHaveBeenCalled();
        expect(unsubscribeB).toHaveBeenCalled();
        expect(hud.subscriptions).toEqual([]);
    });
});

describe("UI.setButtonsEnabled", () => {
    it("disables all buttons when called with false (overlay open)", () => {
        const hud = makeHud();

        hud.setButtonsEnabled(false);

        hud.buttons.forEach((button) => {
            expect(button.disableInteractive).toHaveBeenCalled();
            expect(button.setInteractive).not.toHaveBeenCalled();
        });
    });

    it("re-enables all buttons when called with true (overlay closed)", () => {
        const hud = makeHud();

        hud.setButtonsEnabled(true);

        hud.buttons.forEach((button) => {
            expect(button.setInteractive).toHaveBeenCalled();
            expect(button.disableInteractive).not.toHaveBeenCalled();
        });
    });
});

// layout() re-places every HUD element against the scene's safe zone; it runs
// again whenever the zone is re-fitted (resize / safe-area inset change).
describe("UI.layout", () => {
    it("anchors the spell bar bottom-right and buttons bottom-left of the zone, then notifies", () => {
        const hud = Object.create(UI.prototype) as UI;
        const frames = [0, 1].map(() => ({ setPosition: vi.fn() }));
        const buttons = [0, 1].map(() => ({ setPosition: vi.fn() }));
        Object.assign(hud, {
            spells: 5,
            spacing: 60,
            frames,
            buttons,
            scene: { zone: { x: 87, y: 40, width: 670, height: 289, originX: 0, originY: 0 } },
            emit: vi.fn(),
        });

        hud.layout();

        // Right edge 757, five 60px slots: slot 0 at 757 - 4 * 60.
        expect(frames[0].setPosition).toHaveBeenCalledWith(517, 329);
        expect(frames[1].setPosition).toHaveBeenCalledWith(577, 329);
        expect(buttons[0].setPosition).toHaveBeenCalledWith(87, 329);
        expect(buttons[1].setPosition).toHaveBeenCalledWith(122, 329);
        expect(hud.emit).toHaveBeenCalledWith(HUD_LAYOUT);
    });
});
