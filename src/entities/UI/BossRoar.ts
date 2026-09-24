import { GameObjects, Scenes, type Scene, type Tweens } from "phaser";

// "ROAR!" in the direction of a boss that has just spawned (#465). The boss
// arrives off screen, so the word sits at the screen edge on the line from
// the player to it, pointing the way. Fades in rising, holds, then keeps rising
// as it fades out, and destroys itself.

export interface ScreenPoint {
    x: number;
    y: number;
}

// Gap between the word and the viewport edge.
export const ROAR_EDGE_MARGIN = 16;
// Gap above an on-screen boss's head.
export const ROAR_ABOVE_BOSS = 40;
const RISE = 10;
const FADE_IN_MS = 300;
const HOLD_MS = 2000;
const FADE_OUT_MS = 500;
// Pinned to the camera, above the HUD but below the AREA CLEARED banner.
const DEPTH = 50000;

/**
 * Where to centre the word, in screen px. If the boss is already visible (only
 * with a small debug spawn radius), just above it. Otherwise where the ray
 * from the player towards the boss meets a rect inset from the viewport edge
 * by `padding` — per axis, since the word is wider than it is tall.
 */
export function roarPosition(
    view: { width: number; height: number },
    player: ScreenPoint,
    boss: ScreenPoint,
    padding: { x: number; y: number }
): ScreenPoint {
    const on_screen = boss.x >= 0 && boss.x <= view.width && boss.y >= 0 && boss.y <= view.height;
    if (on_screen) return { x: boss.x, y: boss.y - ROAR_ABOVE_BOSS };

    const dx = boss.x - player.x;
    const dy = boss.y - player.y;
    const left = padding.x;
    const right = view.width - padding.x;
    const top = padding.y;
    const bottom = view.height - padding.y;

    // How far along the ray each inset edge is; the nearest one is hit first.
    const along = (delta: number, low: number, high: number, from: number) =>
        delta > 0 ? (high - from) / delta : delta < 0 ? (low - from) / delta : Infinity;
    const t = Math.min(along(dx, left, right, player.x), along(dy, top, bottom, player.y));

    return {
        x: Math.min(Math.max(player.x + dx * t, left), right),
        y: Math.min(Math.max(player.y + dy * t, top), bottom),
    };
}

export default class BossRoar {
    private text: GameObjects.Text | null;
    private chain: Tweens.TweenChain | null;
    private readonly scene_events: Phaser.Events.EventEmitter;

    /**
     * `player` and `boss` are screen positions; `view` is the viewport size.
     * The word is measured first so it can be inset by its own half-size and
     * never clipped by the screen edge, rise included.
     */
    constructor(
        scene: Scene,
        view: { width: number; height: number },
        player: ScreenPoint,
        boss: ScreenPoint
    ) {
        this.scene_events = scene.events;

        this.text = scene.add
            .text(0, 0, "ROAR!", {
                fontFamily: "VT323",
                fontSize: "56px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 10,
            })
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(DEPTH)
            .setAlpha(0);

        const at = roarPosition(view, player, boss, {
            x: this.text.width / 2 + ROAR_EDGE_MARGIN,
            // The word rises 2 × RISE over its life, so leave room above it.
            y: this.text.height / 2 + ROAR_EDGE_MARGIN + RISE * 2,
        });
        this.text.setPosition(at.x, at.y);

        this.chain = scene.tweens.chain({
            targets: this.text,
            tweens: [
                { alpha: 1, y: at.y - RISE, duration: FADE_IN_MS, ease: "Sine.easeOut" },
                {
                    alpha: 0,
                    y: at.y - RISE * 2,
                    delay: HOLD_MS,
                    duration: FADE_OUT_MS,
                    ease: "Sine.easeIn",
                },
            ],
            // A finished chain is destroyed by the tween manager itself, and
            // removing it from inside its own onComplete throws, so drop the
            // reference first and only clear up the text.
            onComplete: () => {
                this.chain = null;
                this.cleanup();
            },
        });

        // The display list destroys the text on SHUTDOWN, but the chain lives
        // on the tween manager, so release both explicitly either way.
        this.text.once(GameObjects.Events.DESTROY, this.cleanup, this);
        this.scene_events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    /** Stops the animation and removes the word. Idempotent. */
    cleanup(): void {
        this.scene_events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);

        const chain = this.chain;
        this.chain = null;
        chain?.remove();

        const text = this.text;
        this.text = null;
        if (text) {
            text.off(GameObjects.Events.DESTROY, this.cleanup, this);
            text.destroy();
        }
    }
}
