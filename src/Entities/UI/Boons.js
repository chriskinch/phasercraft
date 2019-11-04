import { GameObjects } from "phaser"
import store from "../../store"
import { setStats, updateStats } from "../../store/gameReducer"

class Boons extends GameObjects.Group {
	constructor(scene, player) {
		super(scene);
        this.player = player;
        this.timers = {};
    }
    
    addBoon(boon) {
        if(this.timers[boon.name]) this.timers[boon.name].remove();

        const timer_config = {
			delay: boon.duration * 1000,
			callback: this.removeBoon,
			callbackScope: this,
			args: [boon]
		};
        this.timers[boon.name] = this.scene.time.addEvent(timer_config);
        
        this.add(boon);
        this.calculate(this.children.entries);
    }

    removeBoon(boon) {
        this.remove(boon);
        this.calculate(this.children.entries);
    }

    resolveStats(keys) {
        const stats = store.getState().base_stats;
        const resolved = {}
        Object.keys(keys).forEach(key => {
            resolved[key] = (typeof keys[key] === "function") ? keys[key](stats[key]) : keys[key];
        });
        return resolved;
    }

    calculate(boons) {
        // Always start from base_stats when calculating boons.
        store.dispatch(setStats(store.getState().base_stats));
        // Loop through boons with an iterator to hit nested objects
        boons.forEach(boon => store.dispatch(updateStats(this.resolveStats(boon.value))));
    }

}

export default Boons;
