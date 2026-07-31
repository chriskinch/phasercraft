import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Geom } from "phaser";
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

interface FakeZone {
    getBounds(): Geom.Rectangle;
    getData(key: string): string;
}

interface SceneUnderTest {
    player: {
        x: number;
        y: number;
        cleanup: ReturnType<typeof vi.fn>;
        getBounds?: () => Geom.Rectangle;
    };
    config: { type?: string; biome?: string };
    UI: { cleanup: ReturnType<typeof vi.fn> };
    input: { off: ReturnType<typeof vi.fn> };
    collisionIdleTimer?: { destroy: ReturnType<typeof vi.fn> };
    travelSubscription?: ReturnType<typeof vi.fn>;
    interactionZones?: { getChildren(): FakeZone[] };
    activePoi?: string | null;
    scene: { start: ReturnType<typeof vi.fn> };
    shutdown(): void;
    onTravelRequest(destination: string | null): void;
    handleInteraction(type: string, poi: string, displayName: string): void;
    updateInteractions(): void;
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

describe("TownScene.handleInteraction", () => {
    it("opens the matching shop overlay for a shop POI", () => {
        const scene = makeScene();

        scene.handleInteraction("shop", "armory", "Armory");

        // Mirrors the dungeon path: switchUi records the previous screen, toggleUi
        // flips the overlay on. The POI name doubles as the UI menu-registry key.
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "SWITCH_UI",
            payload: { menu: "armory" },
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: "TOGGLE_UI",
            payload: { menu: "armory" },
        });
    });
});

describe("TownScene.updateInteractions", () => {
    const makeZone = (poi: string, type: string, name: string, rect: Geom.Rectangle): FakeZone => ({
        getBounds: () => rect,
        getData: (key: string) => ({ poi, type, name })[key] ?? "",
    });

    function sceneStandingOn(playerRect: Geom.Rectangle, zones: FakeZone[]): SceneUnderTest {
        const scene = makeScene();
        scene.player.getBounds = () => playerRect;
        scene.interactionZones = { getChildren: () => zones };
        return scene;
    }

    it("fires the interaction once on entry, not every frame", () => {
        const inZone = new Geom.Rectangle(100, 100, 16, 16);
        const zone = makeZone("armory", "shop", "Armory", new Geom.Rectangle(90, 90, 40, 40));
        const scene = sceneStandingOn(inZone, [zone]);
        const spy = vi.spyOn(scene, "handleInteraction").mockImplementation(() => {});

        scene.updateInteractions();
        scene.updateInteractions(); // still overlapping — must not re-fire

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("shop", "armory", "Armory");
    });

    it("re-arms only after the player leaves the zone and returns", () => {
        const inZone = new Geom.Rectangle(100, 100, 16, 16);
        const zone = makeZone("armory", "shop", "Armory", new Geom.Rectangle(90, 90, 40, 40));
        const scene = sceneStandingOn(inZone, [zone]);
        const spy = vi.spyOn(scene, "handleInteraction").mockImplementation(() => {});

        scene.updateInteractions(); // enter → fire
        scene.player.getBounds = () => new Geom.Rectangle(500, 500, 16, 16);
        scene.updateInteractions(); // left → no fire, re-arm
        scene.player.getBounds = () => inZone;
        scene.updateInteractions(); // re-enter → fire again

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it("does nothing while the player is on no POI", () => {
        const zone = makeZone("armory", "shop", "Armory", new Geom.Rectangle(90, 90, 40, 40));
        const scene = sceneStandingOn(new Geom.Rectangle(500, 500, 16, 16), [zone]);
        const spy = vi.spyOn(scene, "handleInteraction").mockImplementation(() => {});

        scene.updateInteractions();

        expect(spy).not.toHaveBeenCalled();
        expect(scene.activePoi).toBeNull();
    });
});
