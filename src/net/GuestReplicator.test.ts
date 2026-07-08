// GuestReplicator tests at the entity seam: fake scene emitter, fake session,
// mocked RemoteEnemy/RemoteLoot, mocked store — no Phaser boot.

import { describe, it, expect, vi, beforeEach } from "vitest";
import GuestReplicator from "./GuestReplicator";
import type { CoopSession } from "./CoopSession";
import type { CoopMessage } from "./protocol";

const dispatch = vi.fn();
vi.mock("@store", () => ({
    default: {
        dispatch: (action: unknown) => dispatch(action),
        getState: () => ({ game: {} }),
        subscribe: () => () => {},
    },
}));

const remoteEnemies: Array<{
    options: Record<string, unknown>;
    applySnapshot: ReturnType<typeof vi.fn>;
    die: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    xp: number;
}> = [];
vi.mock("@entities/Enemy/RemoteEnemy", () => ({
    default: class FakeRemoteEnemy {
        applySnapshot = vi.fn();
        die = vi.fn();
        destroy = vi.fn();
        xp = 0;
        constructor(options: Record<string, unknown>) {
            remoteEnemies.push({
                options,
                applySnapshot: this.applySnapshot,
                die: this.die,
                destroy: this.destroy,
                xp: this.xp,
            });
        }
    },
}));

const remoteLoot: Array<{
    options: Record<string, unknown>;
    resolve: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    kind: string;
}> = [];
vi.mock("@entities/Loot/RemoteLoot", () => ({
    default: class FakeRemoteLoot {
        resolve = vi.fn();
        destroy = vi.fn();
        kind: string;
        constructor(options: Record<string, unknown>) {
            this.kind = options.kind as string;
            remoteLoot.push({
                options,
                resolve: this.resolve,
                destroy: this.destroy,
                kind: this.kind,
            });
        }
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
    received: Array<{ event: string; args: unknown[] }> = [];
}

const makeSession = () => {
    let connected = true;
    let messageListener: ((m: CoopMessage) => void) | null = null;
    let stateListener: (() => void) | null = null;
    const sent: CoopMessage[] = [];
    const session = {
        onMessage(fn: (m: CoopMessage) => void) {
            messageListener = fn;
            return () => (messageListener = null);
        },
        subscribe(fn: () => void) {
            stateListener = fn;
            return () => (stateListener = null);
        },
        isConnected: () => connected,
        send: (m: CoopMessage) => {
            sent.push(m);
            return true;
        },
    } as unknown as CoopSession;
    return {
        session,
        sent,
        push: (m: CoopMessage) => messageListener?.(m),
        drop: () => {
            connected = false;
            stateListener?.();
        },
    };
};

const makeHarness = () => {
    const events = new FakeEmitter();
    const player = { death: vi.fn(), down: vi.fn(), revive: vi.fn() };
    const scene = {
        events,
        enemies: { add: vi.fn() },
        active_enemies: { add: vi.fn() },
        player,
    };
    const { session, sent, push, drop } = makeSession();
    const onGameOver = vi.fn();
    const onSessionLost = vi.fn();
    const replicator = new GuestReplicator({
        scene: scene as never,
        onGameOver,
        onSessionLost,
        session,
    });
    return { events, player, scene, sent, push, drop, onGameOver, onSessionLost, replicator };
};

const snapshot = (id: string, x = 1, y = 2) => ({
    id,
    key: "baby-ghoul",
    x,
    y,
    hp: 50,
    max: 100,
});

beforeEach(() => {
    remoteEnemies.length = 0;
    remoteLoot.length = 0;
    dispatch.mockClear();
});

describe("GuestReplicator", () => {
    it("spawns replicated enemies into the scene groups and re-targets them", () => {
        const h = makeHarness();

        h.push({ t: "enemies", list: [snapshot("e1")] });
        expect(remoteEnemies).toHaveLength(1);
        expect(h.scene.enemies.add).toHaveBeenCalledTimes(1);
        expect(h.scene.active_enemies.add).toHaveBeenCalledTimes(1);

        h.push({ t: "enemies", list: [snapshot("e1", 30, 40)] });
        expect(remoteEnemies).toHaveLength(1);
        expect(remoteEnemies[0].applySnapshot).toHaveBeenCalledWith(30, 40, 50);
    });

    it("silently removes enemies the host no longer reports", () => {
        const h = makeHarness();
        h.push({ t: "enemies", list: [snapshot("e1"), snapshot("e2")] });
        h.push({ t: "enemies", list: [snapshot("e2")] });
        expect(remoteEnemies[0].destroy).toHaveBeenCalled();
        expect(remoteEnemies[1].destroy).not.toHaveBeenCalled();
    });

    it("plays deaths and forwards the shared xp through the enemy:dead seam", () => {
        const h = makeHarness();
        const seen: unknown[] = [];
        h.events.on("enemy:dead", (enemy) => seen.push(enemy));

        h.push({ t: "enemies", list: [snapshot("e1")] });
        h.push({ t: "enemyDead", id: "e1", xp: 77 });

        expect(remoteEnemies[0].die).toHaveBeenCalledWith(77);
        expect(seen).toHaveLength(1);
    });

    it("forwards local damage on replicated enemies to the host", () => {
        const h = makeHarness();
        h.push({ t: "enemies", list: [snapshot("e1")] });
        const onHit = remoteEnemies[0].options.onHit as (
            id: string,
            power: number,
            crit: boolean
        ) => void;
        onHit("e1", 25, true);
        expect(h.sent).toContainEqual({ t: "hit", id: "e1", power: 25, crit: true });
    });

    it("mirrors loot and forwards pickup intents", () => {
        const h = makeHarness();
        h.push({ t: "loot", loot: { id: "l1", kind: "coin", x: 3, y: 4 } });
        expect(remoteLoot).toHaveLength(1);

        const onTake = remoteLoot[0].options.onTake as (id: string) => void;
        onTake("l1");
        expect(h.sent).toContainEqual({ t: "lootTake", id: "l1" });
    });

    it("credits confirmed crafting grabs but never credits coins from lootGone", () => {
        const h = makeHarness();
        h.push({ t: "loot", loot: { id: "l1", kind: "bone", x: 0, y: 0 } });
        h.push({ t: "loot", loot: { id: "l2", kind: "coin", x: 0, y: 0 } });

        h.push({ t: "lootGone", id: "l1", by: "guest" });
        h.push({ t: "lootGone", id: "l2", by: "guest" });

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(remoteLoot[0].resolve).toHaveBeenCalled();
        expect(remoteLoot[1].resolve).toHaveBeenCalled();
    });

    it("applies coin credits and wave sync to the store", () => {
        const h = makeHarness();
        h.push({ t: "coins", value: 5 });
        h.push({ t: "wave", n: 7 });
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "ADD_COIN" }));
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "SET_WAVE" }));
    });

    it("routes relayed enemy hits through the local enemy:attack seam", () => {
        const h = makeHarness();
        const hits: unknown[] = [];
        h.events.on("enemy:attack", (power) => hits.push(power));

        h.push({ t: "peerHit", power: 33 });
        expect(hits).toEqual([33]);

        // While downed, no further damage lands.
        h.events.emit("player:dead");
        h.push({ t: "peerHit", power: 10 });
        expect(hits).toEqual([33]);
    });

    it("downs on local death, revives on waveDone, defers game over to the host", () => {
        const h = makeHarness();

        h.events.emit("player:dead");
        expect(h.player.down).toHaveBeenCalled();
        expect(h.player.death).not.toHaveBeenCalled();
        expect(h.sent).toContainEqual({ t: "down" });

        h.push({ t: "waveDone" });
        expect(h.player.revive).toHaveBeenCalled();

        h.push({ t: "gameOver" });
        expect(h.onGameOver).toHaveBeenCalled();
    });

    it("clears the replicated world and bails out when the session drops", () => {
        const h = makeHarness();
        h.push({ t: "enemies", list: [snapshot("e1")] });
        h.push({ t: "loot", loot: { id: "l1", kind: "coin", x: 0, y: 0 } });

        h.drop();

        expect(remoteEnemies[0].destroy).toHaveBeenCalled();
        expect(remoteLoot[0].destroy).toHaveBeenCalled();
        expect(h.onSessionLost).toHaveBeenCalledTimes(1);

        // Idempotent: nothing further happens on a second cleanup.
        h.replicator.cleanup();
        expect(h.onSessionLost).toHaveBeenCalledTimes(1);
    });
});
