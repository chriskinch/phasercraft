// Guest-side replicated enemy (epic #2, host-authoritative track). Rendered
// from host snapshots — never simulated locally: no AI, no physics body, no
// loot table. It mimics the parts of Enemy's surface the guest's combat code
// touches so the existing player seams keep working unchanged:
//   - lives in scene.enemies / scene.active_enemies (spell range scans),
//   - selectable via pointerdown (auto-attack targeting, scene.selected),
//   - `hit({power, crit})` — forwards the damage to the host instead of
//     mutating health; authoritative hp comes back in the next snapshot,
//   - `alive` / `xp` for the shared death path.

import { GameObjects, Geom, Scene, Math as PhaserMath, TintModes } from "phaser";
import type { GameSceneLike } from "@/types/scene";

interface RemoteEnemyOptions {
    scene: Scene;
    id: string;
    /** Enemy texture/type key ("baby-ghoul", …) — anims are global per key. */
    key: string;
    x: number;
    y: number;
    maxHealth: number;
    /** Called when the local player damages this enemy. */
    onHit: (id: string, power: number, crit: boolean) => void;
}

interface HitParams {
    power: number;
    type?: string;
    crit?: boolean;
}

/** Snapshots arrive ~10Hz; smooth across roughly one interval. */
const LERP_WINDOW_MS = 100;
/** Beyond this, snap instead of gliding (spawn drops, knockback bursts). */
const SNAP_DISTANCE = 200;

class RemoteEnemy extends GameObjects.Container {
    public readonly id: string;
    public readonly key: string;
    public alive = true;
    /** Set from the host's enemyDead message before the death path runs. */
    public xp = 0;
    public selected = false;
    private sprite: GameObjects.Sprite;
    private healthBar: GameObjects.Graphics;
    private selectedRing: GameObjects.Graphics;
    private target: { x: number; y: number };
    private hp: number;
    private readonly maxHp: number;
    private readonly onHit: (id: string, power: number, crit: boolean) => void;
    private cleaned = false;

    constructor({ scene, id, key, x, y, maxHealth, onHit }: RemoteEnemyOptions) {
        super(scene, x, y);
        this.id = id;
        this.key = key;
        this.onHit = onHit;
        this.target = { x, y };
        this.hp = maxHealth;
        this.maxHp = maxHealth;

        this.sprite = scene.add.sprite(0, 0, key);
        this.add(this.sprite);
        this.setSize(this.sprite.width, this.sprite.height);

        this.selectedRing = this.drawSelectedRing();
        this.add(this.selectedRing);

        this.healthBar = scene.add.graphics();
        this.add(this.healthBar);
        this.redrawHealthBar();

        scene.add.existing(this);
        this.sprite.play(`${key}-idle`, true);

        // Same interactive circle (and 14px offset compensation) as Enemy.
        this.setInteractive(new Geom.Circle(14, 14, 15), Geom.Circle.Contains);
        this.on("pointerdown", () => {
            this.scene.events.emit("pointerdown:enemy", this);
            this.select();
        });
        // Mirror Enemy's deselect wiring so ground taps clear the target.
        this.scene.events.on("pointerdown:game", this.deselect, this);
        this.scene.events.on("pointerdown:enemy", this.deselect, this);

        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    /** Applies the latest host snapshot. */
    applySnapshot(x: number, y: number, hp: number): void {
        this.target = { x, y };
        if (hp !== this.hp) {
            this.hp = hp;
            this.redrawHealthBar();
        }
    }

    /**
     * Local damage → forwarded to the host (which owns the real health).
     * Same signature as Enemy.hit so the player/spell call sites don't care
     * which one they hit.
     */
    hit({ power, crit = false }: HitParams): void {
        if (!this.alive) return;
        this.onHit(this.id, power, crit);
        // Brief white flash as local feedback while the authoritative hp
        // round-trips (Phaser 4 fill-tint form: setTint + FILL tint mode).
        this.sprite.setTint(0xffffff).setTintMode(TintModes.FILL);
        this.scene.time.delayedCall(80, () => {
            if (this.sprite.active) this.sprite.clearTint();
        });
    }

    /** Host said this enemy died: play the death, award nothing here. */
    die(xp: number): void {
        if (!this.alive) return;
        this.alive = false;
        this.xp = xp;
        this.deselect();
        this.healthBar.clear();
        if (this.input) this.input.enabled = false;
        this.sprite.play(`${this.key}-death`);
        (this.scene as GameSceneLike).enemies.remove(this);
        (this.scene as GameSceneLike).active_enemies.remove(this);
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            ease: "Power1",
            duration: 10000,
            onComplete: () => this.destroy(),
        });
    }

    update(time: number, delta: number): void {
        if (!this.alive) return;
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance > SNAP_DISTANCE) {
            this.setPosition(this.target.x, this.target.y);
        } else if (distance > 1) {
            const t = Math.min(1, delta / LERP_WINDOW_MS);
            this.setPosition(this.x + dx * t, this.y + dy * t);
            this.sprite.play(`${this.key}-${dx < 0 ? "left-down" : "right-up"}`, true);
        } else {
            this.sprite.play(`${this.key}-idle`, true);
        }
        this.setDepth(this.y);
    }

    select(): void {
        this.selectedRing.visible = true;
        this.selected = true;
        // The scene-wide selected slot drives the player's auto-attack; a
        // RemoteEnemy deliberately satisfies the same seam as Enemy here.
        (this.scene as GameSceneLike).selected = this as unknown as GameSceneLike["selected"];
    }

    deselect(): void {
        if (!this.selected) return;
        this.selectedRing.visible = false;
        this.selected = false;
        (this.scene as GameSceneLike).selected = null;
    }

    private drawSelectedRing(): GameObjects.Graphics {
        const size = 5;
        const graphics = this.scene.add.graphics();
        graphics.scaleY = 0.5;
        graphics.lineStyle(4, 0xb93f3c, 0.9);
        graphics.strokeCircle(0, this.height / 2 + size, this.width / 2 + size);
        graphics.setDepth(10);
        graphics.visible = false;
        return graphics;
    }

    private redrawHealthBar(): void {
        const width = 28;
        const ratio = PhaserMath.Clamp(this.hp / this.maxHp, 0, 1);
        this.healthBar.clear();
        this.healthBar.fillStyle(0x000000, 0.6);
        this.healthBar.fillRect(-width / 2, -this.height / 2 - 8, width, 4);
        this.healthBar.fillStyle(0xb93f3c, 1);
        this.healthBar.fillRect(-width / 2, -this.height / 2 - 8, width * ratio, 4);
    }

    cleanup(): void {
        if (this.cleaned) return;
        this.cleaned = true;
        this.deselect();
        this.scene.events.off("pointerdown:game", this.deselect, this);
        this.scene.events.off("pointerdown:enemy", this.deselect, this);
    }
}

export default RemoteEnemy;
