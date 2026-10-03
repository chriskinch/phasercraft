import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Player from "./Player";
import store from "@store";
import { createSpell } from "@entities/Spells/AssignSpell";
import { loadGame, readScroll } from "@store/gameReducer";
import type Spell from "@entities/Spells/Spell";
import type { SpellLevel, SpellType } from "@/types/game";

// The player builds its HUD spells from the stored ability loadout (slot =
// HUD order) and follows live changes mid-run (#549). Mocked at the entity
// seam: a constructor-free Player on the real prototype, with spell
// construction stubbed out at the AssignSpell factory.
vi.mock("@entities/Spells/AssignSpell", () => ({ createSpell: vi.fn() }));

interface FakeSpell {
    type: SpellType;
    slot: number;
    hotkey: string;
    level: SpellLevel;
    setLevel: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    button: { destroy: ReturnType<typeof vi.fn> };
    cooldownTimer?: { stop: ReturnType<typeof vi.fn> };
}

interface PlayerUnderTest {
    scene: unknown;
    x: number;
    y: number;
    subscriptions: (() => void)[];
    slotted: unknown[];
    spells: FakeSpell[];
    casting: { notifyDisabled: ReturnType<typeof vi.fn>; cleanup: ReturnType<typeof vi.fn> };
    scene_events: { off: ReturnType<typeof vi.fn> };
    castBar: { cleanup: () => void };
    health: { cleanup: () => void };
    resource: { cleanup: () => void };
    shield: { cleanup: () => void };
    boons: { cleanup: () => void };
    syncSpells(
        loadout: readonly (SpellType | null)[],
        levelOf: (type: SpellType) => SpellLevel | undefined
    ): void;
    syncFromStore(): void;
    watchLoadout(): void;
    cleanup(): void;
}

function makePlayer(): PlayerUnderTest {
    const player = Object.create(Player.prototype) as PlayerUnderTest;
    player.scene = {};
    player.x = 0;
    player.y = 0;
    player.subscriptions = [];
    player.slotted = [];
    player.casting = { notifyDisabled: vi.fn(), cleanup: vi.fn() };
    player.scene_events = { off: vi.fn() };
    player.castBar = { cleanup: vi.fn() };
    player.health = { cleanup: vi.fn() };
    player.resource = { cleanup: vi.fn() };
    player.shield = { cleanup: vi.fn() };
    player.boons = { cleanup: vi.fn() };
    return player;
}

const level1 = (): SpellLevel => 1;

beforeEach(() => {
    vi.mocked(createSpell).mockReset();
    vi.mocked(createSpell).mockImplementation((type, opts) => {
        const spell: FakeSpell = {
            type,
            slot: opts.slot,
            hotkey: opts.hotkey,
            level: opts.level ?? 1,
            setLevel: vi.fn(function (this: FakeSpell, level: SpellLevel) {
                this.level = level;
            }),
            destroy: vi.fn(),
            button: { destroy: vi.fn() },
            cooldownTimer: { stop: vi.fn() },
        };
        return spell as unknown as Spell;
    });
});

describe("Player spell loadout", () => {
    it("maps loadout slots to HUD slots and hotkeys, skipping empty slots", () => {
        const player = makePlayer();

        player.syncSpells(["Fireball", null, "Heal", null, null], level1);

        expect(createSpell).toHaveBeenCalledTimes(2);
        expect(player.spells.map((s) => [s.type, s.slot, s.hotkey])).toEqual([
            ["Fireball", 0, "ONE"],
            ["Heal", 2, "THREE"],
        ]);
    });

    it("builds nothing for an empty loadout", () => {
        const player = makePlayer();

        player.syncSpells([null, null, null, null, null], level1);

        expect(createSpell).not.toHaveBeenCalled();
        expect(player.spells).toEqual([]);
    });

    it("passes each spell its learned level and skips unlearned slotted spells", () => {
        const player = makePlayer();
        const learned: Partial<Record<SpellType, SpellLevel>> = { Fireball: 2 };

        player.syncSpells(["Fireball", "Frostbolt"], (t) => learned[t]);

        expect(player.spells.map((s) => [s.type, s.level])).toEqual([["Fireball", 2]]);
    });

    it("a mid-run learn adds only the new spell; others keep their instance", () => {
        const player = makePlayer();
        player.syncSpells(["Fireball", "Frostbolt", null], level1);
        const [fireball, frostbolt] = player.spells;
        vi.mocked(createSpell).mockClear();

        player.syncSpells(["Fireball", "Frostbolt", "ManaShield"], level1);

        expect(createSpell).toHaveBeenCalledTimes(1);
        expect(vi.mocked(createSpell).mock.calls[0][0]).toBe("ManaShield");
        expect(player.spells[0]).toBe(fireball);
        expect(player.spells[1]).toBe(frostbolt);
        expect(fireball.destroy).not.toHaveBeenCalled();
        expect(fireball.cooldownTimer?.stop).not.toHaveBeenCalled();
    });

    it("a level change updates the spell in place", () => {
        const player = makePlayer();
        player.syncSpells(["Fireball"], level1);
        const [fireball] = player.spells;
        vi.mocked(createSpell).mockClear();

        player.syncSpells(["Fireball"], () => 3);

        expect(fireball.setLevel).toHaveBeenCalledWith(3);
        expect(player.spells[0]).toBe(fireball);
        expect(player.spells[0].level).toBe(3);
        expect(createSpell).not.toHaveBeenCalled();
        expect(fireball.destroy).not.toHaveBeenCalled();
    });

    it("a replaced spell is cleaned up and taken out of the cast flow", () => {
        const player = makePlayer();
        player.syncSpells(["Fireball"], level1);
        const [fireball] = player.spells;

        player.syncSpells(["Frostbolt"], level1);

        expect(player.casting.notifyDisabled).toHaveBeenCalledWith(fireball);
        expect(fireball.cooldownTimer?.stop).toHaveBeenCalled();
        expect(fireball.destroy).toHaveBeenCalled();
        expect(fireball.button.destroy).toHaveBeenCalled();
        expect(player.spells.map((s) => s.type)).toEqual(["Frostbolt"]);
    });
});

describe("Player loadout store subscription", () => {
    const seed = (): void => {
        store.dispatch(
            loadGame({
                character: "Occultist",
                learnedSpells: { Fireball: 1 },
                abilityLoadout: ["Fireball", null, null, null, null],
                scrolls: { Fireball: { 2: 1 }, SiphonSoul: { 1: 1 } },
            })
        );
    };
    let player: PlayerUnderTest;

    beforeEach(() => {
        seed();
        player = makePlayer();
        player.syncFromStore();
        player.watchLoadout();
    });

    afterEach(() => player.cleanup());

    it("builds the stored loadout", () => {
        expect(player.spells.map((s) => [s.type, s.slot, s.level])).toEqual([["Fireball", 0, 1]]);
    });

    it("reading a new scroll spawns that spell in the auto-equipped slot", () => {
        const [fireball] = player.spells;

        store.dispatch(readScroll("SiphonSoul", 1));

        expect(player.spells.map((s) => [s.type, s.slot])).toEqual([
            ["Fireball", 0],
            ["SiphonSoul", 1],
        ]);
        expect(player.spells[0]).toBe(fireball);
    });

    it("reading a higher scroll raises the spell's level in place", () => {
        const [fireball] = player.spells;

        store.dispatch(readScroll("Fireball", 2));

        expect(player.spells[0]).toBe(fireball);
        expect(fireball.level).toBe(2);
    });

    it("cleanup releases the subscription", () => {
        player.cleanup();
        expect(player.subscriptions).toEqual([]);

        store.dispatch(readScroll("SiphonSoul", 1));

        expect(player.spells.map((s) => s.type)).toEqual(["Fireball"]);
    });
});
