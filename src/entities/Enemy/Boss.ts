import { log } from "console";
import Enemy from "./Enemy";
import { EnemyClassConfig } from "@/types/game";


class Boss extends Enemy {
	constructor(config: EnemyClassConfig) {
		super(config);

		console.log("Boss created with config:", config);
		
		this.setScale(3);
	}
}

export default Boss;