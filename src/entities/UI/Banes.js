import StatusEffects from "./StatusEffects"

class Banes extends StatusEffects {
    addEffect(bane) {
        super.addEffect(bane);
    }

    calculate(banes) {
        // If the banes list is empy set it back to the enemies base stats.
        if(banes.length === 0) this.entity.stats = this.entity.base_stats;
        // Loop through banes with an iterator to hit nested objects
        banes.forEach(bane => {
            Object.entries(this.resolveStats(bane.value, this.entity.base_stats)).forEach(stat => {
                this.entity.stats[stat[0]] = this.entity.base_stats[stat[0]] + stat[1];
            })
        });
    }

}

export default Banes;
