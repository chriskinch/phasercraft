// RemoteEnemy interpolation/forwarding tests against the real prototype with
// a constructor-free fake (no Phaser boot), per the Phase 2 test convention.

import { describe, it, expect, vi } from "vitest";
import RemoteEnemy from "./RemoteEnemy";

interface RemoteEnemyUnderTest {
    id: string;
    key: string;
    alive: boolean;
    xp: number;
    selected: boolean;
    x: number;
    y: number;
    height: number;
    hp: number;
    maxHp: number;
    input: { enabled: boolean } | null;
    target: { x: number; y: number };
    sprite: {
        play: ReturnType<typeof vi.fn>;
        setTint: ReturnType<typeof vi.fn>;
        active: boolean;
    };
    healthBar: {
        clear: ReturnType<typeof vi.fn>;
        fillStyle: ReturnType<typeof vi.fn>;
        fillRect: ReturnType<typeof vi.fn>;
    };
    selectedRing: { visible: boolean };
    onHit: ReturnType<typeof vi.fn>;
    scene: {
        time: { delayedCall: ReturnType<typeof vi.fn> };
        tweens: { add: ReturnType<typeof vi.fn> };
        events: { emit: ReturnType<typeof vi.fn>; off: ReturnType<typeof vi.fn> };
        enemies: { remove: ReturnType<typeof vi.fn> };
        active_enemies: { remove: ReturnType<typeof vi.fn> };
        selected: unknown;
    };
    setPosition(x: number, y: number): void;
    setDepth: ReturnType<typeof vi.fn>;
    applySnapshot(x: number, y: number, hp: number): void;
    hit(params: { power: number; crit?: boolean }): void;
    die(xp: number): void;
    update(time: number, delta: number): void;
    deselect(): void;
}

const makeRemoteEnemy = (x = 0, y = 0): RemoteEnemyUnderTest => {
    const remote = Object.create(RemoteEnemy.prototype) as RemoteEnemyUnderTest;
    remote.id = "e1";
    remote.key = "baby-ghoul";
    remote.alive = true;
    remote.xp = 0;
    remote.selected = false;
    remote.x = x;
    remote.y = y;
    remote.height = 30;
    remote.hp = 100;
    remote.maxHp = 100;
    remote.input = { enabled: true };
    remote.target = { x, y };
    const setTintMode = vi.fn();
    remote.sprite = {
        play: vi.fn(),
        setTint: vi.fn(() => ({ setTintMode })),
        active: true,
    };
    remote.healthBar = { clear: vi.fn(), fillStyle: vi.fn(), fillRect: vi.fn() };
    remote.selectedRing = { visible: false };
    remote.onHit = vi.fn();
    remote.scene = {
        time: { delayedCall: vi.fn() },
        tweens: { add: vi.fn() },
        events: { emit: vi.fn(), off: vi.fn() },
        enemies: { remove: vi.fn() },
        active_enemies: { remove: vi.fn() },
        selected: null,
    };
    remote.setPosition = (nx: number, ny: number) => {
        remote.x = nx;
        remote.y = ny;
    };
    remote.setDepth = vi.fn();
    return remote;
};

describe("RemoteEnemy.update", () => {
    it("glides toward the snapshot target with the facing walk animation", () => {
        const remote = makeRemoteEnemy(0, 0);
        remote.applySnapshot(100, 0, 100);

        remote.update(0, 50); // half the 100ms lerp window
        expect(remote.x).toBeCloseTo(50);
        expect(remote.sprite.play).toHaveBeenCalledWith("baby-ghoul-right-up", true);

        remote.applySnapshot(-100, 0, 100);
        remote.update(0, 50);
        expect(remote.sprite.play).toHaveBeenCalledWith("baby-ghoul-left-down", true);
    });

    it("snaps across large jumps and idles when arrived", () => {
        const remote = makeRemoteEnemy(0, 0);
        remote.applySnapshot(500, 500, 100);
        remote.update(0, 16);
        expect(remote.x).toBe(500);

        remote.update(0, 16);
        expect(remote.sprite.play).toHaveBeenCalledWith("baby-ghoul-idle", true);
    });

    it("redraws the health bar only when hp changes", () => {
        const remote = makeRemoteEnemy();
        remote.applySnapshot(0, 0, 100); // unchanged hp
        expect(remote.healthBar.clear).not.toHaveBeenCalled();

        remote.applySnapshot(0, 0, 40);
        expect(remote.healthBar.clear).toHaveBeenCalledTimes(1);
    });
});

describe("RemoteEnemy.hit", () => {
    it("forwards damage to the host instead of mutating health", () => {
        const remote = makeRemoteEnemy();
        remote.hit({ power: 25, crit: true });
        expect(remote.onHit).toHaveBeenCalledWith("e1", 25, true);
        expect(remote.hp).toBe(100); // authoritative hp only moves via snapshots
    });

    it("does not forward hits once dead", () => {
        const remote = makeRemoteEnemy();
        remote.die(30);
        remote.hit({ power: 25 });
        expect(remote.onHit).not.toHaveBeenCalled();
    });
});

describe("RemoteEnemy.die", () => {
    it("tears down targeting/groups and records the shared xp, idempotently", () => {
        const remote = makeRemoteEnemy();
        remote.selected = true;
        remote.scene.selected = remote;

        remote.die(30);
        remote.die(30); // second call is a no-op

        expect(remote.alive).toBe(false);
        expect(remote.xp).toBe(30);
        expect(remote.selected).toBe(false);
        expect(remote.scene.selected).toBeNull();
        expect(remote.input?.enabled).toBe(false);
        expect(remote.scene.enemies.remove).toHaveBeenCalledTimes(1);
        expect(remote.scene.active_enemies.remove).toHaveBeenCalledTimes(1);
        expect(remote.sprite.play).toHaveBeenCalledWith("baby-ghoul-death");
        expect(remote.scene.tweens.add).toHaveBeenCalledTimes(1);
    });
});
