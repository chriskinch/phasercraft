import Enemy from "./Enemy"

class Boss extends Enemy {
	constructor(config) {
        super(config);
        
        this.setScale(3);
    }
}

export default Boss;
