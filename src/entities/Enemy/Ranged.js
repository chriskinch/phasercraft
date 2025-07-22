import Enemy from "./Enemy"

class Ranged extends Enemy {
	constructor(config) {
		const defaults = {
            circling_radius: 170,
        }
		super({...defaults, ...config});
	}

	update() {
		super.update();

		if(this.isInCirclingDistance()) {
			if(!this.circling) this.setCircling({
				from: 0,
				to: -1,
				delay: Math.random() * 2000,
				duration: 1200,
				repeat: null,
				completeDelay: 2000 + Math.random() * 2000,
			});
		}
	}
}


export default Ranged;
