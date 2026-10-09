import {
    Scene,
    Input,
    GameObjects,
    Display,
    Scenes,
    Tilemaps,
    Geom,
    Math as PhaserMath,
} from "phaser";
import AssignClass from "@entities/Player/AssignClass";
import AssignType from "@entities/Enemy/AssignType";
import Miniboss, { MINIBOSS_SCALE } from "@entities/Enemy/Miniboss";
import type Enemy from "@entities/Enemy/Enemy";
import UI from "@entities/UI/HUD";
import MinibossRoar from "@entities/UI/MinibossRoar";
import enemyTypes from "@config/enemies.json";
import type { EnemyType } from "@/types/game";
import {
    DISTANCE_MAX_MULTIPLIER,
    MINIBOSS_PINNED_LOOT,
    promoteToMiniboss,
    resolveAreaTuning,
} from "@config/area";
import { boostLootTable } from "@/lib/lootRarity";
import { difficultyAt, maxSpawnableDistance } from "@helpers/difficulty";
import { speciesWeights, weightedPick } from "@helpers/speciesWeighting";
import { readSettings } from "@services/settingsStorage";
import { resolveBiome, type BiomeDefinition } from "./biomes";
import SpawnDirector, { type SpawnHost } from "./SpawnDirector";
import SpawnDebugOverlay from "./SpawnDebugOverlay";
import MinibossChanceReadout from "./MinibossChanceReadout";
import {
    OverlayWindows,
    WINDOW_DX,
    WINDOW_DY,
    WINDOW_SIZE,
    cullBounds,
    withinBounds,
    type Bounds,
    type ViewRect,
} from "./propOverlayWindows";
import { buildWalkability, isFootprintSpawnable, type WalkabilityGrid } from "@helpers/walkability";
import { SHORE_ART_SIZE, SHORE_CELL, SHORE_OFFSET, shoreGrid } from "@helpers/shoreCollision";
import { addBanner } from "@scenes/pixelFonts";
import { pixelFontSize } from "@config/fonts";

import { toggleHUD, setCurrentArea, clearTravelRequest, toggleUi } from "@store/gameReducer";
import mapStateToData from "@helpers/mapStateToData";
import store from "@store";

import type { EnemyConfig, EnemyOptions } from "@/types/game";
import type Player from "@entities/Player/Player";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import type { PlayerType } from "@entities/Player/AssignClass";
import { throwError } from "rxjs";
import { addSafeZone } from "@/scenes/safeZone";
import { setDepthIfChanged, type DepthTarget } from "@helpers/setDepthIfChanged";

interface FeetSortable extends DepthTarget {
    y: number;
    height: number;
}

// sortCharactersByFeet's per-frame callbacks, hoisted so a frame allocates none.
function sortOnFeet(character: FeetSortable): void {
    setDepthIfChanged(character, character.y + character.height / 2);
}

function sortEnemyOnFeet(enemy: GameObjects.GameObject): void {
    if (enemy.active) sortOnFeet(enemy as unknown as FeetSortable);
}

// How far past the camera view, in tiles, a character still gets prop
// overlays. Its window's tiles reach at most two tiles across and three up
// from it, so beyond that none of them can be on screen.
const OVERLAY_CULL_MARGIN_TILES = 4;

export default class BiomeScene extends Scene {
    private global_tick: number = 42;
    private global_attack_speed: number = 1;
    private global_attack_delay: number = 250;
    private global_game_width!: number;
    private global_game_height!: number;
    private zone!: Phaser.GameObjects.Zone;
    // Detaches the safe zone's resize/inset listeners; called from shutdown().
    private release_safe_zone?: () => void;
    public player!: PlayerType;
    public enemies!: Phaser.GameObjects.Group;
    public active_enemies!: Phaser.GameObjects.Group;
    private game_over: boolean = false;
    private enemy_pool!: EnemyType[];
    private biome!: BiomeDefinition;
    private area_cleared: boolean = false;
    // Populates the area and rolls for the miniboss; rebuilt each run by
    // startArea(). Ticked by `spawn_timer`, a pause-aware scene timer released
    // on game over and shutdown.
    private director!: SpawnDirector<Enemy, EnemyType>;
    private spawn_timer?: Phaser.Time.TimerEvent;
    // Debug-only drawing of the director's state; absent unless Debug mode and
    // its spawn overlay toggle are both on. Rebuilt per area, released on shutdown.
    private spawn_overlay?: SpawnDebugOverlay<Enemy>;
    // Debug-only miniboss odds readout; same lifecycle as the spawn overlay.
    private miniboss_readout?: MinibossChanceReadout;
    public depth_group: Record<string, number> = {
        BASE: 10,
        UI: 10000,
        TOP: 99999,
    };
    private area_cleared_ui!: Phaser.GameObjects.Container;
    private config!: GameSceneConfig;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys & { esc?: Phaser.Input.Keyboard.Key };
    private area_cleared_timer: Phaser.Time.TimerEvent | undefined;
    // Store subscription bridging the React return-to-town confirmation to this
    // scene; released in shutdown() per the lifecycle convention.
    private travel_subscription?: () => void;
    private UI!: UI;
    // The biome tilemap and the layers the player collides with. Both are
    // rebuilt on every create(); the colliders are released in shutdown().
    private map!: Phaser.Tilemaps.Tilemap;
    private collision_layers: Phaser.Tilemaps.TilemapLayer[] = [];
    private map_colliders: Phaser.Physics.Arcade.Collider[] = [];
    // Hidden collision layer blocking the water side of shoreline tiles, which
    // the whole-tile terrain collision leaves walkable. See buildShore().
    private shore?: Phaser.Tilemaps.TilemapLayer;
    // Enemies bump off each other. One collider for the whole group, set up
    // per area; enemies used to add a fresh one each as they spawned.
    private enemy_collider?: Phaser.Physics.Arcade.Collider;
    // Prop layers, and the small recycled pool of sprites that redraws the few
    // prop tiles near a character so they can sort against them individually.
    private prop_layers: Tilemaps.TilemapLayer[] = [];
    private prop_overlays: GameObjects.Sprite[] = [];
    // updatePropOverlays() state, reused every frame rather than reallocated:
    // the characters and tile windows last drawn for (see propOverlayWindows),
    // the prop tiles already drawn (as numeric layer/cell keys), and scratch
    // for the camera cull and the tile conversions.
    private overlay_windows = new OverlayWindows<{ x: number; y: number }>();
    private overlay_seen = new Set<number>();
    private overlay_bounds: Bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    private overlay_view: ViewRect = { x: 0, y: 0, width: 0, height: 0 };
    private overlay_point = new PhaserMath.Vector2();
    // Tiles an enemy may spawn on: pure land the player can reach on foot.
    // Rebuilt in create() once the player's start is known.
    public spawn_grid!: WalkabilityGrid;
    // Where the player entered the area, and how far from it the furthest
    // spawnable tile is: the ends of the distance difficulty ramp (#596).
    public player_start!: { x: number; y: number };
    public max_spawn_distance = 0;
    // The map's `town-exit` POIs (the entrance gateway's opening), in world px,
    // and the one the player is standing in, if any. As in the town, the
    // interaction fires once on entry and re-arms only once the player leaves,
    // so cancelling the confirmation while still in the gateway does not
    // re-open it straight away. Plain geometry: nothing to release.
    private exit_zones: Geom.Rectangle[] = [];
    private in_exit: boolean = false;

    constructor() {
        super({ key: "BiomeScene" });
    }

    init(config: GameSceneConfig): void {
        this.config = config;
        // An unknown or absent id falls back to the default biome rather than
        // throwing — a bad id should still drop the player somewhere playable.
        this.biome = resolveBiome(config?.biome);
    }

    /**
     * Pulls in this biome's map if it is not already cached. Deliberately not
     * part of LoadScene's boot payload: the three maps are ~1MB of JSON each and
     * parsing builds a Tile object per (non-empty) tile, so loading all three up
     * front delayed the main menu by seconds for a player who might never leave
     * town. Phaser waits for the scene loader between preload() and create(),
     * and the cache check makes re-entry free.
     */
    preload(): void {
        const { key } = this.biome.map;
        if (this.cache.tilemap.exists(key)) return;

        // Same loader root as LoadScene, so a non-root deployment base resolves
        // the same way for both.
        this.load.setPath("graphics");
        this.load.tilemapTiledJSON(key, `tilesets/biomes/${key}.tmj`);
    }

    create(): void {
        // Scene instances are reused across scene.start(), so field
        // initializers do not re-run — reset per-run state here. startArea()
        // builds a fresh spawn director too, which is what makes re-entering an
        // area restart its exploration count and drop an un-killed miniboss.
        this.enemy_pool = this.biome.enemies;
        this.area_cleared = false;
        this.game_over = false;

        // Per-scene camera override, so the global backgroundColor in
        // PhaserGame.tsx (and therefore the town) is left alone.
        this.cameras.main.setBackgroundColor(this.biome.backgroundColor);

        const scene_padding = 40;
        this.global_game_width = this.scale.width;
        this.global_game_height = this.scale.height;
        // Layout zone for the HUD: kept clear of the notch/home indicator and
        // re-fitted (with the HUD re-aligned) on resize or inset changes.
        const safe_zone = addSafeZone(this, scene_padding, () => {
            this.UI.layout();
            if (this.area_cleared_ui) Display.Align.In.Center(this.area_cleared_ui, this.zone);
            this.miniboss_readout?.layout(this.zone);
        });
        this.zone = safe_zone.zone;
        this.release_safe_zone = safe_zone.release;

        // Only the biome scenes get the return-to-town button — the town has
        // nowhere to teleport back to.
        this.UI = new UI(this, { showReturnToTown: true });

        // The confirmation dialog writes a travel request into the store; act on
        // it once and clear it so a stale request cannot fire on re-entry.
        this.travel_subscription = mapStateToData("travelRequest", (destination) => {
            if (destination !== "town") return;
            store.dispatch(clearTravelRequest());
            this.returnToTown();
        });

        this.input.on(
            "pointerdown",
            (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject[]) => {
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

        if (!this.config.type) throw Error("Player type is not defined");

        // The map comes first: it sets the world bounds the player is clamped
        // to, and its collision data decides where the player can legally start.
        this.createBiomeEnvironment();

        const spawn = this.findPlayerStart() ?? this.findOpenSpawn();
        this.player = new AssignClass(this.config.type, {
            scene: this,
            x: spawn.x,
            y: spawn.y,
        }) as PlayerType;
        this.spawn_grid = this.buildSpawnGrid(spawn);
        this.player_start = { x: spawn.x, y: spawn.y };
        this.max_spawn_distance = maxSpawnableDistance(this.spawn_grid, spawn);
        this.exit_zones = this.readExitZones();
        this.in_exit = false;

        this.enemies = this.add.group();
        this.enemies.runChildUpdate = true;
        this.active_enemies = this.add.group();

        // Collide the map with the player *and* the enemy group, then lock the
        // camera to the player so the area can be wandered the way the town is.
        // The groups have to exist first: an Arcade group collider covers
        // members added later, but only if the group is registered up front.
        this.setupMapCollisions();
        this.enemy_collider = this.physics.add.collider(this.active_enemies, this.active_enemies);
        this.cameras.main.startFollow(this.player);

        this.setAreaClearedUI();
        this.startArea();

        //this.cameras.main.startFollow(this.player hero);

        if (this.input.mouse) {
            (this.input.mouse as Phaser.Input.Mouse.MouseManager & { capture: boolean }).capture =
                true;
        }
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.cursors.esc = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
        }

        // this.physics.add.collider(this.player.hero, this); // Commented out - invalid collider

        this.events.once("player:dead", this.gameOver, this);

        // Phaser does not call shutdown() automatically — wire it to the
        // scene lifecycle event so cleanup runs on every scene transition.
        this.events.once(Scenes.Events.SHUTDOWN, this.shutdown, this);

        // Resume physics if we load the scene post game over.
        this.physics.resume();
    }

    /**
     * Builds the biome tilemap: every layer in the .tmj, in the order the
     * generator wrote them, scaled to match the town, with the world and camera
     * bounds sized to the result.
     */
    private createBiomeEnvironment(): void {
        const { key, tilesets, layers, scale, propLayers } = this.biome.map;

        // Empty cells parse to `null` rather than an index -1 Tile: most layers
        // are only a few percent filled, so this skips allocating hundreds of
        // thousands of blank Tiles. Every reader here already treats a missing
        // tile and an empty one alike (getTileAt* return null for both without
        // `nonNull`; Phaser's culling, collision and face code skip nulls).
        this.map = this.make.tilemap({ key, insertNull: true });

        // The first argument must match the tileset name inside the .tmj; the
        // second the image key LoadScene preloaded it under.
        const images = tilesets
            .map(({ name, image }) => this.map.addTilesetImage(name, image))
            .filter((tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null);

        if (images.length !== tilesets.length) {
            throw Error(`${this.biome.id}: tilesets failed to load for "${key}"`);
        }

        this.collision_layers = [];
        this.prop_layers = [];
        this.overlay_windows.invalidate();

        layers.forEach((name, index) => {
            const layer = this.map.createLayer(name, images);
            if (!layer) throw Error(`${this.biome.id}: layer "${name}" missing from "${key}"`);

            layer.setScale(scale);
            // Every tile layer sits below the characters, whose depth tracks
            // their y. Props that need to be *in front* are redrawn per-tile by
            // updatePropOverlays() rather than by lifting a whole layer.
            layer.setDepth(index - layers.length);

            if (propLayers.includes(name) && layer instanceof Tilemaps.TilemapLayer) {
                this.prop_layers.push(layer);
            }

            if (this.biome.map.collisionLayers.includes(name)) {
                // `createLayer` is typed as CPU-or-GPU layer; Arcade collision
                // only works with the CPU one, which is what we get since we
                // never pass `gpu: true`. Narrow rather than cast, so a future
                // switch to GPU layers fails loudly instead of silently
                // dropping collision.
                if (!(layer instanceof Tilemaps.TilemapLayer)) {
                    throw Error(`${this.biome.id}: layer "${name}" cannot carry collision`);
                }
                // Arcade collides against whole tiles; the generator only sets
                // `collides` on tiles whose art fills its cell (full water, tree
                // and conifer bases), so the padding stays imperceptible.
                layer.setCollisionByProperty({ collides: true });
                this.collision_layers.push(layer);
            }
        });

        this.buildShore();

        const width = this.map.widthInPixels * scale;
        const height = this.map.heightInPixels * scale;
        this.physics.world.setBounds(0, 0, width, height);
        this.cameras.main.setBounds(0, 0, width, height);
    }

    /**
     * Arcade collides against whole tiles, so the terrain layer can only block
     * full water; shoreline tiles, which are part water, stayed walkable and let
     * characters wade up to a tile out into the lake. The generator tags each
     * shoreline tile with its `waterCorners` mask, and `shoreGrid` lays those
     * out as half-tile cells, offset a quarter tile so their edges fall where
     * the grass meets the rim. This builds that grid as an invisible tile layer.
     */
    private buildShore(): void {
        const terrain = this.map.getLayer("terrain");
        const { width, height } = this.map;
        const masks = new Array<number | undefined>(width * height);
        for (let y = 0; terrain && y < height; y++) {
            const row = terrain.data[y];
            if (!row) continue;
            for (let x = 0; x < width; x++) {
                const corners = (row[x]?.properties as { waterCorners?: unknown } | undefined)
                    ?.waterCorners;
                if (typeof corners === "number") masks[y * width + x] = corners;
            }
        }
        const grid = shoreGrid(width, height, masks);

        // Collision cells in the map's own tile units, then world px.
        const art = this.map.tileWidth / SHORE_ART_SIZE;
        const cell = SHORE_CELL * art;
        const offset = -SHORE_OFFSET * art * this.biome.map.scale;
        // Built from a 2D index array (0 = blocked, -1 = open) with `insertNull`,
        // so only blocked cells get a Tile: a blank layer would allocate one per
        // cell (~361k on a 300x300 map), nearly all of them empty.
        const data: number[][] = [];
        for (let y = 0; y < grid.rows; y++) {
            const row = new Array<number>(grid.cols);
            for (let x = 0; x < grid.cols; x++) row[x] = grid.cells[y * grid.cols + x] ? 0 : -1;
            data.push(row);
        }
        const shore = this.make.tilemap({
            data,
            tileWidth: cell,
            tileHeight: cell,
            insertNull: true,
        });
        // The layer is never drawn; any image will do as its tileset.
        const tileset = shore.addTilesetImage(
            "shore",
            this.biome.map.tilesets[0].image,
            cell,
            cell
        );
        const layer = tileset ? shore.createLayer(0, tileset, offset, offset) : null;
        if (!layer || !(layer instanceof Tilemaps.TilemapLayer)) {
            throw Error(`${this.biome.id}: could not build the shoreline collision layer`);
        }

        // Parse2DArray names its one layer "layer"; keep the old blank layer's name.
        layer.layer.name = "shore";
        layer.setScale(this.biome.map.scale).setVisible(false);
        layer.setCollision(0);
        this.shore = layer;
    }

    /**
     * Re-sorts the characters on their feet instead of their middle.
     *
     * In a biome this is the only depth write for the player and live enemies
     * (`Enemy.death()` pins a corpse at its `y`). Both are Containers holding a
     * Sprite at (0, 0) with the default 0.5 origin — so `y` is the *middle* of
     * the visible character, not the ground it stands on.
     * Props sort on their base, the bottom of the two-tile prop. Mixing the two
     * references is what let a bush level with the player draw over them: its
     * base sat just below the player's middle, though well above the player's
     * feet.
     *
     * Applying the same correction to the player and to every enemy keeps their
     * sorting against each other intact while putting all four references —
     * player, enemies, prop bases — on the ground. This is the town's
     * `setDepthByY(player)` idea; the town can use `y + height` because it only
     * ever sorts the player against object sprites, whereas here the characters
     * must also stay correct against each other, so it is the true half-height.
     *
     * Runs every frame, so it allocates nothing: module-level callback over the
     * group's own Set (no `getChildren()` copy), and an unchanged depth is not
     * rewritten — Phaser queues a display-list sort on every depth write.
     */
    private sortCharactersByFeet(): void {
        sortOnFeet(this.player);
        this.enemies.children.forEach(sortEnemyOnFeet);
    }

    /**
     * Redraws the handful of prop tiles around each character as individually
     * depth-sorted sprites, so a canopy is in front of a character standing
     * behind the tree and behind one standing in front of it.
     *
     * Why not simply put the prop layer in front? A tile layer carries a single
     * depth, so it is either wholly in front of every character or wholly
     * behind — which is why a canopy ended up covering a health bar belonging to
     * a player standing *below* the tree. No amount of shifting a character's
     * depth can fix that; the town avoids it by y-sorting individual object
     * sprites, which is only possible per prop.
     *
     * Why not convert the whole layer to sprites, as the town does? Measured:
     * the forest holds 5,303 prop tiles, and turning all of them into sprites
     * dropped the frame rate from ~50 to ~35, because every character changing
     * depth re-sorts a display list that size each frame. Only props that can
     * actually overlap a character matter, and there are never more than a few
     * dozen of those, so the pool stays tiny and the cost is flat.
     *
     * The prop layer still draws every canopy *behind* the characters, so this
     * only has to add the in-front case; the duplicate is the same pixels in
     * the same place and is invisible.
     *
     * Incremental: most frames nobody crosses a tile edge, so the overlays
     * would come out exactly as they already are. Each frame records which
     * characters are looked around and the tile cells their windows cover,
     * and only redraws when that differs from the last drawn frame (see
     * propOverlayWindows). Characters well outside the camera are left out, as
     * their overlays could not be seen. Anything else that changes what the
     * overlays draw (new prop layers, the pool being rebuilt, prop tiles being
     * edited) must call `overlay_windows.invalidate()`.
     */
    private updatePropOverlays(): void {
        if (!this.prop_layers.length) return;

        const scale = this.biome.map.scale;
        const tile_w = this.map.tileWidth * scale;
        const tile_h = this.map.tileHeight * scale;
        const layers = this.prop_layers;
        const bounds = this.overlayCullBounds(tile_w, tile_h);

        // `enemies.children` is the group's own Set, read in place: Phaser 4's
        // getChildren() copies it into a fresh array on every call.
        const windows = this.overlay_windows;
        windows.begin();
        this.recordOverlayWindow(this.player, bounds, tile_w, tile_h);
        for (const enemy of this.enemies.children) {
            const body = enemy as unknown as { x: number; y: number; active: boolean };
            if (body.active) this.recordOverlayWindow(body, bounds, tile_w, tile_h);
        }
        if (!windows.changed()) return;

        const { characters, cells } = windows;
        const seen = this.overlay_seen;
        seen.clear();
        const map_w = this.map.width;
        const layer_cells = map_w * this.map.height;
        let used = 0;

        for (let c = 0; c < characters.length; c++) {
            for (let l = 0; l < layers.length; l++) {
                const layer = layers[l];
                const window = (c * layers.length + l) * WINDOW_SIZE;
                // A prop is two tiles tall and a character about the same, so a
                // 3-wide by 4-tall window around them covers everything that can
                // overlap. Same cells, same order as looking up each world point.
                for (let dy = 0; dy < WINDOW_DY.length; dy++) {
                    for (let dx = 0; dx < WINDOW_DX.length; dx++) {
                        const tile = layer.getTileAt(
                            cells[window + dx],
                            cells[window + WINDOW_DX.length + dy]
                        );
                        if (!tile || tile.index < 0) continue;

                        // One key per layer and cell, as the old
                        // `${layer name}:${x},${y}` string was; layer names are
                        // unique within a map, so the index identifies it too.
                        const key = l * layer_cells + tile.y * map_w + tile.x;
                        if (seen.has(key)) continue;
                        seen.add(key);

                        used = this.drawPropOverlay(tile, layer, used, scale, tile_h);
                    }
                }
            }
        }

        // Park whatever the pool did not need this frame.
        for (let i = used; i < this.prop_overlays.length; i++) {
            this.prop_overlays[i].setVisible(false);
        }
        windows.commit();
    }

    /**
     * The world box a character must stand in to get overlays this frame: the
     * camera's view, both last frame's and the one it is about to follow the
     * player to, plus OVERLAY_CULL_MARGIN_TILES.
     */
    private overlayCullBounds(tile_w: number, tile_h: number): Bounds {
        const camera = this.cameras.main;
        // Where startFollow puts the view in the camera's preRender: scroll
        // centred on the player and clamped to the bounds (getScroll), and a
        // view `size / zoom` across around that scroll's midpoint.
        const scroll = camera.getScroll(this.player.x, this.player.y, this.overlay_point);
        const next = this.overlay_view;
        next.width = camera.width / camera.zoomX;
        next.height = camera.height / camera.zoomY;
        next.x = scroll.x + camera.width * 0.5 - next.width / 2;
        next.y = scroll.y + camera.height * 0.5 - next.height / 2;
        return cullBounds(
            this.overlay_bounds,
            camera.worldView,
            next,
            OVERLAY_CULL_MARGIN_TILES * tile_w,
            OVERLAY_CULL_MARGIN_TILES * tile_h
        );
    }

    /**
     * Records `character` and the tile cells its window covers on each prop
     * layer, unless it is outside `bounds`. Converted with the layer's own
     * worldToTileXY at the very world points the window was always looked up
     * at, which is how getTileAtWorldXY converts them, so these are exactly
     * the cells a per-point lookup hits.
     */
    private recordOverlayWindow(
        character: { x: number; y: number },
        bounds: Bounds,
        tile_w: number,
        tile_h: number
    ): void {
        const { x, y } = character;
        if (!withinBounds(bounds, x, y)) return;

        const { characters, cells } = this.overlay_windows;
        characters.push(character);
        const point = this.overlay_point;
        for (const layer of this.prop_layers) {
            // On an orthogonal map a column depends only on x and a row only on
            // y, so three conversions give all three columns and the first
            // three rows, and a fourth the last row.
            layer.worldToTileXY(x + WINDOW_DX[0] * tile_w, y + WINDOW_DY[0] * tile_h, true, point);
            const col_0 = point.x;
            const row_0 = point.y;
            layer.worldToTileXY(x + WINDOW_DX[1] * tile_w, y + WINDOW_DY[1] * tile_h, true, point);
            const col_1 = point.x;
            const row_1 = point.y;
            layer.worldToTileXY(x + WINDOW_DX[2] * tile_w, y + WINDOW_DY[2] * tile_h, true, point);
            const col_2 = point.x;
            const row_2 = point.y;
            layer.worldToTileXY(x, y + WINDOW_DY[3] * tile_h, true, point);
            cells.push(col_0, col_1, col_2, row_0, row_1, row_2, point.y);
        }
    }

    /** Places one pooled sprite over `tile`, growing the pool if needed. */
    private drawPropOverlay(
        tile: Phaser.Tilemaps.Tile,
        layer: Tilemaps.TilemapLayer,
        used: number,
        scale: number,
        tile_h: number
    ): number {
        const tileset = tile.tileset;
        if (!tileset) return used;

        // The prop layer mixes sheets — resources and the entrance gateway —
        // so each tile draws from its own tileset's spritesheet.
        const texture = this.biome.map.propsTextures[tileset.name];
        if (!texture) return used;

        const world = layer.tileToWorldXY(tile.x, tile.y);
        if (!world) return used;

        let sprite = this.prop_overlays[used];
        if (!sprite) {
            sprite = this.add.sprite(0, 0, texture).setOrigin(0, 0);
            sprite.setScale(scale);
            this.prop_overlays.push(sprite);
        }

        sprite.setTexture(texture, tile.index - tileset.firstgid);
        sprite.setPosition(world.x, world.y);
        // Sort on the bottom of the whole prop, not of this tile. Most of these
        // are the *upper* halves of two-tile props, so the base sits one tile
        // lower; taller props (the entrance gateway's beam) say how far down
        // theirs is with a `sortBase` tile property. Matches the town's
        // `sprite.y + sprite.height` convention.
        const sort_base = (tile.properties as { sortBase?: unknown } | undefined)?.sortBase;
        const tiles_below = typeof sort_base === "number" ? sort_base : 1;
        sprite.setDepth(world.y + tile_h * (tiles_below + 1));
        sprite.setVisible(true);
        return used + 1;
    }

    /**
     * One collider per collidable layer per body, rather than the town's
     * one-per-object approach: Arcade only tests the tiles under each body, so
     * this stays flat however large the map gets.
     *
     * Enemies collide with the map too — water and tree trunks stop them the
     * same way they stop the player. Registering the *group* means enemies
     * spawned later are covered without re-registering anything.
     */
    private setupMapCollisions(): void {
        if (!this.player.body) {
            console.warn("Player physics body not ready, cannot set up map collisions");
            return;
        }

        const layers = this.shore ? [...this.collision_layers, this.shore] : this.collision_layers;
        this.map_colliders = layers.flatMap((layer) => [
            this.physics.add.collider(this.player, layer),
            this.physics.add.collider(this.enemies, layer),
        ]);
    }

    /**
     * Reads the map into the spawn grid. `water` comes from the generator's
     * `water` tile property on any layer (shorelines included); `solid` is the
     * same `collides` flag the player is stopped by, so the flood fill walks
     * exactly where the player can. One pass over the map per area entry.
     */
    private buildSpawnGrid(start: { x: number; y: number }): WalkabilityGrid {
        const scale = this.biome.map.scale;
        const tile_w = this.map.tileWidth * scale;
        const tile_h = this.map.tileHeight * scale;
        const { width, height } = this.map;

        const water = new Array<boolean>(width * height).fill(false);
        const solid = new Array<boolean>(width * height).fill(false);

        // Straight off each layer's tile rows: this touches every tile of every
        // layer. Measured at roughly a third of what building the tilemap
        // itself costs, once per area entry.
        const mark = (
            layers: Phaser.Tilemaps.Tile[][][],
            out: boolean[],
            test: (tile: Phaser.Tilemaps.Tile) => boolean
        ) => {
            for (const data of layers) {
                for (let y = 0; y < height; y++) {
                    const row = data[y];
                    if (!row) continue;
                    for (let x = 0; x < width; x++) {
                        const tile = row[x];
                        if (tile && test(tile)) out[y * width + x] = true;
                    }
                }
            }
        };
        mark(
            this.map.layers.map((layer) => layer.data),
            water,
            (tile) => (tile.properties as { water?: unknown } | undefined)?.water === true
        );
        mark(
            this.collision_layers.map((layer) => layer.layer.data),
            solid,
            (tile) => tile.collides
        );

        return buildWalkability({
            width,
            height,
            tileWidth: tile_w,
            tileHeight: tile_h,
            water,
            solid,
            start: { x: Math.floor(start.x / tile_w), y: Math.floor(start.y / tile_h) },
        });
    }

    /** True when no collidable layer has a solid tile at this world position. */
    private isOpenAt(x: number, y: number): boolean {
        if (this.shore?.getTileAtWorldXY(x, y)?.collides) return false;
        return this.collision_layers.every((layer) => {
            const tile = layer.getTileAtWorldXY(x, y);
            return !tile?.collides;
        });
    }

    /**
     * The map's `town-exit` rectangles from its `POI` object layer, scaled to
     * world px. Tiled stores them in unscaled map pixels, like the start.
     */
    private readExitZones(): Geom.Rectangle[] {
        const layer = this.map.getObjectLayer("POI");
        if (!layer) return [];

        const scale = this.biome.map.scale;
        return layer.objects
            .filter((object) => object.name === "town-exit")
            .map(
                (object) =>
                    new Geom.Rectangle(
                        (object.x ?? 0) * scale,
                        (object.y ?? 0) * scale,
                        (object.width ?? 0) * scale,
                        (object.height ?? 0) * scale
                    )
            );
    }

    /**
     * Walking back out through the entrance gateway asks to return to town —
     * the same confirmation the HUD's return button opens, so what happens next
     * (the overlay pausing the scene, Return travelling, Cancel resuming) is
     * exactly that path. Fires on entering the zone only; see `in_exit`.
     */
    private updateExitZone(): void {
        if (!this.exit_zones.length || !this.player.alive || this.game_over) return;

        // On the feet, as `sortCharactersByFeet` does: whole-body bounds put the
        // player "in" the gateway as soon as their head passed under the beam.
        const feet_x = this.player.x;
        const feet_y = this.player.y + this.player.height / 2;
        const inside = this.exit_zones.some((zone) => zone.contains(feet_x, feet_y));

        if (inside === this.in_exit) return;
        this.in_exit = inside;
        if (inside) store.dispatch(toggleUi("confirmReturn"));
    }

    /**
     * The map's authored start: the `player-start` point on its `spawn` object
     * layer, just inside the entrance gateway (see the generator's
     * `ENTRANCE`). Tiled stores it in unscaled map pixels. Null when the map
     * carries none, or it sits on something solid, so the caller can fall back
     * to `findOpenSpawn`.
     */
    private findPlayerStart(): { x: number; y: number } | null {
        const marker = this.map.findObject("spawn", (object) => object.name === "player-start");
        if (!marker || marker.x === undefined || marker.y === undefined) return null;

        const scale = this.biome.map.scale;
        const start = { x: marker.x * scale, y: marker.y * scale };
        return this.isOpenAt(start.x, start.y) ? start : null;
    }

    /**
     * Fallback for a map with no usable start marker. Walks outward in a spiral from the middle of the
     * map, which the generator keeps clear of the water margin, so in practice
     * this lands on the first tile it tries.
     */
    private findOpenSpawn(): { x: number; y: number } {
        const scale = this.biome.map.scale;
        const step = this.map.tileWidth * scale;
        const centre_x = (this.map.widthInPixels * scale) / 2;
        const centre_y = (this.map.heightInPixels * scale) / 2;

        for (let ring = 0; ring < 40; ring++) {
            for (let dy = -ring; dy <= ring; dy++) {
                for (let dx = -ring; dx <= ring; dx++) {
                    // Only the outer edge of each ring is new.
                    if (ring > 0 && Math.abs(dx) !== ring && Math.abs(dy) !== ring) continue;
                    const x = centre_x + dx * step;
                    const y = centre_y + dy * step;
                    if (this.isOpenAt(x, y)) return { x, y };
                }
            }
        }

        // Every biome has a clear centre, so this is unreachable in practice —
        // but a spawn has to resolve to something rather than throw.
        console.warn(`${this.biome.id}: no open spawn found, falling back to map centre`);
        return { x: centre_x, y: centre_y };
    }

    update(time: number, delta: number): void {
        let mouse = this.input.activePointer;

        if (this.player.alive) this.player.update(mouse, this.cursors, time, delta);
        // Despawn clocks advance on the scene's own delta, so they stop with it.
        if (!this.game_over) this.director.update(delta);
        this.spawn_overlay?.draw(this.player);
        this.miniboss_readout?.draw();

        // After the characters have moved and re-set their own depths.
        this.sortCharactersByFeet();
        this.updatePropOverlays();
        this.updateExitZone();

        if (this.cursors.esc?.isDown) {
            this.returnToTown();
        }
    }

    private returnToTown(): void {
        console.log("Returning to town...");
        store.dispatch(setCurrentArea("town"));
        // Arrive back at the gate the player left through.
        this.scene.start("TownScene", { ...this.config, arrival: "gate" });
    }

    // Seeds the area: subscribe to enemy deaths, then start the spawn director
    // ticking. Enemies trickle in from the first tick; none are placed up front.
    startArea(): void {
        // Scene instances are reused, so drop any listener left by a previous
        // run before re-registering (same handler + context, so `off` matches).
        this.events.off("enemy:dead", this.onEnemyDead, this);
        this.events.on("enemy:dead", this.onEnemyDead, this);
        this.events.off("miniboss:spawned", this.announceMiniboss, this);
        this.events.on("miniboss:spawned", this.announceMiniboss, this);

        // Read once per area entry, so a Debug settings change applies the next
        // time an area is entered rather than mid-run.
        const settings = readSettings();
        const tuning = resolveAreaTuning(settings);
        this.director = new SpawnDirector(tuning, this.spawnHost());

        this.spawn_overlay?.cleanup();
        this.spawn_overlay =
            settings.debug && settings.spawnDebugOverlay
                ? new SpawnDebugOverlay(this, this.director)
                : undefined;
        this.miniboss_readout?.cleanup();
        this.miniboss_readout =
            settings.debug && settings.minibossDebugReadout
                ? new MinibossChanceReadout(this, this.director)
                : undefined;
        this.miniboss_readout?.layout(this.zone);
        this.removeSpawnTimer();
        this.spawn_timer = this.time.addEvent({
            delay: tuning.spawnIntervalMs,
            loop: true,
            callback: () => this.director.tick(),
        });
    }

    onEnemyDead(enemy: Enemy): void {
        if (this.game_over) return;
        this.director.onEnemyDead(enemy);
    }

    /**
     * "ROAR!" at the screen edge in the miniboss's direction, on every miniboss spawn
     * (its first, and each respawn after a despawn). Positions are converted to
     * screen px, since the word is pinned to the camera.
     */
    announceMiniboss(miniboss: { x: number; y: number }): void {
        const camera = this.cameras.main;
        const toScreen = (p: { x: number; y: number }) => ({
            x: (p.x - camera.worldView.x) * camera.zoom,
            y: (p.y - camera.worldView.y) * camera.zoom,
        });
        new MinibossRoar(
            this,
            { width: this.scale.width, height: this.scale.height },
            toScreen(this.player),
            toScreen(miniboss)
        );
    }

    /** The scene side of the spawn director: everything it reads or creates. */
    private spawnHost(): SpawnHost<Enemy, EnemyType> {
        return {
            playerPosition: () => ({ x: this.player.x, y: this.player.y }),
            playerStart: () => this.player_start,
            playerVelocity: () => this.player.body?.velocity ?? { x: 0, y: 0 },
            view: () => ({
                width: this.scale.width,
                height: this.scale.height,
                zoom: this.cameras.main.zoom,
            }),
            isSpawnable: (rect) => isFootprintSpawnable(this.spawn_grid, rect),
            footprint: (id, miniboss) => this.enemyFootprint(id, miniboss),
            pickRegular: () => this.pickFromPool(),
            pickMiniboss: () => this.pickFromPool(),
            difficultyAt: (point) => this.difficultyAt(point),
            distanceFromStart: (point) => ({
                distance: Math.hypot(point.x - this.player_start.x, point.y - this.player_start.y),
                fraction: this.difficultyContextAt(point).fraction,
            }),
            spawnRegular: (id, at, difficulty) => this.spawnEnemy(id, at, difficulty),
            spawnMiniboss: (id, at, difficulty) => this.spawnMiniboss(id, at, difficulty),
            onAreaCleared: () => this.areaCleared(),
            onMinibossSpawned: (miniboss) => this.events.emit("miniboss:spawned", miniboss),
            random: Math.random,
        };
    }

    // Every biome has a non-empty pool; the fallback only keeps the type total.
    /**
     * A creature from the biome's pool, weighted by species tier for how far
     * out the player is (#598): the weakest likelier near the start, the
     * strongest out at the far edge. Measured at the player rather than each
     * spawn point: a configuration lands just off screen, so the two differ by
     * a few percent of the map at most.
     */
    private pickFromPool(): EnemyType {
        const pool = this.enemy_pool;
        if (pool.length === 0) return "baby-ghoul";
        const { fraction } = this.difficultyContextAt(this.player);
        const tiers = pool.map((id) => (enemyTypes[id] as EnemyConfig).tier);
        return weightedPick(pool, speciesWeights(tiers, fraction), Math.random);
    }

    /**
     * The world-px body a creature will have. An enemy sizes itself to its
     * monster sprite's default frame, so this reads the same frame rather than
     * building the enemy to measure it. A miniboss is drawn `MINIBOSS_SCALE` times over.
     */
    private enemyFootprint(id: EnemyType, miniboss: boolean): { width: number; height: number } {
        const frame = this.textures.getFrame(id);
        const scale = miniboss ? MINIBOSS_SCALE : 1;
        return { width: frame.width * scale, height: frame.height * scale };
    }

    removeSpawnTimer(): void {
        this.spawn_timer?.remove(false);
        this.spawn_timer = undefined;
    }

    gameOver(): void {
        this.game_over = true;
        // Dying inside the area-cleared window must cancel the pending banner
        // timer, or it would pop during the game-over transition.
        this.removeAreaClearedTimer();
        // Stop spawning, despawning and counting while the transition runs.
        this.events.off("enemy:dead", this.onEnemyDead, this);
        this.director.stop();
        this.removeSpawnTimer();
        this.physics.pause();
        this.enemies.runChildUpdate = false;
        this.time.delayedCall(
            1500,
            () => {
                store.dispatch(toggleHUD(false));
                this.scene.start("GameOverScene");
            },
            [],
            this
        );
    }

    setAreaClearedUI(): void {
        this.area_cleared_ui = this.add
            .container(300, 300)
            .setDepth(this.depth_group.TOP)
            // Pinned to the viewport: the camera follows the player now, so a
            // world-space banner would scroll off with the terrain.
            .setScrollFactor(0)
            .setVisible(false);
        Display.Align.In.Center(this.area_cleared_ui, this.zone);

        this.area_cleared_ui.add(addBanner(this, 0, 0, "AREA CLEARED", pixelFontSize(5)));
    }

    // The area is cleared: show the banner. Nothing calls this since the
    // miniboss stopped clearing areas (#594); it is kept for the boss epic, whose
    // boss's death will. The player leaves (town button or ESC) and re-entry
    // rebuilds the area.
    areaCleared(): void {
        if (this.area_cleared) return;
        this.area_cleared = true;

        // Delayed 1.5s after the boss dies so its loot has time to drop.
        // Scene clock timer (not setTimeout): pause-aware, and cancelled on
        // game over / shutdown so it can't fire after leaving the scene.
        this.removeAreaClearedTimer();
        this.area_cleared_timer = this.time.delayedCall(
            1500,
            () => {
                this.area_cleared_ui.setVisible(true);
            },
            [],
            this
        );
    }

    /**
     * The stat multiplier for a spawn at `point` (#596): the biome's own factor
     * at the player's start, rising linearly to biome × DISTANCE_MAX_MULTIPLIER
     * at the furthest spawnable tile.
     */
    difficultyAt(point: { x: number; y: number }): number {
        return this.difficultyContextAt(point).multiplier;
    }

    // The multiplier and distance fraction at `point` (#596).
    private difficultyContextAt(point: { x: number; y: number }): {
        multiplier: number;
        fraction: number;
    } {
        return difficultyAt(point, {
            start: this.player_start,
            maxDistance: this.max_spawn_distance,
            biomeFactor: this.biome.difficulty,
            maxMultiplier: DISTANCE_MAX_MULTIPLIER,
        });
    }

    // Creates a regular enemy at a point the spawn director has already vetted,
    // at the difficulty of its configuration's centre.
    spawnEnemy(enemyId: EnemyType, { x, y }: { x: number; y: number }, difficulty = 1): Enemy {
        const enemy = enemyTypes[enemyId] as EnemyConfig;
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = enemy;

        // AssignType's constructor returns the Melee/Ranged/Healer instance it
        // builds, so the value is an Enemy even though TypeScript types `new
        // AssignType` as AssignType.
        const spawned = new AssignType(enemy.type, {
            scene: this,
            key: enemyId,
            attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
            type: enemy.type,
            x,
            y,
            target: null, //this.player,
            active_group: this.active_enemies,
            // Rarer loot drops more freely from tougher enemies (#597).
            loot_table: boostLootTable(enemy.loot_table, difficulty),
            // Behaviour-preserving: the scripted waves always resolved this
            // to 1 (`wave_multiplier || 1` with nothing passed), and
            // Enemy.setStats scales off it — ×1.2 damage, ×2 health. Kept
            // at 1 so removing the wave mechanic does not change enemy
            // stats; distance × biome difficulty (#596) multiplies on top.
            wave_multiplier: 1,
            difficulty,
            coin_multiplier: enemy.coin_multiplier,
        }) as unknown as Enemy;
        this.enemies.add(spawned);
        return spawned;
    }

    // Promotes one of the area's own creatures into the area miniboss, at a point
    // the spawn director has already vetted. A respawn after a despawn comes
    // through here too, so it is a fresh promotion at full health, at the
    // difficulty of where it now stands.
    spawnMiniboss(
        minibossId: EnemyType,
        { x, y }: { x: number; y: number },
        difficulty = 1
    ): Enemy {
        const miniboss = promoteToMiniboss(minibossId);
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = miniboss;

        const spawned = new Miniboss({
            scene: this,
            key: minibossId,
            attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
            type: miniboss.type,
            x,
            y,
            target: this.player,
            // Its one guaranteed special and scroll stay one (#597).
            loot_table: boostLootTable(miniboss.loot_table, difficulty, MINIBOSS_PINNED_LOOT),
            active_group: this.active_enemies,
            coin_multiplier: miniboss.coin_multiplier,
            aggro_radius: miniboss.aggro_radius,
            difficulty,
        });
        this.enemies.add(spawned);
        return spawned;
    }

    removeAreaClearedTimer(): void {
        if (this.area_cleared_timer) {
            this.area_cleared_timer.remove(false);
            delete this.area_cleared_timer;
        }
    }

    shutdown(): void {
        this.release_safe_zone?.();
        if (this.UI && this.UI.cleanup) {
            this.UI.cleanup();
        }

        if (this.player && this.player.cleanup) {
            this.player.cleanup();
        }

        this.input.off("pointerdown");
        this.input.off("pointermove");
        this.input.off("pointerup");

        this.events.off("player:dead");
        this.events.off("enemy:dead", this.onEnemyDead, this);
        this.events.off("miniboss:spawned", this.announceMiniboss, this);

        this.removeAreaClearedTimer();
        this.removeSpawnTimer();
        this.spawn_overlay?.cleanup();
        this.spawn_overlay = undefined;
        this.miniboss_readout?.cleanup();
        this.miniboss_readout = undefined;

        // Colliders registered against the tilemap layers. The Arcade plugin
        // tears its world down before the scene's own SHUTDOWN handler runs, so
        // `physics.world` is often already null here — optional-chain rather
        // than assume, or the throw takes the rest of this method with it and
        // the travel subscription below never gets released.
        this.map_colliders.forEach((collider) => this.physics?.world?.removeCollider(collider));
        this.map_colliders = [];
        if (this.enemy_collider) this.physics?.world?.removeCollider(this.enemy_collider);
        this.enemy_collider = undefined;
        this.collision_layers = [];
        this.shore = undefined;

        // The overlay pool is scene-owned, but scene instances are reused across
        // scene.start() and field initialisers do not re-run — so a stale pool
        // would survive into the next visit pointing at destroyed sprites.
        this.prop_overlays.forEach((sprite) => sprite.destroy());
        this.prop_overlays = [];
        this.prop_layers = [];
        // Drop the last frame's character references along with the pool, and
        // make the next visit draw from scratch.
        this.overlay_windows.invalidate();
        this.overlay_seen.clear();

        // Release the travel-request subscription.
        if (this.travel_subscription) {
            this.travel_subscription();
            this.travel_subscription = undefined;
        }
    }
}
