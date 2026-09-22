import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { gameReducer, selectCharacter, switchUi, toggleUi } from "@store/gameReducer";
import type { RootState } from "@store";
import { buildActionSpace, createTestHook, resolveAction } from "./testHook";

// The action space is the contract the smoke pack drives, so the interesting
// assertions are about what it *refuses*: rows that are not legal in the current
// state, and arguments outside a row's enumerated options.

const makeStore = () => configureStore({ reducer: { game: gameReducer } });

// The reducer's own initial state, without exporting it just for tests.
const freshState = (): RootState => ({ game: gameReducer(undefined, { type: "@@INIT" }) });

const inRun = (): RootState => {
    const store = makeStore();
    store.dispatch(selectCharacter("Warrior"));
    return store.getState();
};

const ids = (state: RootState) => buildActionSpace(state).map((a) => a.id);

describe("buildActionSpace", () => {
    it("offers only class selection before a run has started", () => {
        expect(ids(freshState())).toEqual(["character.select"]);
    });

    it("swaps to the in-run actions once a class is chosen", () => {
        const available = ids(inRun());
        expect(available).toContain("ui.open");
        expect(available).toContain("travel.request");
        expect(available).not.toContain("character.select");
    });

    it("offers the close action only while an overlay is open", () => {
        const store = makeStore();
        store.dispatch(selectCharacter("Mage"));
        expect(ids(store.getState())).not.toContain("ui.close");

        store.dispatch(toggleUi("equipment"));
        expect(ids(store.getState())).toContain("ui.close");
    });

    it("indexes the available rows contiguously from 1", () => {
        const space = buildActionSpace(inRun());
        expect(space.map((a) => a.index)).toEqual(space.map((_, i) => i + 1));
    });

    it("publishes the enumerated options a row accepts", () => {
        const open = buildActionSpace(inRun()).find((a) => a.id === "ui.open");
        expect(open?.option?.name).toBe("menu");
        expect(open?.option?.values).toContain("equipment");
    });
});

describe("resolveAction", () => {
    it("resolves a row by id and by its 1-based index alike", () => {
        const state = inRun();
        const byId = resolveAction(state, "travel.request", "forest");
        const byIndex = resolveAction(state, byId.action.index, "forest");
        expect(byIndex.action.id).toBe("travel.request");
    });

    it("rejects a row that is not available here, and says what is", () => {
        expect(() => resolveAction(freshState(), "ui.open", "equipment")).toThrow(
            /No action "ui.open" is available here\. Available: \[1\] character\.select/
        );
    });

    it("rejects an unknown row", () => {
        expect(() => resolveAction(inRun(), "store.dispatch")).toThrow(/No action/);
    });

    it("requires a row's argument", () => {
        expect(() => resolveAction(inRun(), "ui.open")).toThrow(/needs a menu/);
    });

    it("rejects an argument outside the enumerated options", () => {
        expect(() => resolveAction(inRun(), "travel.request", "moon")).toThrow(
            /"moon" is not a valid destination/
        );
    });

    it("rejects an argument on a row that takes none", () => {
        const store = makeStore();
        store.dispatch(selectCharacter("Cleric"));
        store.dispatch(toggleUi("equipment"));
        expect(() => resolveAction(store.getState(), "ui.close", "equipment")).toThrow(
            /takes no argument/
        );
    });
});

describe("createTestHook", () => {
    it("opens an overlay that only the canvas HUD could otherwise open", () => {
        const store = makeStore();
        store.dispatch(selectCharacter("Ranger"));

        const ran = createTestHook(store).perform("ui.open", "equipment");

        expect(ran.id).toBe("ui.open");
        expect(store.getState().game).toMatchObject({ menu: "equipment", showUi: true });
    });

    it("switches between open overlays without closing the UI", () => {
        const store = makeStore();
        store.dispatch(selectCharacter("Ranger"));
        store.dispatch(switchUi("equipment"));
        store.dispatch(toggleUi("equipment"));

        createTestHook(store).perform("ui.open", "character");

        expect(store.getState().game).toMatchObject({ menu: "character", showUi: true });
    });

    it("dispatches nothing when the row is not available", () => {
        const store = makeStore();
        const before = store.getState();

        expect(() => createTestHook(store).perform("ui.open", "equipment")).toThrow();
        expect(store.getState()).toBe(before);
    });

    it("hands out a detached copy of the state, not the store's own", () => {
        const store = makeStore();
        const hook = createTestHook(store);

        const snapshot = hook.getState();
        snapshot.game.coins = -1;

        expect(store.getState().game.coins).not.toBe(-1);
    });
});
