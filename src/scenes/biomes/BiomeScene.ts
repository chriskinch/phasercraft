import { Scene, Input, GameObjects, Display, Scenes, Tilemaps } from "phaser";
import AssignClass from "@entities/Player/AssignClass";
import AssignType from "@entities/Enemy/AssignType";
import Boss from "@entities/Enemy/Boss";
import Enemy from "@entities/Enemy/Enemy";
import UI from "@entities/UI/HUD";
import enemyTypes from "@config/enemies.json";
import type { EnemyType } from "@/types/game";
import { DEFAULT_AREA_TUNING, promoteToBoss, type AreaTuning } from "@config/area";
import { resolveBiome, type BiomeDefinition } from "./biomes";
import SpawnDirector, { type Point, type SpawnedEnemy } from "./SpawnDirector";
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

import type { EnemyConfig } from "@/types/game";
import type { GameSceneConfig } from "@/scenes/SelectScene";
import type { PlayerType } from "@entities/Player/AssignClass";

export default class BiomeScene extends Scene {
    private global_attack_delay: number = 250;
    private global_game_width!: number;
    private global_game_height!: number;
    private zone!: Phaser.GameObjects.Zone;
    public player!: PlayerType;
    public enemies!: Phaser.GameObjects.Group;
    public active_enemies!: Phaser.GameObjects.Group;
    private enemy_pool!: EnemyType[];
    private biome!: BiomeDefinition;
    private director?: SpawnDirector;
    private readonly area_tuning: AreaTuning = DEFAULT_AREA_TUNING;
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
    // Prop layers, and the small recycled pool of sprites that redraws the few
    // prop tiles near a character so they can sort against them individually.
    private prop_layers: Tilemaps.TilemapLayer[] = [];
    private prop_overlays: GameObjects.Sprite[] = [];

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
        this.enemy_pool = this.biome.enemies;
        this.area_cleared = false;

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

        this.enemies = this.add.group();
        this.enemies.runChildUpdate = true;
        this.active_enemies = this.add.group();

        // Collide the map with the player *and* the enemy group, then lock the
        // camera to the player so the area can be wandered the way the town is.
        // The groups have to exist first: an Arcade group collider covers
        // members added later, but only if the group is registered up front.
        this.setupMapCollisions();
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
        this.prop_layers = [];

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

        const width = this.map.widthInPixels * scale;
        const height = this.map.heightInPixels * scale;
        this.physics.world.setBounds(0, 0, width, height);
        this.cameras.main.setBounds(0, 0, width, height);
    }

    /**
     * Re-sorts the characters on their feet instead of their middle.
     *
     * `Player` and `Enemy` both set their own depth to `this.y`, and both are
     * Containers holding a Sprite at (0, 0) with the default 0.5 origin — so
     * `y` is the *middle* of the visible character, not the ground it stands on.
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
     */
    private sortCharactersByFeet(): void {
        const onFeet = (character: { y: number; height: number; setDepth(d: number): unknown }) =>
            character.setDepth(character.y + character.height / 2);

        onFeet(this.player);
        this.enemies.getChildren().forEach((enemy) => {
            const character = enemy as unknown as {
                y: number;
                height: number;
                active: boolean;
                setDepth(d: number): unknown;
            };
            if (character.active) onFeet(character);
        });
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
     */
    private updatePropOverlays(): void {
        if (!this.prop_layers.length) return;

        const scale = this.biome.map.scale;
        const tile_w = this.map.tileWidth * scale;
        const tile_h = this.map.tileHeight * scale;

        const characters: Array<{ x: number; y: number }> = [this.player];
        this.enemies.getChildren().forEach((enemy) => {
            const body = enemy as unknown as { x: number; y: number; active: boolean };
            if (body.active) characters.push(body);
        });

        const seen = new Set<string>();
        let used = 0;

        for (const character of characters) {
            for (const layer of this.prop_layers) {
                // A prop is two tiles tall and a character about the same, so a
                // 3-wide by 4-tall window around them covers everything that can
                // overlap. Cheap: a few dozen lookups a frame.
                for (let dy = -2; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const world_x = character.x + dx * tile_w;
                        const world_y = character.y + dy * tile_h;
                        const tile = layer.getTileAtWorldXY(world_x, world_y);
                        if (!tile || tile.index < 0) continue;

                        const key = `${layer.layer.name}:${tile.x},${tile.y}`;
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

        let sprite = this.prop_overlays[used];
        if (!sprite) {
            sprite = this.add.sprite(0, 0, this.biome.map.propsTexture).setOrigin(0, 0);
            sprite.setScale(scale);
            this.prop_overlays.push(sprite);
        }

        const world = layer.tileToWorldXY(tile.x, tile.y);
        if (!world) return used;

        sprite.setFrame(tile.index - tileset.firstgid);
        sprite.setPosition(world.x, world.y);
        // Sort on the bottom of the whole prop, not of this tile: these are the
        // *upper* halves of two-tile props, so the base sits one tile lower.
        // Matches the town's `sprite.y + sprite.height` convention.
        sprite.setDepth(world.y + tile_h * 2);
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

        this.map_colliders = this.collision_layers.flatMap((layer) => [
            this.physics.add.collider(this.player, layer),
            this.physics.add.collider(this.enemies, layer),
        ]);
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

    private getSpawnRadius(): number {
        return Math.min(this.scale.width, this.scale.height) / 2;
    }

    private getSpawnFootprint(multiplier: number): number {
        return (
            Math.max(this.map.tileWidth, this.map.tileHeight) * this.biome.map.scale * multiplier
        );
    }

    private getSpawnBounds(): { left: number; right: number; top: number; bottom: number } {
        return this.physics.world.bounds;
    }

    private getPlayerVelocity(): { x: number; y: number } {
        const velocity = this.player.body?.velocity;
        return velocity ? { x: velocity.x, y: velocity.y } : { x: 0, y: 0 };
    }

    private isFootprintSpawnable(point: Point, footprint: number): boolean {
        const offsets = [
            { x: 0, y: 0 },
            { x: footprint, y: 0 },
            { x: -footprint, y: 0 },
            { x: 0, y: footprint },
            { x: 0, y: -footprint },
            { x: footprint, y: footprint },
            { x: footprint, y: -footprint },
            { x: -footprint, y: footprint },
            { x: -footprint, y: -footprint },
        ];
        const bounds = this.getSpawnBounds();

        return offsets.every(({ x, y }) => {
            const worldX = point.x + x;
            const worldY = point.y + y;

            return (
                worldX >= bounds.left &&
                worldX <= bounds.right &&
                worldY >= bounds.top &&
                worldY <= bounds.bottom &&
                this.isOpenAt(worldX, worldY)
            );
        });
    }

    private syncSpawnHud({
        killsRemaining,
        bossActive,
    }: {
        kills: number;
        killsRemaining: number;
        bossActive: boolean;
    }): void {
        store.dispatch(setBossActive(bossActive));
        store.dispatch(setEnemiesRemaining(killsRemaining));
    }

    private spawnRegularAt(enemyId: EnemyType, point: Point): SpawnedEnemy {
        return this.spawnEnemy(enemyId, point);
    }

    private spawnBossAt(enemyId: EnemyType, point: Point): SpawnedEnemy {
        return this.spawnBoss(enemyId, point);
    }

    update(time: number, delta: number): void {
        let mouse = this.input.activePointer;

        if (this.player.alive) this.player.update(mouse, this.cursors, time, delta);

        // After the characters have moved and re-set their own depths.
        this.sortCharactersByFeet();
        this.updatePropOverlays();
        this.director?.update(delta);

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
        this.director?.cleanup();
        this.director = new SpawnDirector({
            tuning: this.area_tuning,
            enemyPool: this.enemy_pool,
            clock: this.time,
            events: this.events,
            getPlayerPosition: () => ({ x: this.player.x, y: this.player.y }),
            getPlayerVelocity: () => this.getPlayerVelocity(),
            getSpawnBounds: () => this.getSpawnBounds(),
            getSpawnRadius: () => this.getSpawnRadius(),
            getSpawnFootprint: (multiplier) => this.getSpawnFootprint(multiplier),
            isFootprintSpawnable: (point, footprint) => this.isFootprintSpawnable(point, footprint),
            spawnRegular: (enemyId, point) => this.spawnRegularAt(enemyId, point),
            spawnBoss: (enemyId, point) => this.spawnBossAt(enemyId, point),
            syncHud: (state) => this.syncSpawnHud(state),
            onBossSpawned: (boss) => this.events.emit("boss:spawned", boss),
            onAreaCleared: () => this.areaCleared(),
        });
        this.director.start();
    }

    gameOver(): void {
        // Dying inside the area-cleared window must cancel the pending banner
        // timer, or it would pop during the game-over transition.
        this.removeAreaClearedTimer();
        this.director?.cleanup();
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

    spawnEnemy(enemyId: EnemyType, point: Point): SpawnedEnemy {
        const enemy = enemyTypes[enemyId] as EnemyConfig;
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = enemy;
        const spawned = new AssignType(enemy.type, {
            scene: this,
            key: enemyId,
            attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
            type: enemy.type,
            x: point.x,
            y: point.y,
            target: null,
            active_group: this.active_enemies,
            loot_table: enemy.loot_table,
            wave_multiplier: 1,
            coin_multiplier: enemy.coin_multiplier,
        }) as Enemy;

        this.enemies.add(spawned as GameObjects.Container);
        return spawned as SpawnedEnemy;
    }

    spawnBoss(enemyId: EnemyType, point: Point): SpawnedEnemy {
        const boss = promoteToBoss(enemyId);
        const { damage, speed, range, attack_speed, health_max, health_regen_rate } = boss;
        const spawned = new Boss({
            scene: this,
            key: enemyId,
            attributes: { damage, speed, range, attack_speed, health_max, health_regen_rate },
            type: boss.type,
            x: point.x,
            y: point.y,
            target: this.player,
            loot_table: boss.loot_table,
            active_group: this.active_enemies,
            coin_multiplier: boss.coin_multiplier,
            aggro_radius: boss.aggro_radius,
        });

        this.enemies.add(spawned);
        return spawned as SpawnedEnemy;
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
        this.director?.cleanup();
        this.director = undefined;

        this.removeAreaClearedTimer();

        // Colliders registered against the tilemap layers. The Arcade plugin
        // tears its world down before the scene's own SHUTDOWN handler runs, so
        // `physics.world` is often already null here — optional-chain rather
        // than assume, or the throw takes the rest of this method with it and
        // the travel subscription below never gets released.
        this.map_colliders.forEach((collider) => this.physics?.world?.removeCollider(collider));
        this.map_colliders = [];
        this.collision_layers = [];

        // The overlay pool is scene-owned, but scene instances are reused across
        // scene.start() and field initialisers do not re-run — so a stale pool
        // would survive into the next visit pointing at destroyed sprites.
        this.prop_overlays.forEach((sprite) => sprite.destroy());
        this.prop_overlays = [];
        this.prop_layers = [];

        // Release the travel-request subscription.
        if (this.travel_subscription) {
            this.travel_subscription();
            this.travel_subscription = undefined;
        }
    }
}
