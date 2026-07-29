import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TownScene from "./TownScene";
import { BIOMES } from "./biomes/biomes";
import store from "@store";

// Lifecycle/race coverage for the travel-request bridge added alongside the
// biome picker (highest-risk part of that change): the store subscription
// must be released in shutdown() (idempotently), and onTravelRequest must
// clear the request before handing off to BiomeScene so a stale or
// in-flight request cannot fire twice or leak into the next scene.
//
// Mocking at the entity seam per the Phase 2 convention: a constructor-free
// fake built on the real prototype, rather than booting Phaser.

interface SceneUnderTest {
    player: { x: number; y: number; cleanup: ReturnType<typeof vi.fn> };
    config: { type?: string; biome?: string };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    input: { off: ReturnType<typeof vi.fn> };
    collisionIdleTimer?: { destroy: ReturnType<typeof vi.fn> };
    travelSubscription?: ReturnType<typeof vi.fn>;
    scene: { start: ReturnType<typeof vi.fn> };
    shutdown(): void;
    onTravelRequest(destination: string | null): void;
}

function makeScene(overrides: Partial<SceneUnderTest> = {}): SceneUnderTest {
    const scene = Object.create(TownScene.prototype) as SceneUnderTest;
    scene.player = { x: 12, y: 34, cleanup: vi.fn() };
    scene.config = { type: "Warrior" };
    scene.UI = { cleanup: vi.fn() };
    scene.input = { off: vi.fn() };
    scene.scene = { start: vi.fn() };
    Object.assign(scene, overrides);
    return scene;
}

beforeEach(() => {
    vi.spyOn(store, "dispatch").mockImplementation((action) => action);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("TownScene.shutdown", () => {
    it("releases the travel-request store subscription", () => {
        const unsubscribe = vi.fn();
        const scene = makeScene({ travelSubscription: unsubscribe });

        scene.shutdown();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(scene.travelSubscription).toBeUndefined();
    });

    it("is idempotent — calling it twice does not unsubscribe twice", () => {
        const unsubscribe = vi.fn();
        const scene = makeScene({ travelSubscription: unsubscribe });

        scene.shutdown();
        scene.shutdown();

        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });

    it("does not throw when there is no travel subscription to release", () => {
        const scene = makeScene();

        expect(() => scene.shutdown()).not.toThrow();
    });

    it("also runs UI and player cleanup", () => {
        const scene = makeScene();

        scene.shutdown();

        expect(scene.UI.cleanup).toHaveBeenCalled();
        expect(scene.player.cleanup).toHaveBeenCalled();
    });
});

describe("TownScene.onTravelRequest", () => {
    it("ignores a null request", () => {
        const scene = makeScene();

        scene.onTravelRequest(null);

        expect(store.dispatch).not.toHaveBeenCalled();
        expect(scene.scene.start).not.toHaveBeenCalled();
    });

    it("ignores 'town' — that destination is for the biome scenes to consume", () => {
        const scene = makeScene();

        scene.onTravelRequest("town");

        expect(store.dispatch).not.toHaveBeenCalled();
        expect(scene.scene.start).not.toHaveBeenCalled();
    });

    it("ignores an unknown biome id rather than starting a broken scene", () => {
        const scene = makeScene();

        scene.onTravelRequest("swamp");

        expect(store.dispatch).not.toHaveBeenCalled();
        expect(scene.scene.start).not.toHaveBeenCalled();
    });

    it("clears the request before handing off, so it cannot fire twice", () => {
        const unsubscribe = vi.fn();
        const scene = makeScene({ travelSubscription: unsubscribe });

        scene.onTravelRequest("desert");

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "CLEAR_TRAVEL_REQUEST",
            payload: undefined,
        });
        expect(scene.scene.start).toHaveBeenCalledWith("BiomeScene", {
            type: "Warrior",
            biome: "desert",
        });
    });

    it("leaves teardown to the SHUTDOWN event rather than calling shutdown() itself", () => {
        // scene.start() stops this scene and fires SHUTDOWN, which is where
        // cleanup is wired (see the shutdown describe above). Calling shutdown()
        // by hand here as well would tear the scene down twice, and it is not
        // the documented lifecycle hook.
        const unsubscribe = vi.fn();
        const scene = makeScene({ travelSubscription: unsubscribe });

        scene.onTravelRequest("desert");

        expect(unsubscribe).not.toHaveBeenCalled();
        expect(scene.UI.cleanup).not.toHaveBeenCalled();
        expect(scene.player.cleanup).not.toHaveBeenCalled();
    });

    it("saves the player position and starts the requested biome", () => {
        const scene = makeScene();

        scene.onTravelRequest("tundra");

        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_PLAYER_POSITION",
            payload: { position: { x: 12, y: 34 } },
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SET_CURRENT_AREA",
            payload: { area: "tundra" },
        });
        expect(scene.scene.start).toHaveBeenCalledWith("BiomeScene", {
            type: "Warrior",
            biome: BIOMES.tundra.id,
        });
    });
});
