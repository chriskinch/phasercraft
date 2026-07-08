// A lightweight replicated avatar for the co-op partner (epic #2 / #391):
// rendered from presence snapshots streamed over the data channel, never
// simulated locally. No physics body, no stats, no spells, no Redux — the
// peer's client is authoritative for everything about their character; this
// entity only interpolates toward the last received position and picks the
// matching walk/idle animation.

import { GameObjects, Scene } from "phaser";
import type { PlayerName } from "./AssignClass";

interface RemotePlayerOptions {
    scene: Scene;
    x: number;
    y: number;
    character: PlayerName;
}

/** Snapshots arrive ~10Hz; smooth across roughly one interval. */
const LERP_WINDOW_MS = 100;
/** Beyond this, snap instead of gliding (e.g. the peer teleported/respawned). */
const SNAP_DISTANCE = 300;
/** Remaining distance below which the avatar is considered standing still. */
const IDLE_DISTANCE = 2;

class RemotePlayer extends GameObjects.Container {
    public readonly character: PlayerName;
    private sprite: GameObjects.Sprite;
    private target: { x: number; y: number };
    private cleaned = false;

    constructor({ scene, x, y, character }: RemotePlayerOptions) {
        super(scene, x, y);
        this.character = character;
        this.target = { x, y };

        // Class spritesheets are loaded under lowercase keys ("warrior", …) in
        // LoadScene; all classes share the same frame layout as the local
        // player's animations (see Player.createAnimations).
        const textureKey = character.toLowerCase();
        this.createAnimations(textureKey);

        this.sprite = scene.add.sprite(0, 0, textureKey);
        this.add(this.sprite);

        const label = scene.add
            .text(0, -this.sprite.height / 2 - 12, character, {
                fontFamily: "monospace",
                fontSize: "10px",
                color: "#ffffff",
            })
            .setOrigin(0.5, 1);
        this.add(label);

        this.setSize(this.sprite.width, this.sprite.height);
        scene.add.existing(this);
        this.sprite.play(this.animKey(textureKey, "idle"));

        // Lifecycle discipline: cleanup on destroy; the owner (CoopPresence)
        // destroys this entity on scene shutdown and on disconnect.
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    private animKey(textureKey: string, name: string): string {
        // Namespaced per class so a Warrior host and Mage guest never collide
        // with each other's (or the local player's) animation registrations.
        return `coop-${textureKey}-${name}`;
    }

    private createAnimations(textureKey: string): void {
        // Same frame ranges as the local player (Player.createAnimations).
        const animations = [
            { name: "idle", frames: { start: 12, end: 17 }, repeat: -1 },
            { name: "right-up", frames: { start: 0, end: 5 }, repeat: -1 },
            { name: "left-down", frames: { start: 6, end: 11 }, repeat: -1 },
        ];
        animations.forEach(({ name, frames, repeat }) => {
            const key = this.animKey(textureKey, name);
            if (!this.scene.anims.exists(key)) {
                this.scene.anims.create({
                    key,
                    frames: this.scene.anims.generateFrameNumbers(textureKey, frames),
                    frameRate: 12,
                    repeat,
                });
            }
        });
    }

    /** Feeds the latest presence snapshot; update() glides toward it. */
    setTargetPosition(x: number, y: number): void {
        this.target = { x, y };
    }

    update(time: number, delta: number): void {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.hypot(dx, dy);
        const textureKey = this.character.toLowerCase();

        if (distance > SNAP_DISTANCE) {
            this.setPosition(this.target.x, this.target.y);
        } else if (distance > IDLE_DISTANCE) {
            const t = Math.min(1, delta / LERP_WINDOW_MS);
            this.setPosition(this.x + dx * t, this.y + dy * t);
            this.sprite.play(this.animKey(textureKey, dx < 0 ? "left-down" : "right-up"), true);
        } else {
            this.sprite.play(this.animKey(textureKey, "idle"), true);
        }

        // Same y-based depth sorting as the local player.
        this.setDepth(this.y);
    }

    cleanup(): void {
        if (this.cleaned) return;
        this.cleaned = true;
        // Children (sprite/label) are destroyed with the container; the class
        // animations stay registered on the scene's anim manager by design —
        // they are shared and idempotently re-created.
    }
}

export default RemotePlayer;
