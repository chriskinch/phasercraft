// CoopPresence lifecycle + replication tests at the entity seam (per the
// Phase 2 convention): a fake scene event emitter, a fake session, and a
// mocked RemotePlayer — no Phaser boot.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { Scenes } from "phaser";
import CoopPresence from "./CoopPresence";
import type { CoopSession, CoopState } from "./CoopSession";
import type { CoopMessage } from "./protocol";

const remoteInstances: Array<{
    options: Record<string, unknown>;
    setTargetPosition: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
}> = [];

vi.mock("@entities/Player/RemotePlayer", () => ({
    default: class FakeRemotePlayer {
        setTargetPosition = vi.fn();
        update = vi.fn();
        destroy = vi.fn();
        constructor(options: Record<string, unknown>) {
            remoteInstances.push({
                options,
                setTargetPosition: this.setTargetPosition,
                update: this.update,
                destroy: this.destroy,
            });
        }
    },
}));

// Minimal event emitter matching the Phaser scene.events surface we use.
class FakeEmitter {
    private handlers = new Map<string, Array<{ fn: (...args: number[]) => void; ctx: unknown }>>();

    on(event: string, fn: (...args: number[]) => void, ctx?: unknown): void {
        const list = this.handlers.get(event) ?? [];
        list.push({ fn, ctx });
        this.handlers.set(event, list);
    }
    once(event: string, fn: (...args: number[]) => void, ctx?: unknown): void {
        this.on(event, fn, ctx);
    }
    off(event: string, fn?: (...args: number[]) => void, ctx?: unknown): void {
        const list = this.handlers.get(event) ?? [];
        this.handlers.set(
            event,
            list.filter((h) => (fn ? h.fn !== fn : false) || (ctx ? h.ctx !== ctx : false))
        );
    }
    emit(event: string, ...args: number[]): void {
        for (const { fn, ctx } of this.handlers.get(event) ?? []) fn.call(ctx, ...args);
    }
    count(event: string): number {
        return (this.handlers.get(event) ?? []).length;
    }
}

interface FakeSessionControls {
    session: CoopSession;
    pushMessage(message: CoopMessage): void;
    setConnected(connected: boolean): void;
    sent: CoopMessage[];
    messageUnsubscribed: () => boolean;
    stateUnsubscribed: () => boolean;
}

const makeFakeSession = (peerCharacter = "Mage"): FakeSessionControls => {
    let connected = true;
    let messageListener: ((m: CoopMessage) => void) | null = null;
    let stateListener: (() => void) | null = null;
    let messageUnsubbed = false;
    let stateUnsubbed = false;
    const sent: CoopMessage[] = [];

    const session = {
        onMessage(fn: (m: CoopMessage) => void) {
            messageListener = fn;
            return () => {
                messageUnsubbed = true;
                messageListener = null;
            };
        },
        subscribe(fn: () => void) {
            stateListener = fn;
            return () => {
                stateUnsubbed = true;
                stateListener = null;
            };
        },
        getState: (): Partial<CoopState> => ({
            status: connected ? "connected" : "idle",
            peerCharacter: peerCharacter as CoopState["peerCharacter"],
        }),
        isConnected: () => connected,
        send: (message: CoopMessage) => {
            sent.push(message);
            return true;
        },
    } as unknown as CoopSession;

    return {
        session,
        pushMessage: (m) => messageListener?.(m),
        setConnected: (value) => {
            connected = value;
            stateListener?.();
        },
        sent,
        messageUnsubscribed: () => messageUnsubbed,
        stateUnsubscribed: () => stateUnsubbed,
    };
};

const makeScene = () => ({ events: new FakeEmitter() });

beforeEach(() => {
    remoteInstances.length = 0;
});

describe("CoopPresence", () => {
    it("spawns the remote avatar from a matching-area snapshot and feeds it targets", () => {
        const fake = makeFakeSession("Ranger");
        const scene = makeScene();
        const presence = new CoopPresence(scene as never, { x: 0, y: 0 }, "town", fake.session);

        fake.pushMessage({ t: "state", x: 50, y: 60, area: "town" });
        expect(presence.hasRemotePlayer()).toBe(true);
        expect(remoteInstances).toHaveLength(1);
        expect(remoteInstances[0].options).toMatchObject({ x: 50, y: 60, character: "Ranger" });

        // Subsequent snapshots re-target the same avatar.
        fake.pushMessage({ t: "state", x: 70, y: 80, area: "town" });
        expect(remoteInstances).toHaveLength(1);
        expect(remoteInstances[0].setTargetPosition).toHaveBeenCalledWith(70, 80);
    });

    it("despawns the avatar when the partner moves to a different area", () => {
        const fake = makeFakeSession();
        const presence = new CoopPresence(
            makeScene() as never,
            { x: 0, y: 0 },
            "town",
            fake.session
        );

        fake.pushMessage({ t: "state", x: 1, y: 2, area: "town" });
        fake.pushMessage({ t: "state", x: 1, y: 2, area: "dungeon" });

        expect(presence.hasRemotePlayer()).toBe(false);
        expect(remoteInstances[0].destroy).toHaveBeenCalled();
    });

    it("streams the local player's position at the send cadence, not every frame", () => {
        const fake = makeFakeSession();
        const scene = makeScene();
        const player = { x: 10, y: 20 };
        new CoopPresence(scene as never, player, "town", fake.session);

        // 4 frames × 16ms — under the 100ms send interval.
        for (let i = 0; i < 4; i++) scene.events.emit(Scenes.Events.UPDATE, 0, 16);
        expect(fake.sent).toHaveLength(0);

        // Crossing the interval sends exactly one snapshot.
        for (let i = 0; i < 3; i++) scene.events.emit(Scenes.Events.UPDATE, 0, 16);
        expect(fake.sent).toEqual([{ t: "state", x: 10, y: 20, area: "town" }]);
    });

    it("sends nothing while the session is not connected", () => {
        const fake = makeFakeSession();
        fake.setConnected(false);
        const scene = makeScene();
        new CoopPresence(scene as never, { x: 0, y: 0 }, "town", fake.session);

        scene.events.emit(Scenes.Events.UPDATE, 0, 500);
        expect(fake.sent).toHaveLength(0);
    });

    it("despawns the avatar when the session drops", () => {
        const fake = makeFakeSession();
        const presence = new CoopPresence(
            makeScene() as never,
            { x: 0, y: 0 },
            "town",
            fake.session
        );
        fake.pushMessage({ t: "state", x: 1, y: 2, area: "town" });
        expect(presence.hasRemotePlayer()).toBe(true);

        fake.setConnected(false);
        expect(presence.hasRemotePlayer()).toBe(false);
    });

    it("cleanup releases scene listeners, session subscriptions, and the avatar — idempotently", () => {
        const fake = makeFakeSession();
        const scene = makeScene();
        const presence = new CoopPresence(scene as never, { x: 0, y: 0 }, "town", fake.session);
        fake.pushMessage({ t: "state", x: 1, y: 2, area: "town" });

        presence.cleanup();
        presence.cleanup(); // second call must be a no-op

        expect(scene.events.count(Scenes.Events.UPDATE)).toBe(0);
        expect(fake.messageUnsubscribed()).toBe(true);
        expect(fake.stateUnsubscribed()).toBe(true);
        expect(remoteInstances[0].destroy).toHaveBeenCalledTimes(1);
        expect(presence.hasRemotePlayer()).toBe(false);
    });

    it("cleans itself up on scene SHUTDOWN", () => {
        const fake = makeFakeSession();
        const scene = makeScene();
        new CoopPresence(scene as never, { x: 0, y: 0 }, "town", fake.session);

        scene.events.emit(Scenes.Events.SHUTDOWN);

        expect(scene.events.count(Scenes.Events.UPDATE)).toBe(0);
        expect(fake.messageUnsubscribed()).toBe(true);
    });
});
