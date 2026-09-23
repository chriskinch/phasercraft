import { Scene, Input, GameObjects, Display, Scenes, Tilemaps } from "phaser";
import AssignClass from "@entities/Player/AssignClass";
import AssignType from "@entities/Enemy/AssignType";
import Boss from "@entities/Enemy/Boss";
import UI from "@entities/UI/HUD";
import enemyTypes from "@config/enemies.json";
import type { EnemyType } from "@/types/game";
import { promoteToBoss } from "@config/area";
import { resolveBiome, type BiomeDefinition } from "./biomes";
import { sample } from "lodash";
import { fontConfig } from "../../config/fonts";

import {
    toggleHUD,
    setCurrentArea,
    setEnemiesRemaining,
    setBossActive,
    clearTravelRequest,
} from "@store/gameReducer";
import mapStateToData from "@helpers/mapStateToData";
import store from "@store";

import type { EnemyConfig, EnemyOptions } from "@/types/game";
import type Player from "@entities/Player/Player";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import type { PlayerType } from "@entities/Player/AssignClass";
import { throwError } from "rxjs";

export default class BiomeScene extends Scene {
    private global_tick: number = 42;
    private global_attack_speed: number = 1;
    private global_attack_delay: number = 250;
    private global_spawn_time: number = 200;
    private global_game_width!: number;
    private global_game_height!: number;
    private zone!: Phaser.GameObjects.Zone;
    public player!: PlayerType;
    public enemies!: Phaser.GameObjects.Group;
    public active_enemies!: Phaser.GameObjects.Group;
    private game_over: boolean = false;
    private pending_spawns: number = 0;
    // Area progress. `pool_remaining` counts enemies not yet spawned,
    // `enemies_alive` those spawned and not yet dead. Both are tracked here
    // rather than read off the group because `enemy:dead` fires from
    // Enemy.death() *before* the object is destroyed, so the group still
    // contains the dying enemy when the top-up decision is made.
    private pool_remaining: number = 0;
    private enemies_alive: number = 0;
    private live_cap!: number;
    private enemy_pool!: EnemyType[];
    private biome!: BiomeDefinition;
    private boss_spawned: boolean = false;
    private area_cleared: boolean = false;
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
    // Spawn ring around the player, in pixels. The lower bound keeps enemies
    // from materialising on top of the player; the upper bound is set per-spawn
    // from the viewport, so enemies arrive within sight.
    private static readonly MIN_SPAWN_DISTANCE = 180;

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
     * Phaser builds a Tile object per tile on parse, so loading all three up
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
        // initializers do not re-run — reset per-run state here. This is also
        // what makes re-entering an area respawn its pool and drop an un-killed
        // boss.
        this.pending_spawns = 0;
        this.enemies_alive = 0;
        this.pool_remaining = this.biome.total;
        this.live_cap = this.biome.liveCap;
        this.enemy_pool = this.biome.enemies;
        this.boss_spawned = false;
        this.area_cleared = false;
        this.game_over = false;

        // Per-scene camera override, so the global backgroundColor in
        // PhaserGame.tsx (and therefore the town) is left alone.
        this.cameras.main.setBackgroundColor(this.biome.backgroundColor);

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

        const spawn = this.findOpenSpawn();
        this.player = new AssignClass(this.config.type, {
            scene: this,
            x: spawn.x,
            y: spawn.y,
        }) as PlayerType;

        // Collide the player with the map, then lock the camera to them so the
        // area can be wandered the way the town is.
        this.setupMapCollisions();
        this.cameras.main.startFollow(this.player);

        this.enemies = this.add.group();
        this.enemies.runChildUpdate = true;
        this.active_enemies = this.add.group();

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
        const { key, tilesets, layers, scale } = this.biome.map;

        this.map = this.make.tilemap({ key });

        // The first argument must match the tileset name inside the .tmj; the
        // second the image key LoadScene preloaded it under.
        const images = tilesets
            .map(({ name, image }) => this.map.addTilesetImage(name, image))
            .filter((tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null);

        if (images.length !== tilesets.length) {
            throw Error(`${this.biome.id}: tilesets failed to load for "${key}"`);
        }

        this.collision_layers = [];

        layers.forEach((name, index) => {
            const layer = this.map.createLayer(name, images);
            if (!layer) throw Error(`${this.biome.id}: layer "${name}" missing from "${key}"`);

            layer.setScale(scale);
            // Negative depths keep every tile layer under the player and the
            // enemies, whose depth tracks their y and so is never below zero.
            // Canopies therefore draw over trunks but never over a character —
            // in a top-down fight, seeing who you are hitting wins over the
            // occlusion realism of walking behind a tree.
            layer.setDepth(index - layers.length);

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

        const width = this.map.widthInPixels * scale;
        const height = this.map.heightInPixels * scale;
        this.physics.world.setBounds(0, 0, width, height);
        this.cameras.main.setBounds(0, 0, width, height);
    }

    /**
     * One collider per collidable layer, rather than the town's one-per-object
     * approach: Arcade only tests the tiles under the body, so this stays flat
     * however large the map gets.
     */
    private setupMapCollisions(): void {
        if (!this.player.body) {
            console.warn("Player physics body not ready, cannot set up map collisions");
            return;
        }

        this.map_colliders = this.collision_layers.map((layer) =>
            this.physics.add.collider(this.player, layer)
        );
    }

    /** True when no collidable layer has a solid tile at this world position. */
    private isOpenAt(x: number, y: number): boolean {
        return this.collision_layers.every((layer) => {
            const tile = layer.getTileAtWorldXY(x, y);
            return !tile?.collides;
        });
    }

    /**
     * Somewhere legal to start. Walks outward in a spiral from the middle of the
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

    /**
     * A point on a ring around the player, inside the viewport so enemies arrive
     * within sight rather than somewhere off in the map. Positions that land on
     * water or a tree are retried a bounded number of times; if the player is
     * genuinely boxed in, the last candidate is used rather than looping.
     */
    private spawnPointNearPlayer(): { x: number; y: number } {
        // Half the shorter viewport side, so the ring fits on screen whichever
        // way round the window is.
        const max_radius = Math.min(this.scale.width, this.scale.height) / 2;
        const min_radius = Math.min(BiomeScene.MIN_SPAWN_DISTANCE, max_radius);
        const bounds = this.physics.world.bounds;

        let x = this.player.x;
        let y = this.player.y;

        for (let attempt = 0; attempt < 12; attempt++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = min_radius + Math.random() * (max_radius - min_radius);
            const clamp = (value: number, min: number, max: number) =>
                Math.min(Math.max(value, min), max);
            x = clamp(
                this.player.x + Math.cos(angle) * radius,
                bounds.left + this.map.tileWidth,
                bounds.right - this.map.tileWidth
            );
            y = clamp(
                this.player.y + Math.sin(angle) * radius,
                bounds.top + this.map.tileHeight,
                bounds.bottom - this.map.tileHeight
            );
            if (this.isOpenAt(x, y)) break;
        }

        return { x, y };
    }

    update(time: number, delta: number): void {
        let mouse = this.input.activePointer;

        if (this.player.alive) this.player.update(mouse, this.cursors, time, delta);

        if (this.cursors.esc?.isDown) {
            this.returnToTown();
        }
    }

    private returnToTown(): void {
        console.log("Returning to town...");
        store.dispatch(setCurrentArea("town"));
        this.scene.start("TownScene", this.config);
    }

    // Seeds the area: subscribe to enemy deaths, then fill up to the live cap.
    startArea(): void {
        // Scene instances are reused, so drop any listener left by a previous
        // run before re-registering (same handler + context, so `off` matches).
        this.events.off("enemy:dead", this.onEnemyDead, this);
        this.events.on("enemy:dead", this.onEnemyDead, this);

        // Leaving mid-boss leaves `bossActive` set in the store, which would
        // make the fresh area read "BOSS" — clear it as the area is seeded.
        store.dispatch(setBossActive(false));
        this.syncAreaProgress();
        this.fillToLiveCap();
    }

    // Tops the area back up to the live cap, drawing from what is left of the
    // pool. No-op once the pool is exhausted.
    fillToLiveCap(): void {
        const occupied = this.enemies_alive + this.pending_spawns;
        const count = Math.min(Math.max(this.live_cap - occupied, 0), this.pool_remaining);
        if (count <= 0) return;

        const list = Array.from({ length: count }, () => sample(this.enemy_pool)).filter(
            (enemy): enemy is EnemyType => enemy !== undefined
        );

        this.pool_remaining -= list.length;
        this.spawnEnemies(list);
    }

    onEnemyDead(): void {
        if (this.game_over) return;

        this.enemies_alive = Math.max(this.enemies_alive - 1, 0);

        if (this.boss_spawned) {
            this.areaCleared();
            return;
        }

        this.fillToLiveCap();
        this.syncAreaProgress();

        // The pool is spent and the field is clear: time for the boss.
        if (this.pool_remaining === 0 && this.enemies_alive === 0 && this.pending_spawns === 0) {
            this.spawnBoss();
        }
    }

    // Mirrors area progress into the store for the HUD readout.
    syncAreaProgress(): void {
        store.dispatch(
            setEnemiesRemaining(this.pool_remaining + this.enemies_alive + this.pending_spawns)
        );
    }

    gameOver(): void {
        this.game_over = true;
        // Dying inside the area-cleared window must cancel the pending banner
        // timer, or it would pop during the game-over transition.
        this.removeAreaClearedTimer();
        // Stop topping the area up while the game-over transition runs.
        this.events.off("enemy:dead", this.onEnemyDead, this);
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

        this.cache.bitmapFont.add("wayne-3d", GameObjects.RetroFont.Parse(this, fontConfig));
        this.area_cleared_ui.add(
            this.add.bitmapText(0, 0, "wayne-3d", "AREA CLEARED").setOrigin(0.5).setScale(2)
        );
    }

    // The boss is down: show the banner and stop spawning. Nothing refills the
    // area — the player leaves (town button or ESC) and re-entry rebuilds it.
    areaCleared(): void {
        if (this.area_cleared) return;
        this.area_cleared = true;

        store.dispatch(setBossActive(false));
        store.dispatch(setEnemiesRemaining(0));

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

    spawnEnemies(list: EnemyType[]): void {
        this.pending_spawns += list.length;
        list.forEach((enemy, i) => {
            this.time.delayedCall(this.global_spawn_time * i, () => {
                this.pending_spawns--;
                this.spawnEnemy(enemy);
                this.enemies_alive++;
                this.syncAreaProgress();
            });
        });
    }

    spawnEnemy(enemyId: EnemyType): void {
        const enemy = enemyTypes[enemyId] as EnemyConfig;
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = enemy;
        // Enemies used to spawn anywhere in a viewport-sized area, which put
        // them all in the map's top-left corner once the world grew to 300x300.
        // They now arrive on a ring around the player instead.
        const { x, y } = this.spawnPointNearPlayer();

        this.enemies.add(
            new AssignType(enemy.type, {
                scene: this,
                key: enemyId,
                attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
                type: enemy.type,
                x,
                y,
                target: null, //this.player,
                active_group: this.active_enemies,
                loot_table: enemy.loot_table,
                // Behaviour-preserving: the scripted waves always resolved this
                // to 1 (`wave_multiplier || 1` with nothing passed), and
                // Enemy.setStats scales off it — ×1.2 damage, ×2 health. Kept
                // at 1 so removing the wave mechanic does not change enemy
                // stats. Per-biome scaling is a later step.
                wave_multiplier: 1,
                coin_multiplier: enemy.coin_multiplier,
            }) as GameObjects.Container
        );
    }

    // Promotes one of the area's own creatures into the area boss.
    spawnBoss(): void {
        if (this.boss_spawned) return;
        this.boss_spawned = true;

        const bossId = sample(this.enemy_pool) || "baby-ghoul";
        const boss = promoteToBoss(bossId);
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = boss;
        const { x, y } = this.spawnPointNearPlayer();

        store.dispatch(setBossActive(true));
        store.dispatch(setEnemiesRemaining(1));
        this.enemies_alive = 1;

        this.enemies.add(
            new Boss({
                scene: this,
                key: bossId,
                attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
                type: boss.type,
                x,
                y,
                target: this.player,
                loot_table: boss.loot_table,
                active_group: this.active_enemies,
                coin_multiplier: boss.coin_multiplier,
                aggro_radius: boss.aggro_radius,
            })
        );
    }

    removeAreaClearedTimer(): void {
        if (this.area_cleared_timer) {
            this.area_cleared_timer.remove(false);
            delete this.area_cleared_timer;
        }
    }

    shutdown(): void {
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

        this.removeAreaClearedTimer();

        // Colliders registered against the tilemap layers. The Arcade plugin
        // tears its world down before the scene's own SHUTDOWN handler runs, so
        // `physics.world` is often already null here — optional-chain rather
        // than assume, or the throw takes the rest of this method with it and
        // the travel subscription below never gets released.
        this.map_colliders.forEach((collider) => this.physics?.world?.removeCollider(collider));
        this.map_colliders = [];
        this.collision_layers = [];

        // Release the travel-request subscription.
        if (this.travel_subscription) {
            this.travel_subscription();
            this.travel_subscription = undefined;
        }
    }
}
