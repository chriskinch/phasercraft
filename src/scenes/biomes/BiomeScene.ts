import { Scene, Input, GameObjects, Display, Scenes } from "phaser";
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

    constructor() {
        super({ key: "BiomeScene" });
    }

    init(config: GameSceneConfig): void {
        this.config = config;
        // An unknown or absent id falls back to the default biome rather than
        // throwing — a bad id should still drop the player somewhere playable.
        this.biome = resolveBiome(config?.biome);
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

        this.player = new AssignClass(this.config.type, {
            scene: this,
            x: 100,
            y: 100,
        }) as PlayerType;

        this.enemies = this.add.group();
        this.enemies.runChildUpdate = true;
        this.active_enemies = this.add.group();

        this.setAreaClearedUI();
        this.startArea();

        //this.cameras.main.startFollow(this.player hero);

        // Mouse capture - using type assertion for Phaser property
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

        // When loading from an array, make sure to specify the tileWidth and tileHeight
        // const map = this.make.tilemap({ key: "map"});
        // const tileset = map.addTilesetImage("tileset_organic", "tiles", 16, 16, 1, 2);
        // this.mapset = {
        // 	base: map.createStaticLayer("base", tileset, 0, 0),
        // 	trees: map.createStaticLayer("trees", tileset, 0, 0),
        // 	bushes: map.createStaticLayer("bushes", tileset, 0, 0),
        // 	ore: map.createStaticLayer("ore", tileset, 0, 0),
        // 	details: map.createStaticLayer("details", tileset, 0, 0)
        // }
        // this.mapset.trees.setCollisionByProperty({ collides: true });
        // this.mapset.bushes.setCollisionByProperty({ collides: true });
        // this.mapset.ore.setCollisionByProperty({ collides: true });
        // this.mapset.details.setCollisionByProperty({ collides: true });

        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // mapset.trees.renderDebug(debugGraphics, {
        // 	tileColor: null, // Color of non-colliding tiles
        // 	collidingTileColor: new Display.Color(243, 134, 48, 255), // Color of colliding tiles
        // 	faceColor: new Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });

        // Camera
        // const camera = this.cameras.main;
        // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // camera.startFollow(this.player);

        // this.physics.add.collider(this.player, this.mapset.trees);
        // this.physics.add.collider(this.player, this.mapset.bushes);
        // this.physics.add.collider(this.player, this.mapset.ore);
        // this.physics.add.collider(this.player, this.mapset.details);

        // Resume physics if we load the scene post game over.
        this.physics.resume();
    }

    update(time: number, delta: number): void {
        let mouse = this.input.activePointer;

        if (this.player.alive) this.player.update(mouse, this.cursors, time, delta);

        // Allow ESC key to return to town
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

        this.enemies.add(
            new AssignType(enemy.type, {
                scene: this,
                key: enemyId,
                attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
                type: enemy.type,
                x: Math.random() * this.global_game_width,
                y: Math.random() * this.global_game_height,
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

        store.dispatch(setBossActive(true));
        store.dispatch(setEnemiesRemaining(1));
        this.enemies_alive = 1;

        this.enemies.add(
            new Boss({
                scene: this,
                key: bossId,
                attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
                type: boss.type,
                x: Math.random() * this.global_game_width,
                y: Math.random() * this.global_game_height,
                target: this.player,
                loot_table: boss.loot_table,
                active_group: this.active_enemies,
                coin_multiplier: 10,
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
        // Clean up HUD subscriptions
        if (this.UI && this.UI.cleanup) {
            this.UI.cleanup();
        }

        // Clean up player subscriptions
        if (this.player && this.player.cleanup) {
            this.player.cleanup();
        }

        // Clean up input event listeners
        this.input.off("pointerdown");
        this.input.off("pointermove");
        this.input.off("pointerup");

        // Clean up scene event listeners
        this.events.off("player:dead");
        this.events.off("enemy:dead", this.onEnemyDead, this);

        // Clean up the area-cleared banner timer
        this.removeAreaClearedTimer();

        // Release the travel-request subscription.
        if (this.travel_subscription) {
            this.travel_subscription();
            this.travel_subscription = undefined;
        }
    }
}
