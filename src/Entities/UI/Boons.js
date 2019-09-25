class Boons extends Phaser.GameObjects.Group {
	constructor(scene, player) {
		super(scene);
        this.player = player;
    }
    
    addBoon(boon) {
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
                console.log(`stat: ${stat}, function: ${value[stat]}, player: ${stats[stat]}, base: ${base[stat]}`);
                stats[stat] = value[stat](base[stat]);
            }
        });
    }

    calculate() {
        console.log("BASE BEFORE:", this.player.base_stats);
        console.log("BEFORE:", this.player.stats);

        // If there are no boons in the queue set stats to base
        if(this.children.entries.length === 0) this.player.stats = { ...this.player.base_stats };

        // Loop through boons with an iterator to hit nested objects
        this.children.entries.forEach(boon => {
            this.iterateStats(boon.value);
        });

        console.log("BASE AFTER:", this.player.base_stats);
        console.log("AFTER:", this.player.stats);
    }

}

export default Boons;
