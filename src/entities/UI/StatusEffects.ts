import { GameObjects, Scene, Time } from "phaser";

// A stat modifier is either a flat value or a function of the matching base
// stat (e.g. `(bs) => bs * 0.2`). resolveStats() collapses these against a
// base-stats object into plain numbers.
export type EffectValue = number | ((baseStat: number) => number);

// The shape StatusEffects relies on from the spells it tracks. Effects are
// Phaser GameObjects (Spell extends GameObjects.Sprite) carrying the extra
// status-effect metadata, so the tracked type is the intersection.
export interface StatusEffect extends GameObjects.GameObject {
    name: string;
    duration: number;
    value: Record<string, EffectValue>;
}

// The owning entity is the Player (for Boons) or an Enemy (for Banes); it is
// kept generic so each subclass can read its own concrete stats shape. Boons
// ignore the entity entirely in favour of the store; Banes read its stats.
abstract class StatusEffects<TEntity = unknown> extends GameObjects.Group {
    public timers: Record<string, Time.TimerEvent>;
    public entity: TEntity;

    constructor(scene: Scene, entity: TEntity) {
        super(scene);
        this.timers = {};
        this.entity = entity;
    }

    addEffect(effect: StatusEffect): void {
        if (this.timers[effect.name]) this.timers[effect.name].remove();

        const timer_config = {
            delay: effect.duration * 1000,
            callback: this.removeEffect,
            callbackScope: this,
            args: [effect],
        };
        this.timers[effect.name] = this.scene.time.addEvent(timer_config);

        this.add(effect);
        this.calculate(this.children.entries as StatusEffect[]);
    }

    removeEffect(effect: StatusEffect): void {
        this.remove(effect);
        this.calculate(this.children.entries as StatusEffect[]);
    }

    resolveStats(
        keys: Record<string, EffectValue>,
        stats: Record<string, number | string | undefined>
    ): Record<string, number> {
        const resolved: Record<string, number> = {};
        Object.keys(keys).forEach((key) => {
            const entry = keys[key];
            resolved[key] = typeof entry === "function" ? entry(stats[key] as number) : entry;
        });
        return resolved;
    }

    // Defined by the Banes/Boons subclasses; the base class never modifies
    // stats itself (it is abstract and is never instantiated directly).
    abstract calculate(effects: StatusEffect[]): void;
}

export default StatusEffects;
