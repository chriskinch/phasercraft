import { Scene, GameObjects, Geom, Input, Tilemaps, Types, Scenes } from "phaser";
import AssignClass from "@entities/Player/AssignClass";
import store from "@store";
import {
    toggleHUD,
    setCurrentArea,
    setPlayerPosition,
    switchUi,
    toggleUi,
    clearTravelRequest,
} from "@store/gameReducer";
import mapStateToData from "@helpers/mapStateToData";
import type { PlayerType } from "@entities/Player/AssignClass";
import type Player from "@entities/Player/Player";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import { BIOMES, type BiomeId } from "@/scenes/biomes/biomes";
import UI from "@entities/UI/HUD";

export default class TownScene extends Scene {
    public player!: PlayerType;
    private config!: GameSceneConfig;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys & { esc?: Input.Keyboard.Key };
    private global_game_width!: number;
    private global_game_height!: number;
    private townMap!: Tilemaps.Tilemap;
    private interactionZones!: GameObjects.Group;
    private zone!: GameObjects.Zone;
    // POI the player is currently standing on, or null. Interactions fire once on
    // entry (when this changes to a non-null value) and re-arm only after the
    // player leaves the zone — so an overlay that pauses the scene does not
    // re-open the instant the player closes it while still standing on the spot.
    private activePoi: string | null = null;
    public depth_group: Record<string, number> = {
        BASE: 10,
        UI: 10000,
        TOP: 99999,
    };
    private setDepthByY(
        sprite: GameObjects.Sprite | Player | Tilemaps.TilemapLayer | Tilemaps.TilemapGPULayer,
        offset: number = 0
    ): void {
        const depth = sprite.y + sprite.height + offset;
        sprite.setDepth(depth);
    }

    private createAnimationForSprite(
        sprite: GameObjects.Sprite,
        animConfig: {
            key: string;
            frameStart: number;
            frameEnd: number;
            frameRate: number;
            repeat?: number;
        }
    ): void {
        if (!this.anims.exists(animConfig.key)) {
            this.anims.create({
                key: animConfig.key,
                frames: this.anims.generateFrameNumbers(sprite.texture.key, {
                    start: animConfig.frameStart,
                    end: animConfig.frameEnd,
                }),
                frameRate: animConfig.frameRate,
                repeat: animConfig.repeat ?? -1,
            });
        }

        sprite.play(animConfig.key);
    }
    private UI!: UI;
    private collisionIdleTimer?: Phaser.Time.TimerEvent;
    // Store subscription bridging the React biome picker to this scene; released
    // in shutdown() per the lifecycle convention.
    private travelSubscription?: () => void;

    constructor() {
        super({ key: "TownScene" });
    }

    init(config: GameSceneConfig): void {
        this.config = config || {};
    }

    create(): void {
        store.dispatch(setCurrentArea("town"));

        const scene_padding = 40;
        this.global_game_width = Number(this.sys.game.config.width);
        this.global_game_height = Number(this.sys.game.config.height);
        this.zone = this.add
            .zone(
                scene_padding,
                scene_padding,
                this.global_game_width - scene_padding * 2,
                this.global_game_height - scene_padding * 2
            )
            .setOrigin(0);

        // Town is a non-combat hub, so hide the spell slots and the whole combat
        // readout — both the enemy counter and the coin purse.
        this.UI = new UI(this, {
            showSpellFrames: false,
            showEnemyCount: false,
            showCoinCount: false,
        });

        this.input.on(
            "pointerdown",
            (pointer: Input.Pointer, gameObject: GameObjects.GameObject[]) => {
                // Only trigger this if there are no other game objects in the way.
                if (gameObject.length === 0) {
                    this.events.emit("pointerdown:game", this, this.input.activePointer);
                }
            }
        );
        this.input.on("pointermove", () => {
            this.events.emit("pointermove:game", this, this.input.activePointer);
        });
        this.input.on("pointerup", () => {
            this.events.emit("pointerup:game", this);
        });

        const character = this.config.type || store.getState().game.character;
        if (!character) throw new Error("No character selected for town scene");
        this.player = new AssignClass(character, {
            scene: this,
            x: 90,
            y: 220,
            immovable: false,
            // The town is a non-combat hub: spawn with no abilities so no spells
            // or ability buttons are created here.
            abilities: [],
        }) as PlayerType;

        // Create town map first to set up world bounds
        this.createTownEnvironment();

        if (this.input.mouse) {
            (this.input.mouse as Input.Mouse.MouseManager & { capture: boolean }).capture = true;
        }
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
        }

        this.setupCollisions();
        this.setupPOIInteractions();

        this.createTownUI();

        store.dispatch(toggleHUD(true));

        // The biome picker writes a travel request into the store; act on it once
        // and clear it, so a stale request cannot fire again on the next visit.
        this.travelSubscription = mapStateToData("travelRequest", (destination) =>
            this.onTravelRequest(destination as BiomeId | "town" | null)
        );

        // Phaser fires SHUTDOWN on every transition away from this scene and
        // does not call shutdown() for us. Wiring cleanup to the event — rather
        // than calling it by hand before scene.start() — is the documented
        // lifecycle hook, and it is what makes the teardown symmetric with
        // create() no matter how the scene is left (picker, ESC, game over).
        // BiomeScene already does this.
        this.events.once(Scenes.Events.SHUTDOWN, this.shutdown, this);

        this.cameras.main.startFollow(this.player);
    }

    private createTownEnvironment(): void {
        this.townMap = this.make.tilemap({ key: "town-map" });

        // The first parameter must match the tileset name in the .tmj file exactly
        // The second parameter must match the loaded image key from LoadScene
        const tilesets = {
            forestVillageObjects: this.townMap.addTilesetImage(
                "forestVillageObjects_",
                "forestVillageObjects"
            ),
            forestPath: this.townMap.addTilesetImage("forestPath_", "forestPath"),
            forestResources: this.townMap.addTilesetImage("forest_ [resources]", "forestResources"),
            forestTerrain: this.townMap.addTilesetImage("forest_", "forestTerrain"),
            forestStructures: this.townMap.addTilesetImage(
                "forestVillageStructures_ [stallsWatchtower]",
                "forestVillageStructures"
            ),
            forestBridgeHorizontal: this.townMap.addTilesetImage(
                "forest_ [bridgeHorizontal]",
                "forestBridgeHorizontal"
            ),
            forestBridgeVertical: this.townMap.addTilesetImage(
                "forest_ [bridgeVertical]",
                "forestBridgeVertical"
            ),
            forestFencesAndWalls: this.townMap.addTilesetImage(
                "forest_ [fencesAndWalls]",
                "forestFencesAndWalls"
            ),
            forestFountain: this.townMap.addTilesetImage("forest_ [fountain]", "forestFountain"),
            home: this.townMap.addTilesetImage("greenHouse_0_0", "home"),
            greathall: this.townMap.addTilesetImage("redHouse_3_0", "greathall"),
            armory: this.townMap.addTilesetImage(
                "forestVillage/stalls_/stall_blue_long.png",
                "armory"
            ),
            huntersLodge: this.townMap.addTilesetImage(
                "forestVillage/stalls_/tower_green.png",
                "huntersLodge"
            ),
            alchemist: this.townMap.addTilesetImage(
                "forestVillage/stalls_/stall_green_short.png",
                "alchemist"
            ),
            arcanum: this.townMap.addTilesetImage(
                "forestVillage/stalls_/stall_red_short.png",
                "arcanum"
            ),
            wells: this.townMap.addTilesetImage("wells", "wells"),
            furnace_lit: this.townMap.addTilesetImage("furnace_lit", "furnace_lit"),
            container_stacks: this.townMap.addTilesetImage(
                "forestVillageObjects_container_stacks",
                "container_stacks"
            ),
            stool: this.townMap.addTilesetImage(
                "forestVillage/props_/forestVillageObjects_stool.png",
                "stool"
            ),
            signs: this.townMap.addTilesetImage("forest_resources_signs", "signs"),
            containers: this.townMap.addTilesetImage(
                "forestVillageObjects_containers",
                "containers"
            ),
            tableObjects: this.townMap.addTilesetImage("tableObjects_", "tableObjects"),
            stallObjects: this.townMap.addTilesetImage("stallObjects_", "stallObjects"),
            fire: this.townMap.addTilesetImage("fire", "fire"),
            fountain_flowing: this.townMap.addTilesetImage("fountain_flowing", "fountain_flowing"),
            stalls: this.townMap.addTilesetImage("stalls", "stalls"),
            outdoor_tables: this.townMap.addTilesetImage(
                "forestVillageObjects_outdoor_tables",
                "outdoor_tables"
            ),
            forest_trees: this.townMap.addTilesetImage("forest_resources_trees", "forest_trees"),
            forest_bushes_rocks: this.townMap.addTilesetImage(
                "forest_resources_bushes_rocks_ores",
                "forest_bushes_rocks"
            ),
            stash: this.townMap.addTilesetImage("stash", "stash"),
            sign_post: this.townMap.addTilesetImage("fantasy/forest_/sign_post.png", "sign_post"),
            bench: this.townMap.addTilesetImage(
                "forestVillage/props_/forestVillageObjects_bench.png",
                "bench"
            ),
            table: this.townMap.addTilesetImage(
                "forestVillage/props_/forestVillageObjects_table.png",
                "table"
            ),
            bench_long: this.townMap.addTilesetImage(
                "forestVillage/props_/forestVillageObjects_bench_long.png",
                "bench_long"
            ),
            sign_post_flipped: this.townMap.addTilesetImage(
                "fantasy/forest_/sign_post_flipped.png",
                "sign_post_flipped"
            ),
            boulder: this.townMap.addTilesetImage(
                "fantasy/forest_/forest_resources_boulder.png",
                "boulder"
            ),
            arch: this.townMap.addTilesetImage(
                "fantasy/forest_/forest_fencesAndWalls_arch.png",
                "arch"
            ),
            cloth_red: this.townMap.addTilesetImage(
                "forestVillage/stalls_/cloth_red.png",
                "cloth_red"
            ),
        };

        // The stallObjects sheet is authored in Tiled with a 16px single-edge
        // margin (7×5 = 35 tiles). Phaser's Tileset.updateTileData subtracts the
        // margin from *both* edges when recomputing `total`, which truncates this
        // sheet to 20 tiles — so decorations with higher ids (the awnings at tile
        // ids 23 and 25) fall outside the tileset's gid range and render as the
        // magenta "missing texture" box. Resetting the margin to 0 widens the gid
        // range to span the whole sheet; the sprites still draw the correct frame
        // from the separately-loaded 35-frame `stallObjects` texture, and this
        // tileset is only used by the flairs object layer (never a tile layer),
        // so the recomputed tile coordinates are irrelevant.
        tilesets.stallObjects?.setSpacing(0, 0);

        const allTilesets = Object.values(tilesets).filter((tileset) => tileset !== null);

        const layerNames = [
            "terrain",
            "terrain floor",
            "terrain props",
            "terrain flairs",
            "structure",
            "structure foreground",
            "flairs",
        ];
        layerNames.forEach((layerName, index) => {
            const layer = this.townMap.createLayer(layerName, allTilesets);
            if (layer) {
                layer.setScale(2);
                if (layerName === "structure foreground")
                    this.setDepthByY(layer, this.global_game_height);
            }
        });

        this.createObjectLayers();

        const originalMapWidth = this.townMap.widthInPixels;
        const originalMapHeight = this.townMap.heightInPixels;
        const mapWidth = originalMapWidth * 2;
        const mapHeight = originalMapHeight * 2;

        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    }

    private createObjectLayers(): void {
        const layerNames = [
            "buildings",
            "props",
            "trees",
            "flairs",
            "stash",
            "fire",
            "fountain",
            "furnace",
        ];

        layerNames.forEach((layerName) => {
            const sprites = this.townMap.createFromObjects(layerName, {});

            sprites.forEach((gameObject) => {
                if (gameObject instanceof GameObjects.Sprite) {
                    const sprite = gameObject as GameObjects.Sprite;
                    sprite.setScale(2);
                    sprite.setX(sprite.x * 2);
                    sprite.setY(sprite.y * 2);
                    this.setDepthByY(sprite);
                    this.addAnimationsToSprite(sprite);
                }
            });
        });
    }

    private addAnimationsToSprite(sprite: GameObjects.Sprite): void {
        const textureKey = sprite.texture.key;

        switch (textureKey) {
            case "furnace_lit":
                this.createAnimationForSprite(sprite, {
                    key: "furnace-anim",
                    frameStart: 0,
                    frameEnd: 7,
                    frameRate: 8,
                });
                break;

            case "fire":
                this.createAnimationForSprite(sprite, {
                    key: "fire-anim",
                    frameStart: 0,
                    frameEnd: 3,
                    frameRate: 10,
                });
                break;

            case "fountain_flowing":
                this.createAnimationForSprite(sprite, {
                    key: "fountain-anim",
                    frameStart: 0,
                    frameEnd: 3,
                    frameRate: 6,
                });
                break;
        }
    }

    private setupCollisions(): void {
        const collisionLayer = this.townMap.getObjectLayer("collision map");
        if (!collisionLayer) throw Error("Collision layer failed to load!");

        if (!this.player.body) {
            console.warn("Player physics body not ready, cannot set up collisions");
            return;
        }

        collisionLayer.objects.forEach((obj: Types.Tilemaps.TiledObject, index: number) => {
            // Tiled rect/ellipse objects always carry x/y/width/height; the
            // non-null assertions preserve the original arithmetic exactly.
            const scaledX = obj.x! * 2;
            const scaledY = obj.y! * 2;
            const scaledWidth = obj.width! * 2;
            const scaledHeight = obj.height! * 2;

            let collisionBody: GameObjects.GameObject;

            if (obj.ellipse) {
                const ellipse = this.add.ellipse(
                    scaledX + scaledWidth / 2,
                    scaledY + scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
                collisionBody = ellipse;
            } else {
                const rectangle = this.add.rectangle(
                    scaledX + scaledWidth / 2,
                    scaledY + scaledHeight / 2,
                    scaledWidth,
                    scaledHeight
                );
                collisionBody = rectangle;
            }

            // Enable physics and set as static body
            this.physics.add.existing(collisionBody, true);

            this.physics.add.collider(this.player, collisionBody, () => {
                // Debounced idle: only set to idle after 500ms of continuous collision
                this.handleCollisionIdle();
            });
        });
    }

    private handleCollisionIdle(): void {
        if (this.collisionIdleTimer) {
            this.collisionIdleTimer.destroy();
        }

        this.collisionIdleTimer = this.time.delayedCall(500, () => {
            if (this.player && this.player.body && this.player.body.speed < 20) {
                this.player.idle();
            }
            this.collisionIdleTimer = undefined;
        });
    }

    private setupPOIInteractions(): void {
        const poiLayer = this.townMap.getObjectLayer("POI");
        if (!poiLayer) {
            console.warn("No POI layer found in town map");
            return;
        }

        this.interactionZones = this.add.group();

        poiLayer.objects.forEach((poi: Types.Tilemaps.TiledObject) => {
            const scaledX = poi.x! * 2;
            const scaledY = poi.y! * 2;
            const zone = this.add.zone(scaledX, scaledY, 32, 32); // 64x64 pixel interaction area (2x scaled)

            const { interactionType, displayName } = this.mapPOIToInteraction(poi.name);

            zone.setData("type", interactionType);
            zone.setData("name", displayName);
            zone.setData("poi", poi.name);
            this.interactionZones.add(zone);
        });
    }

    private mapPOIToInteraction(poiName: string): { interactionType: string; displayName: string } {
        switch (poiName) {
            case "home":
                return { interactionType: "inn", displayName: "Home" };
            case "stash":
                return { interactionType: "storage", displayName: "Storage" };
            case "greathall":
                return { interactionType: "inn", displayName: "Great Hall" };
            case "armory":
                return { interactionType: "shop", displayName: "Armory" };
            case "alchemist":
                return { interactionType: "shop", displayName: "Alchemist" };
            case "arcanum":
                return { interactionType: "shop", displayName: "Arcanum" };
            case "merchant":
                return { interactionType: "shop", displayName: "Merchant" };
            case "blacksmith":
                return { interactionType: "shop", displayName: "Blacksmith" };
            case "entrance":
                return { interactionType: "dungeon", displayName: "Enter Dungeon" };
            default:
                return { interactionType: "unknown", displayName: poiName };
        }
    }

    private createTownUI(): void {
        // UI elements will be added later
    }

    // Enter/leave POI detection, run every frame. Finds the zone the player is
    // standing on (if any) and fires the interaction once, on entry. Geometry is
    // used rather than Arcade overlap callbacks so we get a clean "left the zone"
    // signal to re-arm on, and so it stays deterministic/testable.
    private updateInteractions(): void {
        if (!this.interactionZones) return;

        const playerBounds = this.player.getBounds();
        let poi: string | null = null;
        let type = "";
        let displayName = "";

        for (const child of this.interactionZones.getChildren()) {
            const zone = child as GameObjects.Zone;
            if (Geom.Rectangle.Overlaps(playerBounds, zone.getBounds())) {
                poi = zone.getData("poi");
                type = zone.getData("type");
                displayName = zone.getData("name");
                break;
            }
        }

        if (poi === this.activePoi) return;
        this.activePoi = poi;
        if (poi) this.handleInteraction(type, poi, displayName);
    }

    private onTravelRequest(destination: BiomeId | "town" | null): void {
        // "town" is for the biome scenes to consume — we are already here.
        if (!destination || destination === "town" || !(destination in BIOMES)) return;

        store.dispatch(clearTravelRequest());
        store.dispatch(setPlayerPosition({ x: this.player.x, y: this.player.y }));
        store.dispatch(setCurrentArea(destination));
        // scene.start() stops this scene (firing SHUTDOWN, which runs cleanup)
        // and starts the target — the documented way to change scenes. Cleanup
        // is no longer invoked by hand here.
        this.scene.start("BiomeScene", { ...this.config, biome: destination });
    }

    // `poi` is the raw POI name (e.g. "armory"), which doubles as the UI menu key;
    // `displayName` is the human label (e.g. "Armory") used for logging.
    private handleInteraction(type: string, poi: string, displayName: string): void {
        store.dispatch(setPlayerPosition({ x: this.player.x, y: this.player.y }));

        // Eventually this should universal on scene change. But... see fig.1
        // this.shutdown();
        switch (type) {
            case "inn":
                console.log(`Entering ${displayName}...`);
                // Future: this.scene.start('InnScene', this.config);
                break;
            case "shop":
                // Shops open as a React overlay (Phase 13), mirroring the dungeon
                // entrance below: the POI name is the menu-registry key in UI.tsx.
                // Opening the overlay pauses this scene via the HUD's showUi
                // subscription; the X closes it and resumes the scene.
                store.dispatch(switchUi(poi));
                store.dispatch(toggleUi(poi));
                break;
            case "storage":
                console.log(`Accessing ${displayName}...`);
                // Future: Open storage interface
                break;
            case "dungeon":
                // The entrance opens the destination picker instead of starting a
                // scene. Opening the overlay pauses this scene (the HUD's showUi
                // subscription), and the actual transition happens in
                // onTravelRequest once the player picks a biome. Cancelling the
                // picker simply leaves them standing here.
                store.dispatch(switchUi("biomeSelect"));
                store.dispatch(toggleUi("biomeSelect"));
                break;
            default:
                console.log(`Interacting with ${displayName}...`);
                break;
        }
    }

    update(time: number, delta: number): void {
        if (!this.player) return;

        if (this.player.alive) {
            this.player.update(this.input.activePointer, this.cursors, time, delta);
        }
        // Open a shop / interaction when the player walks onto its POI.
        this.updateInteractions();
        this.setDepthByY(this.player);
    }

    shutdown(): void {
        // Runs from the SHUTDOWN event. Idempotent: every release below is a
        // no-op when it has already happened.
        if (this.UI && this.UI.cleanup) {
            this.UI.cleanup();
        }

        if (this.player && this.player.cleanup) {
            this.player.cleanup();
        }

        this.input.off("pointerdown");
        this.input.off("pointermove");
        this.input.off("pointerup");

        if (this.collisionIdleTimer) {
            this.collisionIdleTimer.destroy();
            this.collisionIdleTimer = undefined;
        }

        // Release the travel-request subscription (idempotent: shutdown() is
        // called directly from onTravelRequest as well as on scene shutdown).
        if (this.travelSubscription) {
            this.travelSubscription();
            this.travelSubscription = undefined;
        }
    }
}
