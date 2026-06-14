import StatusEffects, { StatusEffect } from "./StatusEffects";
import type Enemy from "@entities/Enemy/Enemy";

// EnemyStats has fixed keys (no index signature); banes resolve into a
// dynamic stat map, so read/write through a string-indexable view. This is a
// type-only narrowing — the runtime values are the same numeric stats.
type IndexableStats = Record<string, number | string | undefined>;

class Banes extends StatusEffects<Enemy> {
    addEffect(bane: StatusEffect): void {
        super.addEffect(bane);
    }

    calculate(banes: StatusEffect[]): void {
        // If the banes list is empy set it back to the enemies base stats.
        if (banes.length === 0) this.entity.stats = this.entity.base_stats;
        const stats = this.entity.stats as unknown as IndexableStats;
        const base_stats = this.entity.base_stats as unknown as IndexableStats;
        // Loop through banes with an iterator to hit nested objects
        banes.forEach((bane) => {
            Object.entries(this.resolveStats(bane.value, base_stats)).forEach((stat) => {
                stats[stat[0]] = (base_stats[stat[0]] as number) + stat[1];
            });
        });
    }
}

export default Banes;
