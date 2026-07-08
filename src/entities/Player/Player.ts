import { Math as PhaserMath, GameObjects, Scene, Physics, Display } from "phaser";
import { v4 as uuid } from "uuid";
import Hero from "./Hero";
import Weapon from "@entities/Weapon";
import AssignSpell from "@entities/Spells/AssignSpell";
import CastingController from "@entities/Spells/CastingController";
import AssignResource, {
    AssignResourceType,
    AssignResourceName,
} from "@entities/Resources/AssignResource";
import targetVector from "@helpers/targetVector";
import Boons from "@entities/UI/Boons";
import store from "@store";
import { addXP, setBaseStats, setLevel, setStats } from "@store/gameReducer";
import isEmpty from "lodash/isEmpty";
import mapStateToData from "@helpers/mapStateToData";
import CombatText from "../UI/CombatText";
import CastBar from "@entities/UI/CastBar";
import Projectile from "@entities/Weapons/Projectile";
import type { PlayerOptions, PlayerStats, SpellProjectileConfig } from "@/types/game";
import type Enemy from "@entities/Enemy/Enemy";
import type { GameSceneLike } from "@/types/scene";
import * as converter from "number-to-words";

interface Destination {
    x: number | null;
    y: number | null;
}

interface DrawBarOptions {
    colour: number;
    width: number;
    height: number;
    depth: number;
}

class Player extends GameObjects.Container {
    public classification: string;
    public name: string;
    public uuid: string;
    private subscriptions: (() => void)[] = [];
    public hero: Hero;
    public boons: Boons;
    public alive: boolean;
    public attack_ready: boolean;
    public delay: number;
    public destination: Destination;
    public health: AssignResourceType;
    public resource: AssignResourceType;
    public shield: AssignResourceType;
    public weapon: Weapon;
    public stats!: PlayerStats;
    public spells: AssignSpell[];
    public mouse!: Phaser.Input.Pointer;
    public point!: PhaserMath.Vector2;
    public dragging!: boolean;
    public attack_delay!: Phaser.Time.TimerEvent | null;
    public swing: Phaser.Time.TimerEvent | null = null;
    public body!: Physics.Arcade.Body;
    // Owns the cast flow (priming, approach, wind-ups, interrupts).
    public casting!: CastingController;
    // Ranged classes set this to fire their basic attack as a homing
    // projectile (damage on impact) instead of an instant melee swing.
    public attack_projectile?: SpellProjectileConfig;
    public castBar!: CastBar;

    constructor({
        scene,
        x,
        y,
        abilities = [],
        classification = "",
        stats,
        resource_type,
        immovable = true,
        attack_projectile,
    }: PlayerOptions) {
        super(scene, x, y);
        this.classification = classification;
        this.attack_projectile = attack_projectile;
        this.name = "player";
        this.uuid = uuid();
        const base_stats: PlayerStats = { ...stats, resource_type }; // Add resource type into to base stats.
        // Adding this in place for when there is a stats state when resuming from gameover or a save.
        if (isEmpty(store.getState().game.base_stats)) store.dispatch(setBaseStats(base_stats));
        if (isEmpty(store.getState().game.stats)) store.dispatch(setStats(base_stats));

        this.hero = new Hero({
            scene: scene,
            key: "player",
        });
        this.add(this.hero);

        this.setSize(this.hero.getBounds().width, this.hero.getBounds().height);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.body.collideWorldBounds = true;
        this.body.immovable = immovable;
        this.body.setFriction(0, 0);

        this.setCollisionBox();

        this.boons = new Boons(this.scene, this);

        this.alive = true;
        this.attack_ready = true;
        this.delay = 0;
        this.destination = {
            x: null,
            y: null,
        };

        this.createAnimations(classification);
        this.setExperience();

        this.health = AssignResource("Health", {
            container: this,
            scene: scene,
            x: -14,
            y: -35,
            ...stats,
        });
        this.add(this.health);

        this.resource = AssignResource(resource_type as AssignResourceName, {
            container: this,
            scene: scene,
            x: -14,
            y: -30,
            ...stats,
        });
        this.add(this.resource);

        this.shield = AssignResource("Shield", {
            container: this,
            scene: scene,
            x: -14,
            y: -40,
            ...stats,
        });
        this.add(this.shield);

        this.weapon = new Weapon({ scene: scene, key: "weapon-swooch" });
        this.add(this.weapon);

        // This maps the stats section of the store to this.stats.
        // Updates on store change using RxJS.
        this.subscriptions.push(
            mapStateToData("stats", (stats: unknown) => {
                // Store stats might have different properties, so we handle the conversion
                this.stats = stats as PlayerStats;
            })
        );
        this.subscriptions.push(
            mapStateToData("level.currentLevel", (level: unknown) => {
                if (typeof level === "number") {
                    this.LevelUp(level);
                }
            })
        );

        scene.events.once("player:dead", this.death, this);
        scene.events.on("enemy:attack", this.hit, this);
        this.health.on("change", this.healthChanged);

        // Created before the spells so their disable path can notify it.
        this.casting = new CastingController({
            scene: scene as GameSceneLike,
            player: this,
        });
        this.castBar = new CastBar(scene, this);

        this.spells = abilities.map((spell, i) => {
            return new AssignSpell(spell, {
                player: this,
                scene: scene,
                x: this.x,
                y: this.y,
                key: `spell-${spell.toLowerCase()}`,
                hotkey: converter.toWords(i + 1).toUpperCase(),
                slot: i,
            });
        });

        this.idle();

        this.setInteractive();
        scene.events.on("pointerdown:game", this.gameDownHandler, this);
        scene.events.on("pointermove:game", this.gameMoveHandler, this);
        scene.events.on("pointerup:game", this.gameUpHandler, this);
        scene.events.on("enemy:dead", this.targetDead, this);
        this.on("pointerdown", () => scene.events.emit("pointerdown:player", this));

        // mapStateToData("stats", s => this.stats = s);
    }

    drawBar(opt: DrawBarOptions): GameObjects.Graphics {
        let graphics = this.scene.add.graphics();
        graphics.fillStyle(opt.colour, 1);
        graphics.fillRect(0, 0, opt.width, opt.height);
        graphics.setDepth(opt.depth);

        return graphics;
    }

    update(
        mouse: Phaser.Input.Pointer,
        keys: Phaser.Types.Input.Keyboard.CursorKeys & Record<string, Phaser.Input.Keyboard.Key>,
        time: number,
        delta: number
    ): void {
        this.mouse = mouse;
        this.setDepth(this.y);

        this.point = new PhaserMath.Vector2();
        this.point.x = this.x;
        this.point.y = this.y;

        let arrived = this.atDestination(this, this.destination);
        if (arrived && this.body.speed > 0) {
            this.idle();
        }

        // Drive any queued walk-into-range cast; wind-ups/channels root the
        // player and pause the auto-attack chase until they resolve.
        this.casting.update();
        if ((this.scene as GameSceneLike).selected && !this.casting.isCasting()) this.goToRange();

        // Self cast key
        if (keys.space.isDown) {
            this.scene.events.emit("pointerdown:player", this);
        }

        if (keys.esc.isDown) {
            this.scene.events.emit("keypress:esc");
        }
    }

    gameDownHandler(scene: Scene, pointer: Phaser.Input.Pointer): void {
        // The controller decides first whether the tap is a ground-spell
        // placement or a prime-cancel; consumed taps never become moves.
        if (this.casting.onGroundTap(pointer)) return;
        // A move command breaks queued approaches and casts in progress.
        this.casting.interruptForMove();
        this.dragging = true;
        this.moveToPosition(pointer);
    }

    gameMoveHandler(scene: Scene, pointer: Phaser.Input.Pointer): void {
        if (this.dragging) this.moveToPosition(pointer);
    }

    gameUpHandler(): void {
        this.dragging = false;
    }

    getWorldPointer(targetOrPoint: Phaser.Input.Pointer | Enemy) {
        return this.scene.cameras.main.getWorldPoint(targetOrPoint.x, targetOrPoint.y);
    }

    moveToPosition(targetOrPoint: Phaser.Input.Pointer | Enemy): void {
        this.moveToWorldPoint(this.getWorldPointer(targetOrPoint));
    }

    // Move to an already-resolved world-space point (the CastingController
    // stores world points, which must not go through the camera conversion
    // that moveToPosition applies to raw pointers).
    moveToWorldPoint(point: { x: number; y: number }): void {
        this.destination = { x: point.x, y: point.y };
        this.scene.physics.moveTo(this, point.x, point.y, this.stats.speed);
        this.walk();
    }

    walk(): void {
        let walk_animation =
            this.x - this.destination.x! > 0 ? "player-left-down" : "player-right-up";
        this.hero.walk(walk_animation);
    }

    atDestination(
        obj: { x: number; y: number },
        target: Destination,
        radius: number = 10
    ): boolean {
        if (target.x === null || target.y === null) return false;
        if (
            obj.x > target.x - radius &&
            obj.x < target.x + radius &&
            obj.y > target.y - radius &&
            obj.y < target.y + radius
        ) {
            return true;
        }
        return false;
    }

    healthChanged(e: { getValue(): number }): void {
        if (e.getValue() <= 0) this.scene.events.emit("player:dead");
    }

    death(): void {
        this.scene.events.off("pointerdown:game", this.gameDownHandler, this);
        this.scene.events.off("pointermove:game", this.gameMoveHandler, this);
        this.scene.events.off("pointerup:game", this.gameUpHandler, this);
        this.health.remove();
        this.resource.remove();
        this.hero.death();
        this.alive = false;
    }

    /**
     * Co-op "downed" state (epic #2): like death() but reversible — the
     * resource bars survive so revive() can restore them on wave clear.
     * Never called in single-player, where death() remains the only path.
     */
    down(): void {
        if (!this.alive) return;
        this.scene.events.off("pointerdown:game", this.gameDownHandler, this);
        this.scene.events.off("pointermove:game", this.gameMoveHandler, this);
        this.scene.events.off("pointerup:game", this.gameUpHandler, this);
        // Downed players take no more hits (enemies stop targeting them, but
        // splash damage would re-emit player:dead against a dead avatar).
        this.scene.events.off("enemy:attack", this.hit, this);
        this.casting.cancelAll();
        this.dragging = false;
        this.destination = { x: null, y: null };
        this.body.setVelocity(0);
        this.hero.death();
        this.alive = false;
    }

    /** Restores a downed player (wave cleared): full health, controls back. */
    revive(): void {
        if (this.alive) return;
        this.alive = true;
        this.health.adjustValue(this.stats.health_max || 99999);
        this.scene.events.on("pointerdown:game", this.gameDownHandler, this);
        this.scene.events.on("pointermove:game", this.gameMoveHandler, this);
        this.scene.events.on("pointerup:game", this.gameUpHandler, this);
        this.scene.events.on("enemy:attack", this.hit, this);
        this.hero.idle();
    }

    hit(power: number): void {
        const damage = Math.ceil(power * (100 / (100 + (this.stats.defence || 0))));
        this.scene.events.emit("player:attacked", this);
        const hasShield = "hasShield" in this.shield && this.shield.hasShield();
        const pool = hasShield ? this.shield : this.health;
        if (!hasShield) this.scene.events.emit("player:hit", this);
        pool.adjustValue(-damage);
    }

    idle(): void {
        this.body.setVelocity(0);
        this.hero.idle();
    }

    root(): void {
        this.body.setVelocity(0);
        this.hero.root();
    }

    goToRange(): void {
        let target = (this.scene as GameSceneLike).selected;
        if (!target) return;
        this.moveToPosition(target);
        let distance = PhaserMath.Distance.Between(target.x, target.y, this.x, this.y);
        let hit_distance = distance - 15; // TODO not 15;

        if (hit_distance <= (this.stats.range || 0)) {
            this.idle();
            this.attack_delay = null;
            if (this.attack_ready) this.attack(target);
        } else {
            if (!this.attack_delay) {
                this.attack_delay = this.scene.time.delayedCall(
                    (this.scene as GameSceneLike).global_attack_delay,
                    this.walk,
                    [],
                    this
                );
            }
        }
    }

    attack(target: Enemy): void {
        const attack_power = this.stats.attack_power || 0;
        const attack_speed = this.stats.attack_speed || 1;

        const crit = this.isCritical();
        const damage = crit ? attack_power * 1.5 : attack_power;

        if (this.attack_projectile) {
            // Ranged basic attack: the hit (and any knockback) lands on
            // impact; no melee swoosh.
            new Projectile({
                scene: this.scene,
                x: this.x,
                y: this.y - 10,
                key: this.attack_projectile.key,
                frame: this.attack_projectile.frame,
                speed: this.attack_projectile.speed,
                target,
                onImpact: (impacted) => (impacted as Enemy).hit({ power: damage, crit: crit }),
            });
        } else {
            this.weapon.swoosh();
            this.positionWeapon(target);
            target.hit({ power: damage, crit: crit });
        }

        this.attack_ready = false;
        this.swing = this.scene.time.addEvent({
            delay: attack_speed * 1000,
            callback: this.attackReady,
            callbackScope: this,
            loop: true,
        });

        this.scene.events.emit("player:attack", this);
    }

    attackReady(): void {
        this.attack_ready = true;
        if (this.swing) {
            this.swing.remove(false);
        }
    }

    isCritical(): boolean {
        const rng = Math.random() * 100; // Percentage roll up to 100.
        return rng < (this.stats.critical_chance || 0);
    }

    positionWeapon(target: Enemy): void {
        const vector = targetVector(this, target);
        // Normalised knockback values regardless of range
        const knockback = { x: vector.delta.x / vector.range, y: vector.delta.y / vector.range };
        const angle = (Math.atan2(vector.delta.y, vector.delta.x) * 180) / Math.PI;

        if (target.body && this.stats.knockback)
            target.body.setVelocity(
                knockback.x * this.stats.knockback,
                knockback.y * this.stats.knockback
            );
        this.weapon.setAngle(angle);
    }

    targetDead(enemy: { xp: number }): void {
        store.dispatch(addXP(enemy.xp));
        this.setExperience();
        // this.add(new CombatText(this.scene, {
        // 	x: 0,
        // 	y: -30,
        // 	value: `${enemy.xp} xp`,
        // 	wander: 0,
        // 	gravity: 0
        // }))
        if (!(this.scene as GameSceneLike).selected) this.idle();
    }

    setExperience(exp: number = store.getState().game.xp, count: number = 1): void {
        const xpCurve = (l: number) => l * l + l * 10;
        const next = xpCurve(count);
        const remainder = exp - next;
        if (remainder < 0) {
            store.dispatch(
                setLevel({
                    xpRemaining: exp,
                    toNextLevel: next,
                    currentLevel: count,
                })
            );
        } else {
            this.setExperience(remainder, count + 1);
        }
    }

    LevelUp(level: number): void {
        level > 1 &&
            this.add(
                new CombatText(this.scene, {
                    x: 0,
                    y: -30,
                    type: "level",
                    value: "LEVEL+",
                    crit: false,
                    wander: 0,
                    speed: 50,
                    length: 2000,
                    gravity: 50,
                })
            );
    }

    /**
     * Adjusts the player's collision box size and position
     * Useful for fine-tuning collision detection for different player sprites
     */
    setCollisionBox(height: number = 8): void {
        if (!this.body) return;

        this.body.debugBodyColor = 0x00ff00;

        const heroHeight = this.hero.getBounds().height;
        const heroWidth = this.hero.getBounds().width;
        const collisionHeight = heroHeight / 4;

        this.body.setSize(heroWidth, collisionHeight);

        this.body.setOffset(0, this.hero.getBounds().height - collisionHeight);
    }

    createAnimations(type: string): void {
        const player_animations = [
            { key: "player-idle", frames: { start: 12, end: 17 }, repeat: -1 },
            { key: "player-right-up", frames: { start: 0, end: 5 }, repeat: -1 },
            { key: "player-left-down", frames: { start: 6, end: 11 }, repeat: -1 },
            { key: "player-death", frames: { start: 18, end: 23 }, repeat: 0 },
        ];

        player_animations.forEach((animation) => {
            this.scene.anims.create({
                key: animation.key,
                frames: this.scene.anims.generateFrameNumbers(type, animation.frames),
                frameRate: 12,
                repeat: animation.repeat,
            });
        });
    }

    cleanup(): void {
        // Unsubscribe from all store subscriptions
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.subscriptions = [];

        // Release the casting controller's scene listeners and timers
        // (idempotent — it also self-cleans on scene SHUTDOWN).
        this.casting.cleanup();
        this.castBar.cleanup();

        // On scene SHUTDOWN the player container is not destroyed, so its child
        // resources' DESTROY handlers never fire — clean them up explicitly here
        // to release their store subscriptions and regen timers.
        this.health.cleanup();
        this.resource.cleanup();
        this.shield.cleanup();
    }
}

export default Player;
