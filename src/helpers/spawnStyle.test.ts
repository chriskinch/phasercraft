import { describe, it, expect, vi } from "vitest";
import { Events, GameObjects, Scenes } from "phaser";
import { dropIn } from "./spawnStyle";

// dropIn registers an "update" listener on the scene's emitter until the item
// settles. A Snare Trap laid just before leaving a biome (travel / game over)
// is destroyed mid-bounce; the listener used to survive on the reused scene
// emitter and read the destroyed item's body on the next visit, throwing out
// of Systems.step and freezing the game loop.

interface FakeBody {
    touching: { down: boolean };
    wasTouching: { down: boolean };
    immovable: boolean;
    setFriction: ReturnType<typeof vi.fn>;
    setDrag: ReturnType<typeof vi.fn>;
    setGravityY: ReturnType<typeof vi.fn>;
    setBounce: ReturnType<typeof vi.fn>;
    setVelocity: ReturnType<typeof vi.fn>;
}

function makeBody(): FakeBody {
    const body = {
        touching: { down: false },
        wasTouching: { down: false },
        immovable: false,
    } as FakeBody;
    body.setFriction = vi.fn(() => body);
    body.setDrag = vi.fn(() => body);
    body.setGravityY = vi.fn(() => body);
    body.setBounce = vi.fn(() => body);
    body.setVelocity = vi.fn(() => body);
    return body;
}

function setup() {
    const sceneEvents = new Events.EventEmitter();
    const spawnStop = { destroy: vi.fn() };
    const item = new Events.EventEmitter() as Events.EventEmitter & {
        scene?: object;
        body?: FakeBody;
        x: number;
        y: number;
        spawned?: boolean;
    };
    item.x = 0;
    item.y = 0;
    item.body = makeBody();
    item.scene = {
        events: sceneEvents,
        physics: { add: { staticImage: vi.fn(() => spawnStop), collider: vi.fn() } },
    };
    dropIn("trap", item as unknown as Parameters<typeof dropIn>[1], 20, {});
    // Mirrors GameObject.destroy(): emit DESTROY, then clear scene and body.
    const destroy = () => {
        item.emit(GameObjects.Events.DESTROY, item, false);
        item.removeAllListeners();
        item.scene = undefined;
        item.body = undefined;
    };
    return { sceneEvents, spawnStop, item, destroy };
}

describe("dropIn", () => {
    it("settles: marks spawned, emits <name>:spawned and stops listening", () => {
        const { sceneEvents, spawnStop, item } = setup();
        const onSpawned = vi.fn();
        item.on("trap:spawned", onSpawned);

        item.body!.touching.down = true;
        item.body!.wasTouching.down = true;
        sceneEvents.emit("update");

        expect(item.spawned).toBe(true);
        expect(onSpawned).toHaveBeenCalledTimes(1);
        expect(spawnStop.destroy).toHaveBeenCalled();
        expect(sceneEvents.listenerCount("update")).toBe(0);
    });

    it("does not throw on the next scene update after the item is destroyed mid-drop", () => {
        const { sceneEvents, destroy } = setup();

        destroy();

        expect(() => sceneEvents.emit("update")).not.toThrow();
        expect(sceneEvents.listenerCount("update")).toBe(0);
    });

    it("releases the update listener on scene SHUTDOWN", () => {
        const { sceneEvents, item } = setup();

        sceneEvents.emit(Scenes.Events.SHUTDOWN);
        item.body = undefined;

        expect(() => sceneEvents.emit("update")).not.toThrow();
        expect(sceneEvents.listenerCount("update")).toBe(0);
    });
});
