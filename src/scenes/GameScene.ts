import { Scene, Input, GameObjects, Display, Scenes } from "phaser";
import AssignClass from "@entities/Player/AssignClass";
import AssignType from "@entities/Enemy/AssignType";
import Boss from "@entities/Enemy/Boss";
import UI from "@entities/UI/HUD";
import enemyTypes from "@config/enemies.json";
import type { EnemyType } from "@/types/game";
import { promoteToBoss } from "@config/bosses";
import { sample } from "lodash";
import { fontConfig } from "../config/fonts";

import { toggleHUD, setCurrentArea, setEnemiesRemaining, setBossActive } from "@store/gameReducer";
import store from "@store";

import type { EnemyConfig, EnemyOptions } from "@/types/game";
import type Player from "@entities/Player/Player";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import type { PlayerType } from "@entities/Player/AssignClass";
import { throwError } from "rxjs";

export default class GameScene extends Scene {
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
    public depth_group: Record<string, number> = {
        BASE: 10,
        UI: 10000,
        TOP: 99999,
    };
    private area_cleared_ui!: Phaser.GameObjects.Container;
    private config!: GameSceneConfig;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys & { esc?: Phaser.Input.Keyboard.Key };
    private UI!: UI;

    // An area holds a fixed pool of enemies rather than endless waves: spawn up
    // to `live_cap` at once, top up on each death until `remaining_pool` is dry,
    // then a boss. Kill the boss and the area is cleared for good — the player
    // has to leave, and re-entering rebuilds the whole pool from scratch.
    protected area_total: number = 20;
    protected live_cap: number = 5;
    protected enemy_pool: EnemyType[] = Object.keys(enemyTypes) as EnemyType[];
    private remaining_pool: number = 0;
    private enemies_left: number = 0;
    private boss_spawned: boolean = false;
    private area_cleared: boolean = false;

    constructor() {
        super({ key: "GameScene" });
    }

    init(config: GameSceneConfig): void {
        this.config = config;
    }

    create(): void {
        // Scene instances are reused across scene.start(), so field
        // initializers do not re-run — reset per-run state here.
        this.pending_spawns = 0;
        this.boss_spawned = false;
        this.area_cleared = false;
        // `game_over` was never reset here, so a scene reused after a death kept
        // it set and the old wave-clear check could never fire again. The area
        // loop gates boss spawning on the same flag, so it has to be reset —
        // flagged in the PR rather than left as a latent dead-run bug.
        this.game_over = false;

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

        this.UI = new UI(this);

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
        this.startArea();

        this.setAreaClearedUI();

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

        // Spawn delayedCalls land a frame after they are scheduled (the clock
        // updates before scene.update), so an empty group only means the pool is
        // exhausted once no spawns are still pending.
        if (
            !this.game_over &&
            !this.boss_spawned &&
            !this.area_cleared &&
            this.remaining_pool === 0 &&
            this.pending_spawns === 0 &&
            this.enemies.getChildren().length === 0
        )
            this.spawnBoss();

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

    startArea(): void {
        this.remaining_pool = this.area_total;
        this.enemies_left = this.area_total;
        store.dispatch(setEnemiesRemaining(this.enemies_left));
        store.dispatch(setBossActive(false));

        // create() re-runs on a reused scene instance, so drop any handler left
        // from the previous run before registering this one.
        this.events.off("enemy:dead", this.onEnemyDeath, this);
        this.events.on("enemy:dead", this.onEnemyDeath, this);

        this.spawnFromPool(Math.min(this.live_cap, this.remaining_pool));
    }

    onEnemyDeath(): void {
        if (this.boss_spawned) {
            this.areaCleared();
            return;
        }

        this.enemies_left--;
        store.dispatch(setEnemiesRemaining(this.enemies_left));

        // Hold the live count at the cap by replacing each kill until the pool
        // of unspawned enemies runs out.
        if (this.remaining_pool > 0) this.spawnFromPool(1);
    }

    areaCleared(): void {
        this.area_cleared = true;
        store.dispatch(setBossActive(false));

        // Same 1.5s grace period the old level-complete banner used, so the
        // boss's loot has time to drop and be collected before the message.
        this.time.delayedCall(
            1500,
            () => {
                this.area_cleared_ui.setVisible(true);
            },
            [],
            this
        );
    }

    gameOver(): void {
        this.game_over = true;
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

    spawnFromPool(count: number): void {
        // Never draw more than the pool holds — the caller's count is a request,
        // not a guarantee.
        const drawn = Math.min(count, this.remaining_pool);
        if (drawn <= 0) return;

        this.remaining_pool -= drawn;
        this.pending_spawns += drawn;

        // Drip the spawns in rather than popping them all on one frame.
        for (let i = 0; i < drawn; i++) {
            this.time.delayedCall(this.global_spawn_time * i, () => {
                const enemy = sample(this.enemy_pool);
                if (enemy) this.spawnEnemy(enemy);
                this.pending_spawns--;
            });
        }
    }

    spawnEnemy(enemyId: EnemyType, wave_multiplier?: number): void {
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
                wave_multiplier: wave_multiplier || 1,
                coin_multiplier: enemy.coin_multiplier,
            }) as GameObjects.Container
        );
    }

    spawnBoss(): void {
        this.boss_spawned = true;
        store.dispatch(setEnemiesRemaining(0));
        store.dispatch(setBossActive(true));

        // The boss is one of this area's own creatures scaled up, so the fight
        // stays thematically tied to what the player just cleared.
        const bossId = sample(this.enemy_pool) || "baby-ghoul";
        const boss = promoteToBoss(bossId);
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = boss;

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
                coin_multiplier: boss.coin_multiplier,
                aggro_radius: boss.aggro_radius,
            })
        );
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
        this.events.off("enemy:dead", this.onEnemyDeath, this);
    }
}
