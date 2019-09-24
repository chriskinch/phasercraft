class Boons extends Phaser.GameObjects.Group {
	constructor(scene, player) {
		super(scene);
		// const { centerX, centerY } = this.scene.physics.world.bounds;
        this.player = player;
    }
    
    addBoon(boon) {
        this.add(boon);
        // console.log(this.children.entries)
        this.player.emit('boons:update', this);
    }

    removeBoon(boon) {
        this.remove(boon);
        // console.log(this.children.entries)
        this.player.emit('boons:update', this);
    }

    iterator(o) {
        Object.entries(o).forEach(([k, v]) => {
            return (typeof v === "object") ? this.iterator(o[k]) : console.log(k, v);
        })
    }

    iterateStats(value, player = this.player.stats) {
        Object.keys(value).forEach(stat => {
            if (typeof value[stat] === 'object') {
                this.iterateStats(value[stat], player[stat]);
            }else{
                // console.log(`stat: ${stat}, function: ${value[stat]}, player: ${player[stat]}`);
                player[stat] = value[stat](this.player.base_stats[stat]);
            }
        });
    }

    calculate() {
        console.log("BASE BEFORE:", this.player.base_stats);
        console.log("BEFORE:", this.player.stats);

        this.children.entries.forEach(boon => {
            this.iterateStats(boon.value);
        });

        console.log("BASE AFTER:", this.player.base_stats);
        console.log("AFTER:", this.player.stats);
    }

}

export default Boons;
