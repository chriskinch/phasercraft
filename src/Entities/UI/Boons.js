class Boons extends Phaser.GameObjects.Group {
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
        this.player.emit('boons:update', this);
    }

    removeBoon(boon) {
        this.remove(boon);
        this.player.emit('boons:update', this);
    }

    iterateStats(value, stats = this.player.stats, base = this.player.base_stats) {
        Object.keys(value).forEach(stat => {
            if (typeof value[stat] === 'object') {
                this.iterateStats(value[stat], stats[stat], base[stat]);
            }else{
                // console.log(`stat: ${stat}, function: ${value[stat]}, player: ${stats[stat]}, base: ${base[stat]}`);
                stats[stat] = value[stat](stats[stat]);
            }
        });
    }

    calculate() {
        // console.log("BEFORE: ", this.player.stats);
        // Reset stats before recalulating new list of boons. If no boon acts as reset.
        this.player.stats = JSON.parse(JSON.stringify(this.player.base_stats));
        // Loop through boons with an iterator to hit nested objects
        this.children.entries.forEach(boon => {
            this.iterateStats(boon.value);
        });
        this.player.emit('boons:calculated', this.player.stats);
        // console.log("AFTER: ", this.player.stats);
    }

}

export default Boons;
