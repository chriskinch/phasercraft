import { GameObjects, Scene } from "phaser";
import store from "@store";
import { setStats, setBaseStats } from "@store/gameReducer";
import pick from "lodash/pick";
import mapStateToData from "@helpers/mapStateToData";
import type { ResourceStats } from "@/types/game";

export interface ResourceOptions {
    scene: Scene;
    x: number;
    y: number;
    container: GameObjects.Container;
    [key: string]: unknown;
}

interface DrawBarOptions {
    type: string;
    colour: number;
    width: number;
    height: number;
    depth: number;
}

class Resource extends GameObjects.Sprite {
    public container: GameObjects.Container;
    public name: string;
    public category: string;
    public colour: number;
    public resources: Record<string, ResourceStats>;
    public stats: ResourceStats;
    public graphics: { [key: string]: GameObjects.Graphics };
    public tick: Phaser.Time.TimerEvent;
    private subscriptions: (() => void)[] = [];

    constructor(config: ResourceOptions) {
        super(config.scene, config.x, config.y, "resource-frame");
        config.scene.add.existing(this);

        this.container = config.container;
        this.name = config.name as string;
        this.category = this.regenType(this.name);
        this.colour = config.colour as number;

        this.resources = pick(config, this.selectKeys("resource")) as Record<string, ResourceStats>;

        this.stats = {
            max: config[`${this.category}_max` as keyof ResourceOptions] as number,
            value: config[`${this.category}_value` as keyof ResourceOptions] as number,
            regen_rate: config[`${this.category}_regen_rate` as keyof ResourceOptions] as number,
            regen_value: config[`${this.category}_regen_value` as keyof ResourceOptions] as number,
        };

        if (this.container.name === "player") {
            // Only dispatch if we have valid stats to set
            store.dispatch(setStats(this.resources));
            store.dispatch(setBaseStats(this.resources));

            // console.log(this.selectKeys(this.category))
            this.selectKeys(this.category).forEach((key) => {
                this.subscriptions.push(
                    mapStateToData(
                        `stats.${key}`,
                        (stat: unknown) => {
                            if (typeof stat === "number") {
                                this.stats[this.normaliseStat(key) as keyof ResourceStats] = stat;
                            }
                        },
                        { init: false }
                    )
                );
            });
        }

        this.setOrigin(0, 0).setDepth(1000);

        this.graphics = {};
        this.graphics.background = this.drawBar({
            type: "background",
            colour: 0x111111,
            width: this.width,
            height: this.height,
            depth: 998,
        });
        this.container.add(this.graphics.background);

        this.graphics.current = this.drawBar({
            type: "current",
            colour: this.colour,
            width: this.width,
            height: this.height,
            depth: 999,
        });
        this.container.add(this.graphics.current);

        this.graphics.current.scaleX = this.resourcePercent();
        // Regeneration timer starts paused so that players and enemies both have it.
        this.tick = this.setRegenerationRate();
        // If regen_rate is 0 delay is 0 (very fast) but timer won't unpause.
        if (this.stats.regen_rate > 0) this.tick.paused = false;

        // Lifecycle: store subscriptions (RxJS) and the regen timer outlive a
        // plain GameObject destroy, so clean them up when this resource (or its
        // parent container, e.g. an enemy on death) is destroyed. Scene SHUTDOWN
        // for the player goes through Player.cleanup(), which also calls this.
        this.once(GameObjects.Events.DESTROY, this.cleanup, this);
    }

    selectKeys(prefix: string): string[] {
        return ["max", "value", "regen_value", "regen_rate"].map((key) => `${prefix}_${key}`);
    }

    setValue(new_value: number): void {
        if (new_value > this.stats.max) {
            this.stats.value = this.stats.max;
        } else if (new_value < 0) {
            this.stats.value = 0;
        } else {
            this.stats.value = Math.ceil(new_value);
        }
        this.graphics.current.scaleX = this.resourcePercent();

        this.stats.missing = this.stats.max - this.stats.value;

        this.emit("change", this);
    }

    adjustValue(adj: number): void {
        this.setValue(this.stats.value + adj);
    }

    getValue(): number {
        return this.stats.value;
    }

    resourcePercent(): number {
        return this.stats.value > 0 ? this.stats.value / this.stats.max : 0;
    }

    drawBar(opt: DrawBarOptions): GameObjects.Graphics {
        const { colour, width, height, depth } = opt;
        let graphics = this.scene.add.graphics();
        graphics.fillStyle(colour, 1);
        graphics.fillRect(0, 0, width, height);
        graphics.setDepth(depth);
        graphics.x = this.x;
        graphics.y = this.y;

        return graphics;
    }

    lockGraphicsXY(): void {
        for (let graphic in this.graphics) {
            this.graphics[graphic].x = this.container.x + this.x;
            this.graphics[graphic].y = this.container.y + this.y;
        }
    }

    regenerate(): void {
        if (this.stats.regen_rate > 0 && this.stats.value < this.stats.max) {
            this.adjustValue(this.stats.regen_value);
        }
    }

    regenType(type: string): string {
        const t = type === "health" ? "health" : type === "shield" ? "shield" : "resource";
        return t;
    }

    setRegen(): void {
        // Set the scale of the timer controlling regen rather than deleting and remaking
        const scale = this.tick ? this.tick.delay / (this.stats.regen_rate * 1000) : undefined;
        if (scale) this.tick.timeScale = scale;
    }

    normaliseStat(key: string): string {
        return key.split("_").slice(1).join("_");
    }

    setRegenerationRate(): Phaser.Time.TimerEvent {
        return this.scene.time.addEvent({
            delay: 1 + this.stats.regen_rate * 1000,
            callback: this.doTick,
            callbackScope: this,
            loop: true,
            paused: true,
        });
    }

    doTick(): void {
        this.regenerate();
    }

    cleanup(): void {
        // Unsubscribe RxJS/store subscriptions (player resources only register
        // them, but this is a no-op otherwise) and stop the regen timer so it
        // doesn't keep firing against a destroyed sprite. Idempotent: safe to
        // call from both the DESTROY handler and a parent's cleanup().
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.subscriptions = [];
        if (this.tick) this.tick.remove();
    }

    remove(): void {
        for (let graphic in this.graphics) {
            this.graphics[graphic].clear();
        }
        this.destroy();
    }
}

export default Resource;
