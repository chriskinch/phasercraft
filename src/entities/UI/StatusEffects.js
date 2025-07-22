import { GameObjects } from "phaser"

class StatusEffects extends GameObjects.Group {
	constructor(scene, entity) {
		super(scene);
        this.timers = {};
        this.entity = entity;
    }
    
    addEffect(effect) {
        if(this.timers[effect.name]) this.timers[effect.name].remove();

        const timer_config = {
			delay: effect.duration * 1000,
			callback: this.removeEffect,
			callbackScope: this,
			args: [effect]
		};
        this.timers[effect.name] = this.scene.time.addEvent(timer_config);
        
        this.add(effect);
        this.calculate(this.children.entries);
    }

    removeEffect(effect) {
        this.remove(effect);
        this.calculate(this.children.entries);
    }

    resolveStats(keys, stats) {
        const resolved = {}
        Object.keys(keys).forEach(key => {
            resolved[key] = (typeof keys[key] === "function") ? keys[key](stats[key]) : keys[key];
        });
        return resolved;
    }
}

export default StatusEffects;
