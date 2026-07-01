import { GameObjects, Scenes } from "phaser";
import store from "@store";
import SpellButton from "@entities/UI/SpellButton";
import Projectile from "@entities/Weapons/Projectile";
import type { ProjectileTarget } from "@entities/Weapons/Projectile";
import type {
    SpellOptions,
    TargetType,
    PlayerStats,
    TargetKind,
    SpellProjectileConfig,
} from "@/types/game";
import type Player from "@entities/Player/Player";

interface SpellValue {
    crit: boolean;
    amount: number;
}

class Spell extends GameObjects.Sprite {
    // The owning combatant. Every ability in the game is created by the Player
    // (see Player's `abilities.map(...)`), and the spell reads Player-only members
    // (resource/shield/isCritical/clearLastPrimedSpell), so the seam is a Player.
    public player!: Player;
    public cost!: { [key: string]: number };
    public typedCost: number;
    public hasAnimation: boolean;
    public enabled: boolean;
    public cooldown!: number;
    public name!: string;
    public icon_name!: string;
    public hotkey!: string;
    public slot!: number;
    public loop!: boolean;
    public cooldownDelay!: boolean;
    public cooldownDelayAll!: boolean;
    // Declarative casting metadata (assigned from the subclass defaults via
    // Object.assign). A spell with targetKind set routes button presses
    // through the player's CastingController; without it the legacy
    // prime→click event wiring below still applies.
    public targetKind?: TargetKind;
    public castRange?: number;
    public castTime?: number;
    public channelDuration?: number;
    public aoeRadius?: number;
    public projectile?: SpellProjectileConfig;
    public button!: SpellButton;
    public cooldownTimer!: Phaser.Tweens.Tween;
    public target: TargetType | undefined;
    // Holds whatever the (subclass-overridable) startAnimation() returns. The
    // base returns void and the value is never read back, so it stays untyped.
    public animation: unknown;

    constructor({ scene, x, y, key, ...config }: SpellOptions) {
        super(scene, x, y, key);
        Object.assign(this, config);

        this.typedCost = this.cost[this.player.resource.name];
        this.hasAnimation = true;
        this.enabled = false;
        // Placeholder empty function for clearing last spell
        this.player.clearLastPrimedSpell = () => {};

        this.setAnimation();
        this.button = new SpellButton({
            scene: this.scene,
            icon_name: this.icon_name,
            slot: this.slot,
            hotkey: this.hotkey,
            cooldown: this.cooldown,
            onPress: () => this.press(),
        });
        // Initial state is assumed to be off so monitor spell.
        this.monitorSpell();

        this.scene.events.on("spell:disableall", this.killSpell, this);
        this.scene.events.on("spell:enableall", this.monitorSpell, this);
        this.scene.add.existing(this).setDepth(1000).setVisible(false);

        // Lifecycle: the spell registers listeners on external emitters
        // (scene.events, the player resource, its button + the keyboard) that
        // Phaser does not remove for us. The spell GameObject is not destroyed on
        // scene SHUTDOWN (a shut-down scene may reactivate), so its scene.events
        // listeners would otherwise accumulate across runs — clean up on both
        // SHUTDOWN and an individual destroy.
        this.scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    cleanup(): void {
        // Remove listeners registered on external emitters (the spell's own
        // listeners are removed by Phaser's destroy()). Idempotent: off() is a
        // no-op when the listener is already gone, so the overlapping SHUTDOWN
        // and DESTROY paths can both run safely.
        this.scene.events.off("spell:disableall", this.killSpell, this);
        this.scene.events.off("spell:enableall", this.monitorSpell, this);
        this.scene.events.off(Scenes.Events.SHUTDOWN, this.cleanup, this);
        this.player.resource.off("change", this.onResourceChangeHandler, this);
        this.button.cleanup();
    }

    checkResource(): boolean {
        return this.typedCost <= this.player.resource.getValue();
    }

    checkCooldown(): boolean {
        return (
            !this.cooldownTimer ||
            !this.cooldownTimer?.getValue() ||
            this.cooldownTimer.getValue() === this.cooldown
        );
    }

    checkReady(): boolean {
        return this.checkResource() && this.checkCooldown();
    }

    onResourceChangeHandler(): void {
        this.checkReady() ? this.enableSpell() : this.disableSpell("resource change");
    }

    enableSpell(): void {
        if (!this.enabled) {
            this.button.setEnabled(true);
            this.button.setEvents("on");
            this.enabled = true;
        }
    }

    monitorSpell(): void {
        this.player.resource.on("change", this.onResourceChangeHandler, this);
        if (this.checkReady()) this.enableSpell();
    }

    disableSpell(from: string): void {
        if (this.enabled) {
            this.button.setEnabled(false);
            this.button.setEvents("off");
            this.setCastEvents("off");
            this.button.out();
            this.player.clearLastPrimedSpell = () => {};
            this.enabled = false;
            // A spell that just became unavailable cannot stay primed,
            // queued or mid-cast in the controller.
            this.player.casting?.notifyDisabled(this);
        }
    }

    killSpell(): void {
        this.player.resource.off("change", this.onResourceChangeHandler, this);
        this.disableSpell("kill spell");
    }

    clearSpell(): void {
        this.button.out();
        this.setCastEvents("off");
        this.button.setEvents("on");
        this.scene.events.emit("spell:cleared", this);
    }

    setCooldown(): Phaser.Tweens.Tween {
        return this.scene.tweens.addCounter({
            from: 0,
            to: this.cooldown,
            duration: this.cooldown * 1000,
            onStart: () => {
                this.button.showCooldown();
            },
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const time = this.cooldown - Math.floor(tween.getValue() ?? 0);
                this.button.setCooldownText(time);
            },
            onComplete: () => {
                this.button.hideCooldown();
                this.onResourceChangeHandler();
            },
        });
    }

    castSpell(target?: TargetType): void {
        this.target = target;
        if (this.projectile && target && typeof target === "object" && "x" in target) {
            // Effect and impact VFX land when the projectile arrives.
            this.launchProjectile(target as unknown as ProjectileTarget);
        } else {
            this.effect(target);
            // Do the animation
            this.animation = this.hasAnimation ? this.startAnimation() : null;
        }
        // Charge the player some resource
        this.player.resource.adjustValue(-this.typedCost);
        // Check if cooldown should be trigger automatically. Other wise spell must handle this.
        if (!this.cooldownDelayAll) {
            if (!this.cooldownDelay) {
                this.cooldownTimer = this.setCooldown();
            } else {
                this.killSpell();
            }
        } else {
            this.scene.events.emit("spell:disableall", this);
        }
        this.scene.events.emit("spell:cast", this);
    }

    launchProjectile(target: ProjectileTarget): void {
        if (!this.projectile) return;
        new Projectile({
            scene: this.scene,
            x: this.player.x,
            y: this.player.y - 10,
            key: this.projectile.key,
            frame: this.projectile.frame,
            speed: this.projectile.speed,
            target,
            onImpact: (impacted) => {
                this.effect(impacted as TargetType);
                this.animation = this.hasAnimation ? this.startAnimation() : null;
            },
        });
    }

    clearLastPrimedSpell(): void {
        this.player.clearLastPrimedSpell();
        this.player.clearLastPrimedSpell = () => this.clearSpell();
    }

    // Button press / hotkey entry point.
    press(): void {
        if (this.targetKind !== undefined) {
            // The guard makes targetKind non-optional, satisfying CastableSpell.
            this.player.casting.request(this as this & { targetKind: TargetKind });
        } else {
            this.setPrimed();
        }
    }

    // Visual hooks driven by the CastingController. The button stays
    // interactive while primed so pressing it again cancels the prime.
    onPrimed(): void {
        this.button.primedTint();
    }

    onPrimeCleared(): void {
        this.button.out();
    }

    setPrimed(): void {
        this.clearLastPrimedSpell();
        this.scene.events.emit("spell:primed", this);
        this.button.setEvents("off");
        this.setCastEvents("on");
        this.button.primedTint();
    }

    setCastEvents(state: "on" | "off"): void {
        // This method should be implemented by subclasses
    }

    effect(target: TargetType | undefined): void {
        // This method should be implemented by subclasses
    }

    setAnimation(): void {
        this.scene.anims.create({
            key: this.name + "-animation",
            frames: this.scene.anims.generateFrameNumbers(this.name + "-effect", {
                start: 0,
                end: 24,
            }),
            frameRate: 24,
            repeat: this.loop ? -1 : 0,
            showOnStart: true,
            hideOnComplete: true,
        });
        this.on("animationstart", this.animationStart);
        this.on("animationupdate", this.animationUpdate);
        this.on("animationcomplete", this.animationComplete);
    }

    // Holding functions
    animationStart(): void {}
    animationUpdate(): void {}
    animationComplete(): void {}

    startAnimation(): void {
        this.anims.play(this.name + "-animation");
    }

    setValue({
        base,
        key,
        reducer = (v: number) => v,
    }: {
        base: number;
        key: string;
        reducer?: (v: number) => number;
    }): SpellValue {
        const stats: PlayerStats = store.getState().game.stats;
        const statValue = stats[key];
        const power = typeof statValue === "number" ? statValue : 0;
        // Value based on base + scaled percentage of base from power + flat percent of power
        const scaled = base + base * (power / 100) + power / 10;
        // Check for crit
        const crit = this.player.isCritical();
        const total = reducer(crit ? scaled * 1.5 : scaled);
        return { crit: crit, amount: total };
    }
}

export default Spell;
