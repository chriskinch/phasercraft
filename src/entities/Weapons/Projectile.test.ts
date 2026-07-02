import { describe, it, expect, vi } from "vitest";
import Projectile from "./Projectile";
import type { ProjectileTarget } from "./Projectile";

// The homing step (tick) is pure movement logic, exercised against the real
// prototype with a constructor-free fake per the project's test convention.

interface ProjectileUnderTest {
    x: number;
    y: number;
    speed: number;
    homingTarget: ProjectileTarget;
    onImpact: ReturnType<typeof vi.fn>;
    lastKnown: { x: number; y: number };
    destroy: ReturnType<typeof vi.fn>;
    setRotation: ReturnType<typeof vi.fn>;
    setDepth: ReturnType<typeof vi.fn>;
    tick(delta: number): void;
}

function makeProjectile(target: ProjectileTarget, speed = 100): ProjectileUnderTest {
    const projectile = Object.create(Projectile.prototype) as ProjectileUnderTest;
    projectile.x = 0;
    projectile.y = 0;
    projectile.speed = speed;
    projectile.homingTarget = target;
    projectile.onImpact = vi.fn();
    projectile.lastKnown = { x: target.x, y: target.y };
    projectile.destroy = vi.fn();
    projectile.setRotation = vi.fn();
    projectile.setDepth = vi.fn();
    return projectile;
}

describe("Projectile.tick", () => {
    it("moves toward the target by speed * delta", () => {
        const projectile = makeProjectile({ x: 1000, y: 0, alive: true }, 100);

        projectile.tick(500); // 0.5s at 100px/s → 50px

        expect(projectile.x).toBeCloseTo(50);
        expect(projectile.y).toBeCloseTo(0);
        expect(projectile.onImpact).not.toHaveBeenCalled();
        expect(projectile.destroy).not.toHaveBeenCalled();
    });

    it("homes: follows the target's current position", () => {
        const target = { x: 100, y: 0, alive: true };
        const projectile = makeProjectile(target, 100);

        projectile.tick(100);
        target.y = 100; // target moves
        projectile.tick(100);

        expect(projectile.lastKnown).toEqual({ x: 100, y: 100 });
        expect(projectile.y).toBeGreaterThan(0);
    });

    it("applies the impact and destroys itself on arrival", () => {
        const target = { x: 30, y: 40, alive: true }; // 50px away
        const projectile = makeProjectile(target, 100);

        projectile.tick(600); // step 60px ≥ 50px distance

        expect(projectile.onImpact).toHaveBeenCalledWith(target);
        expect(projectile.destroy).toHaveBeenCalled();
    });

    it("flies to the last known position without impact when the target died", () => {
        const target = { x: 30, y: 40, alive: true };
        const projectile = makeProjectile(target, 100);

        target.alive = false;
        target.x = 500; // corpse moved/knocked — must not retarget
        projectile.tick(600);

        expect(projectile.lastKnown).toEqual({ x: 30, y: 40 });
        expect(projectile.onImpact).not.toHaveBeenCalled();
        expect(projectile.destroy).toHaveBeenCalled();
    });
});
