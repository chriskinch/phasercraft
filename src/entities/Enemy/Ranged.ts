import Enemy from "./Enemy";
import type { EnemyOptions } from "@/types/game";

// Ranged enemies back off once the player is inside their circling radius, so
// that radius must sit inside their attack range or they kite just out of
// reach and never fire. Derived from `range` so the two can't drift apart;
// 0.85 keeps the original imp spacing (170 circling / 200 range).
export const RANGED_CIRCLING_RATIO = 0.85;

export function rangedCirclingRadius(range: number): number {
    return range * RANGED_CIRCLING_RATIO;
}

class Ranged extends Enemy {
    constructor(config: EnemyOptions) {
        super({ ...config, circling_radius: rangedCirclingRadius(config.attributes.range) });
    }

    update(time?: number, delta?: number): void {
        super.update(time ?? 0, delta ?? 0);

        if (this.isInCirclingDistance()) {
            if (!this.circling)
                this.setCircling({
                    from: 0,
                    to: -1,
                    delay: Math.random() * 2000,
                    duration: 1200,
                    repeat: -1,
                    completeDelay: 2000 + Math.random() * 2000,
                });
        }
    }
}

export default Ranged;
