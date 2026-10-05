import { describe, it, expect, vi } from "vitest";
import { Math as PhaserMath, Physics, Scenes } from "phaser";
import CombatText from "./CombatText";

// Constructor-free fake at the entity seam (CLAUDE.md lifecycle tests).
function makeText(velocity: { x: number; y: number }, gravity: number) {
    const text = Object.create(CombatText.prototype) as CombatText;
    const world = { off: vi.fn() };
    const events = { off: vi.fn() };
    Object.assign(text, {
        x: 0,
        y: 0,
        velocity: { ...velocity },
        gravity,
        world,
        scene: { events },
    });
    return { text, world, events };
}

// Runs Phaser's own Body.update / World.computeVelocity on a body with the
// settings CombatText used to give its Arcade body (no drag, acceleration or
// world gravity; the game config sets gravity 0). Body.postUpdate then added
// each step's position change to the game object, so position is the result.
function arcadeReference(vx: number, vy: number, gravity: number, steps: number, dt: number) {
    const world = { gravity: new PhaserMath.Vector2(0, 0) };
    const body = {
        moves: true,
        directControl: false,
        allowRotation: false,
        allowGravity: true,
        allowDrag: true,
        useDamping: false,
        collideWorldBounds: false,
        prev: new PhaserMath.Vector2(),
        position: new PhaserMath.Vector2(),
        velocity: new PhaserMath.Vector2(vx, vy),
        newVelocity: new PhaserMath.Vector2(),
        acceleration: new PhaserMath.Vector2(),
        drag: new PhaserMath.Vector2(),
        gravity: new PhaserMath.Vector2(0, gravity),
        maxVelocity: new PhaserMath.Vector2(10000, 10000),
        maxSpeed: -1,
        speed: 0,
        world: {
            updateMotion: (b: Physics.Arcade.Body, d: number) =>
                Physics.Arcade.World.prototype.computeVelocity.call(
                    world as unknown as Physics.Arcade.World,
                    b,
                    d
                ),
        },
        updateCenter: () => {},
    };
    for (let i = 0; i < steps; i++)
        Physics.Arcade.Body.prototype.update.call(body as unknown as Physics.Arcade.Body, dt);
    return { x: body.position.x, y: body.position.y };
}

describe("CombatText.step", () => {
    const dt = 1 / 60;

    it.each([
        ["damage", { x: 37.2, y: -60 }, 200, 45],
        ["crit, full wander", { x: -60, y: -60 }, 200, 45],
        ["level up", { x: 0, y: -50 }, 50, 135],
    ])("matches the Arcade body trajectory step for step (%s)", (_, v, g, steps) => {
        const { text } = makeText(v, g);
        const expected = arcadeReference(v.x, v.y, g, steps, dt);

        for (let i = 0; i < steps; i++) text.step(dt);

        expect(Math.abs(text.x - expected.x)).toBeLessThan(1e-9);
        expect(Math.abs(text.y - expected.y)).toBeLessThan(1e-9);
    });

    it("does not move between world steps", () => {
        const { text } = makeText({ x: 10, y: -60 }, 200);
        expect([text.x, text.y]).toEqual([0, 0]);
    });
});

describe("CombatText.cleanup", () => {
    it("releases the world step and shutdown listeners, once", () => {
        const { text, world, events } = makeText({ x: 0, y: 0 }, 0);

        text.cleanup();
        text.cleanup();

        expect(world.off).toHaveBeenCalledTimes(1);
        expect(world.off).toHaveBeenCalledWith(Physics.Arcade.Events.WORLD_STEP, text.step, text);
        expect(events.off).toHaveBeenCalledWith(Scenes.Events.SHUTDOWN, text.cleanup, text);
    });
});
