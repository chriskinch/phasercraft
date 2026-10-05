import { describe, it, expect, vi, beforeEach } from "vitest";
import Multishot from "./Multishot";
import Projectile from "@entities/Weapons/Projectile";

vi.mock("@entities/Weapons/Projectile", () => ({ default: vi.fn() }));
vi.mock("@services/sfx", () => ({ playSfx: vi.fn(() => true) }));
vi.mock("@store", () => ({
    default: { getState: () => ({ game: { stats: { attack_power: 0 } } }) },
}));

// Regression tests for issue #109. Multishot is a targetKind "none" spell, so
// the CastingController calls castSpell(undefined): the base effect() must be
// a no-op (it used to receive the player and self-damage the caster). Damage
// lands only when each homing arrow hits, once per enemy, and each hit rolls
// its own crit (per-target independent). Tested against the real prototype
// with a constructor-free fake — no Phaser boot — like the other Spell tests.

interface FakeUnit {
    x: number;
    y: number;
    body: {
        position: {
            x: number;
            y: number;
            clone(): { subtract(p: { x: number; y: number }): { x: number; y: number } };
        };
    };
    health: { adjustValue: ReturnType<typeof vi.fn> };
    vector?: { range: number };
}

function makeUnit(x: number, y = 0): FakeUnit {
    const position = {
        x,
        y,
        clone: () => ({
            subtract: (p: { x: number; y: number }) => ({ x: x - p.x, y: y - p.y }),
        }),
    };
    return { x, y, body: { position }, health: { adjustValue: vi.fn() } };
}

interface MultishotUnderTest {
    scene: object;
    player: FakeUnit & {
        isCritical: ReturnType<typeof vi.fn>;
        resource: { adjustValue: ReturnType<typeof vi.fn> };
    };
    typedCost: number;
    type: string;
    range: number;
    cap: number;
    hasAnimation: boolean;
    cooldownDelayAll: boolean;
    cooldownDelay: boolean;
    level: 1 | 2 | 3;
    setCooldown: ReturnType<typeof vi.fn>;
    castSpell(target?: unknown): void;
}

function makeSpell(enemies: FakeUnit[]): MultishotUnderTest {
    const spell = Object.create(Multishot.prototype) as MultishotUnderTest;
    spell.scene = {
        enemies: { getChildren: () => enemies },
        events: { emit: vi.fn() },
    };
    spell.player = Object.assign(makeUnit(0), {
        isCritical: vi.fn(() => false),
        resource: { adjustValue: vi.fn() },
    });
    spell.typedCost = 60;
    // Class-field default the constructor-free fake skips (setValue reads it).
    spell.level = 1;
    spell.type = "physical";
    spell.range = 360;
    spell.cap = 3;
    spell.hasAnimation = true;
    spell.cooldownDelayAll = false;
    spell.cooldownDelay = false;
    spell.setCooldown = vi.fn();
    return spell;
}

function landAllArrows(): void {
    vi.mocked(Projectile).mock.calls.forEach(([config]) => {
        config.onImpact(config.target as never);
    });
}

describe("Multishot cast", () => {
    beforeEach(() => {
        vi.mocked(Projectile).mockClear();
    });

    it("never damages the player", () => {
        const spell = makeSpell([makeUnit(50), makeUnit(100)]);

        spell.castSpell(undefined);
        landAllArrows();

        expect(spell.player.health.adjustValue).not.toHaveBeenCalled();
    });

    it("hits up to cap nearest in-range enemies once each", () => {
        const far = makeUnit(300);
        const near = makeUnit(50);
        const mid = makeUnit(100);
        const midFar = makeUnit(200);
        const outOfRange = makeUnit(500);
        const spell = makeSpell([far, near, outOfRange, mid, midFar]);

        spell.castSpell(undefined);
        expect(Projectile).toHaveBeenCalledTimes(3);
        // Nothing lands until the arrows arrive.
        [near, mid, midFar].forEach((e) => expect(e.health.adjustValue).not.toHaveBeenCalled());

        landAllArrows();

        [near, mid, midFar].forEach((e) => expect(e.health.adjustValue).toHaveBeenCalledTimes(1));
        expect(far.health.adjustValue).not.toHaveBeenCalled();
        expect(outOfRange.health.adjustValue).not.toHaveBeenCalled();
    });

    it("rolls crit independently per target, once each", () => {
        const a = makeUnit(50);
        const b = makeUnit(100);
        const c = makeUnit(150);
        const spell = makeSpell([a, b, c]);
        spell.player.isCritical
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);

        spell.castSpell(undefined);
        // No roll at cast time — each arrow rolls when it lands.
        expect(spell.player.isCritical).not.toHaveBeenCalled();
        landAllArrows();

        expect(spell.player.isCritical).toHaveBeenCalledTimes(3);
        expect(a.health.adjustValue).toHaveBeenCalledWith(-45, "physical", true);
        expect(b.health.adjustValue).toHaveBeenCalledWith(-30, "physical", false);
        expect(c.health.adjustValue).toHaveBeenCalledWith(-45, "physical", true);
    });
});
