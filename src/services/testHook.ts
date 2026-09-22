import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "@store";
import { requestTravel, selectCharacter, switchUi, toggleUi } from "@store/gameReducer";
import type { TravelDestination } from "@store/gameReducer";
import { BIOME_IDS } from "@scenes/biomes/biomes";
import type { PlayerName } from "@entities/Player/AssignClass";

// Deterministic E2E test hook — an allowlisted action space over the game store.
// See docs/ROADMAP.md, "Spike — E2E test hook".
//
// Why it exists: the game is a Phaser `<canvas>` with a React overlay on top, so
// everything the canvas owns (the HUD, the in-run Equipment button, area
// progress) is invisible to the DOM. Two smoke flows sat as `test.fixme` for
// want of a way in.
//
// The shape is borrowed from browser-use/jev-ultrafast, minus the model: rather
// than exposing the store and letting a caller dispatch whatever it likes, every
// observation rebuilds an *indexed table of the actions that are legal right
// now*, and execution resolves an index (or id) back through that table. The
// caller picks a row and, where a row takes an argument, one of its enumerated
// options — never a payload, an action type or a selector. Two things follow:
//
//   - the table is the contract, so a test reads as "what can the player do
//     here", not "what internal action shall I fire";
//   - `perform()` re-derives the table at call time and refuses a row that is no
//     longer available, so a stale step fails loudly instead of forcing the store
//     into a state the real UI could never produce.
//
// The allowlist is deliberately UI/navigation only. Nothing here writes game
// state directly (no granting coins, no setting the enemy count), so a test
// cannot manufacture the outcome it is meant to be asserting.
//
// This module is absent from production builds: `main.tsx` guards its import
// with a statically-foldable `import.meta.env` check, so `npm run build` drops
// both the branch and this chunk. `npm run dev` and `npm run build:e2e` keep it.

export const TEST_HOOK_VERSION = 1;

type GameStore = Store<RootState>;

// The class list rendered by CharacterSelect.tsx. Typed as PlayerName so a
// rename on the Player side breaks this build rather than the smoke pack.
const PLAYER_NAMES: readonly PlayerName[] = [
    "Cleric",
    "Mage",
    "Occultist",
    "Ranger",
    "Warrior",
];

// Menu keys from the registry in `src/ui/UI.tsx`. Deliberately a subset — the
// screens a player reaches in-run, which is what the canvas-gated flows need.
// (If this hook outlives the spike, lift that registry out of the component so
// there is one list; noted in the roadmap.)
const OPENABLE_MENUS = [
    "equipment",
    "character",
    "merchant",
    "armory",
    "biomeSelect",
    "system",
] as const;

const TRAVEL_DESTINATIONS = [...BIOME_IDS, "town"] as const;

// One enumerated argument, or none. Anything richer would be a payload, which is
// the thing this hook exists not to accept.
interface ActionOption {
    name: string;
    values: readonly string[];
}

interface TestActionSpec {
    id: string;
    label: string;
    option?: ActionOption;
    available: (state: RootState) => boolean;
    run: (store: GameStore, state: RootState, value?: string) => void;
}

/** A row of the action space, as handed to the caller. */
export interface TestAction {
    index: number;
    id: string;
    label: string;
    option?: ActionOption;
}

const CATALOG: readonly TestActionSpec[] = [
    {
        id: "character.select",
        label: "Pick a class and start the run",
        option: { name: "character", values: PLAYER_NAMES },
        // Only before a run: Character Select is the one DOM path here, and it
        // is gone once a class is chosen.
        available: (state) => state.game.character === null,
        run: (store, _state, value) => {
            store.dispatch(selectCharacter(value as PlayerName));
        },
    },
    {
        id: "ui.open",
        label: "Open an overlay the canvas HUD would open",
        option: { name: "menu", values: OPENABLE_MENUS },
        available: (state) => state.game.character !== null,
        run: (store, state, value) => {
            const menu = value as string;
            store.dispatch(switchUi(menu));
            // `toggleUi` flips `showUi`, so it is only correct while the overlay
            // is closed — switching between two open overlays is `switchUi` alone.
            if (!state.game.showUi) store.dispatch(toggleUi(menu));
        },
    },
    {
        id: "ui.close",
        label: "Close the open overlay",
        available: (state) => state.game.showUi,
        run: (store, state) => {
            // Mirrors UI.tsx's own close handler, which keeps `menu` set.
            store.dispatch(toggleUi(state.game.menu));
        },
    },
    {
        id: "travel.request",
        label: "Travel to a biome, or back to town",
        option: { name: "destination", values: TRAVEL_DESTINATIONS },
        // The active scene consumes the request and clears it; requesting one
        // before a class exists would be consumed by nobody.
        available: (state) => state.game.character !== null,
        run: (store, _state, value) => {
            store.dispatch(requestTravel(value as TravelDestination));
        },
    },
];

const describe = (spec: TestActionSpec, index: number): TestAction => ({
    index,
    id: spec.id,
    label: spec.label,
    ...(spec.option ? { option: spec.option } : {}),
});

/** The actions legal in `state`, indexed from 1 in catalog order. */
export function buildActionSpace(state: RootState): TestAction[] {
    return CATALOG.filter((spec) => spec.available(state)).map((spec, i) =>
        describe(spec, i + 1)
    );
}

/**
 * Resolve `target` (an id or a 1-based index) against the action space `state`
 * produces right now, validating `value` against the row's enumerated options.
 * Throws with the currently-available rows listed, so a stale step in a test
 * says what it could have done instead.
 */
export function resolveAction(
    state: RootState,
    target: string | number,
    value?: string
): { spec: TestActionSpec; action: TestAction } {
    const available = CATALOG.filter((spec) => spec.available(state));
    const space = available.map((spec, i) => describe(spec, i + 1));

    const position = space.findIndex((a) => a.id === target || a.index === target);
    const spec = available[position];
    const action = space[position];
    if (position === -1 || !spec || !action) {
        const listed = space.map((a) => `[${a.index}] ${a.id}`).join(", ") || "none";
        throw new Error(`No action "${target}" is available here. Available: ${listed}`);
    }

    if (spec.option) {
        const choices = spec.option.values.join(", ");
        if (value === undefined) {
            throw new Error(`"${spec.id}" needs a ${spec.option.name}, one of: ${choices}`);
        }
        if (!spec.option.values.includes(value)) {
            throw new Error(
                `"${value}" is not a valid ${spec.option.name} for "${spec.id}". Choose one of: ${choices}`
            );
        }
    } else if (value !== undefined) {
        throw new Error(`"${spec.id}" takes no argument, but got "${value}"`);
    }

    return { spec, action };
}

export interface PhasercraftTestHook {
    version: number;
    /** A detached copy of the store — callers observe, they do not hold a reference. */
    getState: () => RootState;
    /** The action space for the current state. */
    actions: () => TestAction[];
    /** Run one row of the current action space; returns the row that ran. */
    perform: (target: string | number, value?: string) => TestAction;
}

declare global {
    interface Window {
        __phasercraft?: PhasercraftTestHook;
    }
}

export function createTestHook(store: GameStore): PhasercraftTestHook {
    return {
        version: TEST_HOOK_VERSION,
        getState: () => structuredClone(store.getState()),
        actions: () => buildActionSpace(store.getState()),
        perform: (target, value) => {
            // Re-derive against live state, not against whatever the caller last
            // observed: this is the freshness guard.
            const state = store.getState();
            const { spec, action } = resolveAction(state, target, value);
            spec.run(store, state, value);
            return action;
        },
    };
}

export function installTestHook(store: GameStore): void {
    window.__phasercraft = createTestHook(store);
}
