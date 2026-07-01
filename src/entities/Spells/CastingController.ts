import { Math as PhaserMath, Scenes } from "phaser";
import TargetReticle from "@entities/UI/TargetReticle";
import type { TargetKind, TargetType } from "@/types/game";
import type { GameSceneLike } from "@/types/scene";

// The subset of Spell the controller drives. Kept narrow so tests can fake a
// spell without booting Phaser, and so the controller never reaches into
// button/VFX internals.
export interface CastableSpell {
    name: string;
    targetKind: TargetKind;
    castRange?: number;
    castTime?: number;
    channelDuration?: number;
    aoeRadius?: number;
    checkReady(): boolean;
    castSpell(target?: TargetType): void;
    // Visual hooks the owner maps to its button tints.
    onPrimed?(): void;
    onPrimeCleared?(): void;
    // A channelled spell stops its ongoing effect here when broken early.
    interruptChannel?(): void;
}

// The subset of Player the controller needs for approach/root behaviour.
export interface CasterLike {
    x: number;
    y: number;
    alive: boolean;
    idle(): void;
    moveToWorldPoint(point: { x: number; y: number }): void;
}

// Anything a cast can land on: an enemy/player (which expose `alive`) or a
// bare ground point.
interface CastTarget {
    x: number;
    y: number;
    alive?: boolean;
}

interface PendingCast {
    spell: CastableSpell;
    target: CastTarget;
}

interface ActiveCast extends PendingCast {
    phase: "windup" | "channel";
    timer: Phaser.Time.TimerEvent;
}

export type CastingState = "idle" | "primed" | "approaching" | "casting";

interface CastingControllerOptions {
    scene: GameSceneLike;
    player: CasterLike;
}

// Central owner of the cast flow for one player. Replaces the per-spell
// input wiring (setCastEvents) and the clearLastPrimedSpell function-swap
// with one explicit state machine:
//
//   idle → (button press) → primed | approaching | casting → idle
//
// - "none"/"self" spells cast immediately on button press.
// - "enemy" spells cast at the selected enemy, or prime and commit on the
//   next enemy tap; taps on the floor/player clear the prime.
// - "ground" spells prime and place at the next world tap (tap-to-place).
// - Out-of-range commits queue as "approaching": the controller walks the
//   player toward the target each update() and casts on arrival.
// - Wind-ups (castTime) and channels (channelDuration) hold the "casting"
//   state; a move command, taking a hit, or another cast request interrupts.
//
// Resource charging and cooldowns stay inside Spell.castSpell(), so a
// wind-up interrupted before completion costs nothing.
class CastingController {
    private scene: GameSceneLike;
    private player: CasterLike;
    private primed: CastableSpell | null = null;
    private pending: PendingCast | null = null;
    private casting: ActiveCast | null = null;
    // Placement ring for ground spells. Optional so the prototype-fake tests
    // (which skip the constructor) exercise the flow without a display list.
    private reticle?: TargetReticle;

    constructor({ scene, player }: CastingControllerOptions) {
        this.scene = scene;
        this.player = player;
        this.reticle = new TargetReticle(scene);

        this.scene.events.on("pointerdown:enemy", this.onEnemyTap, this);
        this.scene.events.on("pointerdown:player", this.onPlayerTap, this);
        this.scene.events.on("keypress:esc", this.cancelAll, this);
        // Actual damage (shield absorbs don't emit player:hit) breaks casts.
        this.scene.events.on("player:hit", this.onHit, this);
        // The controller is not a GameObject, so SHUTDOWN is its only
        // lifecycle signal; Player.cleanup() also calls cleanup() (idempotent).
        this.scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
    }

    getState(): CastingState {
        if (this.casting) return "casting";
        if (this.pending) return "approaching";
        if (this.primed) return "primed";
        return "idle";
    }

    isPrimed(): boolean {
        return this.primed !== null;
    }

    isCasting(): boolean {
        return this.casting !== null;
    }

    // Entry point from a SpellButton press (or hotkey).
    request(spell: CastableSpell): void {
        // Pressing the button of whatever is in flight is a plain cancel;
        // pressing a different button cancels it and starts the new request.
        if (this.casting) {
            const same = this.casting.spell === spell;
            this.interruptCast();
            if (same) return;
        }
        if (this.pending) {
            const same = this.pending.spell === spell;
            this.cancelPending();
            if (same) return;
        }
        if (this.primed) {
            const same = this.primed === spell;
            this.clearPrime();
            if (same) return;
        }

        if (!spell.checkReady()) return;

        switch (spell.targetKind) {
            case "none":
            case "self":
                this.commit(spell, this.player);
                break;
            case "enemy": {
                const selected = this.scene.selected;
                if (selected && selected.alive) {
                    this.commit(spell, selected);
                } else {
                    this.prime(spell);
                }
                break;
            }
            case "ground":
                this.prime(spell);
                break;
        }
    }

    // World tap routing, delegated from Player.gameDownHandler so exactly one
    // listener decides whether the tap is a placement/cancel or a move.
    // Returns true when the tap was consumed and must not become a move.
    onGroundTap(pointer: { x: number; y: number }): boolean {
        if (!this.primed) return false;
        const spell = this.primed;
        if (spell.targetKind === "ground") {
            // Leaving primed for the commit path: no "cleared" event — the
            // cast is still in flight and fire()/cancel restores visuals.
            this.primed = null;
            const point = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
            this.reticle?.placeAt(point);
            this.commit(spell, { x: point.x, y: point.y });
        } else {
            // Tapping the floor with a primed targeted spell deselects it.
            this.clearPrime();
        }
        return true;
    }

    onPlayerTap(): void {
        if (!this.primed) return;
        const spell = this.primed;
        if (spell.targetKind === "ground") {
            this.primed = null;
            const point = { x: this.player.x, y: this.player.y };
            this.reticle?.placeAt(point);
            this.commit(spell, point);
        } else {
            this.clearPrime();
        }
    }

    onEnemyTap(enemy: CastTarget): void {
        if (this.primed) {
            const spell = this.primed;
            if (spell.targetKind === "enemy") {
                this.primed = null;
                this.commit(spell, enemy);
            } else if (spell.targetKind === "ground") {
                this.primed = null;
                const point = { x: enemy.x, y: enemy.y };
                this.reticle?.placeAt(point);
                this.commit(spell, point);
            } else {
                this.clearPrime();
            }
            return;
        }
        // Tapping another enemy while walking into range retargets the
        // queued cast rather than abandoning it.
        if (this.pending && this.pending.spell.targetKind === "enemy") {
            this.pending = { spell: this.pending.spell, target: enemy };
        }
    }

    // A user move command cancels a queued approach and breaks casts.
    interruptForMove(): void {
        this.cancelPending();
        this.interruptCast();
    }

    // Taking actual damage breaks wind-ups and channels (approach is fine).
    onHit(): void {
        this.interruptCast();
    }

    // A spell that became unavailable (resource drained, disableall) cannot
    // stay primed/queued/casting. Identity comparison only, so legacy spells
    // (no targetKind yet) can call this unconditionally from their disable
    // path — they are never in the controller's state.
    notifyDisabled(spell: object): void {
        if (this.primed === spell) this.clearPrime();
        if (this.pending?.spell === spell) this.cancelPending();
        if (this.casting?.spell === spell) this.interruptCast();
    }

    cancelAll(): void {
        this.clearPrime();
        this.cancelPending();
        this.interruptCast();
    }

    // Drives the approach; called from Player.update every frame.
    update(): void {
        if (!this.pending) return;
        const { spell, target } = this.pending;
        if (target.alive === false) {
            this.cancelPending();
            return;
        }
        const distance = PhaserMath.Distance.Between(
            this.player.x,
            this.player.y,
            target.x,
            target.y
        );
        if (distance <= (spell.castRange ?? Infinity)) {
            this.pending = null;
            this.player.idle();
            this.startCast(spell, target);
        } else {
            this.player.moveToWorldPoint(target);
        }
    }

    private prime(spell: CastableSpell): void {
        this.primed = spell;
        if (spell.targetKind === "ground") this.reticle?.show(spell.aoeRadius);
        spell.onPrimed?.();
        this.scene.events.emit("spell:primed", spell);
    }

    private clearPrime(): void {
        if (!this.primed) return;
        const spell = this.primed;
        this.primed = null;
        this.reticle?.hide();
        spell.onPrimeCleared?.();
        this.scene.events.emit("spell:cleared", spell);
    }

    private cancelPending(): void {
        if (!this.pending) return;
        const { spell } = this.pending;
        this.pending = null;
        spell.onPrimeCleared?.();
        this.scene.events.emit("spell:cleared", spell);
    }

    private commit(spell: CastableSpell, target: CastTarget): void {
        if (spell.castRange !== undefined) {
            const distance = PhaserMath.Distance.Between(
                this.player.x,
                this.player.y,
                target.x,
                target.y
            );
            if (distance > spell.castRange) {
                this.pending = { spell, target };
                return;
            }
        }
        this.startCast(spell, target);
    }

    private startCast(spell: CastableSpell, target: CastTarget): void {
        const castTime = spell.castTime ?? 0;
        if (castTime > 0) {
            // Root for the wind-up; the cast completes via the scene clock
            // (pause-aware) unless interrupted first.
            this.player.idle();
            this.casting = {
                spell,
                target,
                phase: "windup",
                timer: this.scene.time.delayedCall(castTime * 1000, this.completeCast, [], this),
            };
            this.scene.events.emit("spell:castbar:start", { spell, duration: castTime });
        } else {
            this.fire(spell, target);
        }
    }

    private completeCast(): void {
        if (!this.casting) return;
        const { spell, target } = this.casting;
        this.casting = null;
        // The wind-up can outlive its target or its resource; failing here
        // costs nothing because castSpell never runs.
        if (target.alive === false || !spell.checkReady()) {
            this.scene.events.emit("spell:castbar:stop", { spell, completed: false });
            this.scene.events.emit("spell:interrupted", spell);
            spell.onPrimeCleared?.();
            return;
        }
        this.scene.events.emit("spell:castbar:stop", { spell, completed: true });
        this.fire(spell, target);
    }

    private fire(spell: CastableSpell, target: CastTarget): void {
        spell.onPrimeCleared?.();
        // Targetless (PBAoE/aura) effects read the caster themselves; passing
        // the player would hit subclass effect(target) branches meant for
        // enemies (e.g. Multishot's per-enemy damage guard).
        spell.castSpell(spell.targetKind === "none" ? undefined : (target as TargetType));
        const channel = spell.channelDuration ?? 0;
        if (channel > 0) {
            // castSpell started the channel (cost charged up-front); hold the
            // casting state so movement/hits/new casts can break it.
            this.player.idle();
            this.casting = {
                spell,
                target,
                phase: "channel",
                timer: this.scene.time.delayedCall(channel * 1000, this.completeChannel, [], this),
            };
            this.scene.events.emit("spell:castbar:start", { spell, duration: channel });
        }
    }

    private completeChannel(): void {
        if (!this.casting) return;
        const { spell } = this.casting;
        this.casting = null;
        this.scene.events.emit("spell:castbar:stop", { spell, completed: true });
    }

    private interruptCast(): void {
        if (!this.casting) return;
        const { spell, phase, timer } = this.casting;
        this.casting = null;
        timer.remove(false);
        if (phase === "channel") spell.interruptChannel?.();
        spell.onPrimeCleared?.();
        this.scene.events.emit("spell:castbar:stop", { spell, completed: false });
        this.scene.events.emit("spell:interrupted", spell);
    }

    cleanup(): void {
        // Idempotent: off() and remove() are no-ops when already gone; the
        // SHUTDOWN self-subscription and Player.cleanup() can both land here.
        this.scene.events.off("pointerdown:enemy", this.onEnemyTap, this);
        this.scene.events.off("pointerdown:player", this.onPlayerTap, this);
        this.scene.events.off("keypress:esc", this.cancelAll, this);
        this.scene.events.off("player:hit", this.onHit, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        if (this.casting) {
            this.casting.timer.remove(false);
            this.casting = null;
        }
        this.pending = null;
        this.primed = null;
        this.reticle?.cleanup();
    }
}

export default CastingController;
