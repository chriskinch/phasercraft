// HostReplicator tests at the entity seam: fake scene emitter, fake session,
// fake enemies/loot/player — no Phaser boot, no real store subscription.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { Scenes } from "phaser";
import HostReplicator from "./HostReplicator";
import type { CoopSession } from "./CoopSession";
import type { CoopMessage } from "./protocol";
import type CoopPresence from "./CoopPresence";

// Deterministic wave feed instead of the real RxJS store subscription.
let waveCallback: ((wave: unknown) => void) | null = null;
vi.mock("@helpers/mapStateToData", () => ({
    default: (path: string, fn: (data: unknown) => void) => {
        waveCallback = fn;
        fn(1); // init:true behavior — fires with the current wave
        return () => {
            waveCallback = null;
        };
    },
}));

class FakeEmitter {
    private handlers = new Map<string, Array<{ fn: (...args: unknown[]) => void; ctx: unknown }>>();
    on(event: string, fn: (...args: unknown[]) => void, ctx?: unknown): void {
        const list = this.handlers.get(event) ?? [];
        list.push({ fn, ctx });
        this.handlers.set(event, list);
    }
    once(event: string, fn: (...args: unknown[]) => void, ctx?: unknown): void {
        this.on(event, fn, ctx);
    }
    off(event: string, fn?: (...args: unknown[]) => void, ctx?: unknown): void {
        const list = this.handlers.get(event) ?? [];
        this.handlers.set(
            event,
            list.filter((h) => (fn ? h.fn !== fn : false) || (ctx ? h.ctx !== ctx : false))
        );
    }
    emit(event: string, ...args: unknown[]): void {
        for (const { fn, ctx } of [...(this.handlers.get(event) ?? [])]) fn.call(ctx, ...args);
    }
}

const makeSession = () => {
    let messageListener: ((m: CoopMessage) => void) | null = null;
    const sent: CoopMessage[] = [];
    const session = {
        onMessage(fn: (m: CoopMessage) => void) {
            messageListener = fn;
            return () => (messageListener = null);
        },
        subscribe: () => () => {},
        isConnected: () => true,
        send: (m: CoopMessage) => {
            sent.push(m);
            return true;
        },
    } as unknown as CoopSession;
    return { session, sent, push: (m: CoopMessage) => messageListener?.(m) };
};

interface FakeEnemy {
    uuid: string;
    key: string;
    x: number;
    y: number;
    alive: boolean;
    xp: number;
    health: { getValue: () => number };
    stats: { health_max: number };
    hit: ReturnType<typeof vi.fn>;
}

const makeEnemy = (uuid: string, alive = true): FakeEnemy => ({
    uuid,
    key: "baby-ghoul",
    x: 10,
    y: 20,
    alive,
    xp: 30,
    health: { getValue: () => 55 },
    stats: { health_max: 100 },
    hit: vi.fn(),
});

// Minimal loot drop double matching the Coin/Gem/Crafting event surface.
const makeDrop = (x = 1, y = 2) => {
    const emitter = new FakeEmitter();
    const drop = {
        x,
        y,
        emit: (event: string, ...args: unknown[]) => {
            emitter.emit(event, ...args);
            return true;
        },
        once: (event: string, fn: (...args: never[]) => void, ctx?: unknown) =>
            emitter.once(event, fn as (...args: unknown[]) => void, ctx),
        destroy: vi.fn(() => emitter.emit("destroy")),
    };
    return drop;
};

const makeHarness = (opts: { hasRemote?: boolean } = {}) => {
    const events = new FakeEmitter();
    const enemies: FakeEnemy[] = [];
    const player = {
        alive: true,
        death: vi.fn(),
        down: vi.fn(),
        revive: vi.fn(),
    };
    const scene = {
        events,
        enemies: { getChildren: () => enemies },
        player,
    };
    const remote = { x: 0, y: 0 };
    const presence = {
        hasRemotePlayer: () => opts.hasRemote ?? true,
        getRemotePlayer: () => ((opts.hasRemote ?? true) ? remote : null),
    } as unknown as CoopPresence;
    const { session, sent, push } = makeSession();
    const onGameOver = vi.fn();
    const replicator = new HostReplicator({
        scene: scene as never,
        presence,
        onGameOver,
        session,
    });
    // Drop the construction-time wave message for cleaner assertions.
    sent.length = 0;
    return { events, enemies, player, scene, sent, push, onGameOver, replicator, remote };
};

beforeEach(() => {
    waveCallback = null;
});

describe("HostReplicator", () => {
    it("streams live-enemy snapshots at the send cadence", () => {
        const h = makeHarness();
        h.enemies.push(makeEnemy("e1"), makeEnemy("e2", false));

        for (let i = 0; i < 7; i++) h.events.emit(Scenes.Events.UPDATE, 0, 16);

        const snapshots = h.sent.filter((m) => m.t === "enemies");
        expect(snapshots).toHaveLength(1);
        expect(snapshots[0]).toEqual({
            t: "enemies",
            list: [{ id: "e1", key: "baby-ghoul", x: 10, y: 20, hp: 55, max: 100 }],
        });
    });

    it("applies validated guest hits to the matching live enemy", () => {
        const h = makeHarness();
        const enemy = makeEnemy("e1");
        h.enemies.push(enemy);

        h.push({ t: "hit", id: "e1", power: 12, crit: true });
        expect(enemy.hit).toHaveBeenCalledWith({ power: 12, crit: true });

        h.push({ t: "hit", id: "missing", power: 5, crit: false });
        expect(enemy.hit).toHaveBeenCalledTimes(1);
    });

    it("mirrors loot drops and pays coin pickups out to both players", () => {
        const h = makeHarness();
        const drop = makeDrop(5, 6);
        h.events.emit("loot:spawned", drop, "gem");

        const lootMsg = h.sent.find((m) => m.t === "loot");
        expect(lootMsg).toMatchObject({ t: "loot", loot: { kind: "gem", x: 5, y: 6 } });
        const id = (lootMsg as { loot: { id: string } }).loot.id;

        // Guest takes the gem: the host funnels it through the normal collect
        // path (credits the host store) and credits the guest over the wire.
        h.push({ t: "lootTake", id });
        expect(h.sent.find((m) => m.t === "coins")).toEqual({ t: "coins", value: 5 });

        drop.destroy();
        expect(h.sent.find((m) => m.t === "lootGone")).toEqual({ t: "lootGone", id, by: "host" });
    });

    it("grants crafting loot exclusively to the guest that took it", () => {
        const h = makeHarness();
        const drop = makeDrop();
        h.events.emit("loot:spawned", drop, "bone");
        const id = (h.sent.find((m) => m.t === "loot") as { loot: { id: string } }).loot.id;

        h.push({ t: "lootTake", id });

        expect(drop.destroy).toHaveBeenCalled();
        expect(h.sent.find((m) => m.t === "coins")).toBeUndefined();
        expect(h.sent.find((m) => m.t === "lootGone")).toEqual({ t: "lootGone", id, by: "guest" });
    });

    it("broadcasts enemy deaths with the shared xp", () => {
        const h = makeHarness();
        h.events.emit("enemy:dead", makeEnemy("e9"));
        expect(h.sent).toContainEqual({ t: "enemyDead", id: "e9", xp: 30 });
    });

    it("relays enemy hits on the partner's avatar", () => {
        const h = makeHarness();
        h.events.emit("enemy:attack:peer", 42);
        expect(h.sent).toContainEqual({ t: "peerHit", power: 42 });
    });

    it("downs the local player while the partner lives, ends the run when both are dead", () => {
        const h = makeHarness();

        h.events.emit("player:dead");
        expect(h.player.down).toHaveBeenCalled();
        expect(h.sent).toContainEqual({ t: "down" });
        expect(h.onGameOver).not.toHaveBeenCalled();

        // Now the guest goes down too — host declares game over.
        h.push({ t: "down" });
        expect(h.sent).toContainEqual({ t: "gameOver" });
        expect(h.onGameOver).toHaveBeenCalled();
    });

    it("ends the run immediately when dying with the partner already down", () => {
        const h = makeHarness();
        h.push({ t: "down" });
        h.events.emit("player:dead");
        expect(h.player.down).not.toHaveBeenCalled();
        expect(h.onGameOver).toHaveBeenCalled();
    });

    it("sends waveDone once per cleared wave and revives the downed", () => {
        const h = makeHarness();
        h.events.emit("player:dead"); // downed, partner alive

        h.events.emit("enemies:dead");
        h.events.emit("enemies:dead"); // GameScene re-emits every empty frame

        expect(h.sent.filter((m) => m.t === "waveDone")).toHaveLength(1);
        expect(h.player.revive).toHaveBeenCalledTimes(1);

        // The wave advance re-arms the edge trigger.
        waveCallback?.(2);
        h.events.emit("enemies:dead");
        expect(h.sent.filter((m) => m.t === "waveDone")).toHaveLength(2);
    });

    it("cleanup clears the guest's world and detaches everything, idempotently", () => {
        const h = makeHarness();
        h.replicator.cleanup();
        h.replicator.cleanup();

        expect(h.sent.filter((m) => m.t === "enemies")).toEqual([{ t: "enemies", list: [] }]);
        expect((h.scene as { coopTarget?: unknown }).coopTarget).toBeUndefined();

        h.sent.length = 0;
        h.events.emit("enemy:dead", makeEnemy("e1"));
        for (let i = 0; i < 10; i++) h.events.emit(Scenes.Events.UPDATE, 0, 20);
        expect(h.sent).toHaveLength(0);
    });

    it("exposes the partner's avatar to enemies only while they are up", () => {
        const h = makeHarness();
        const coopTarget = (h.scene as { coopTarget?: () => unknown }).coopTarget;
        expect(coopTarget?.()).toBe(h.remote);

        h.push({ t: "down" });
        expect(coopTarget?.()).toBeNull();
    });
});
