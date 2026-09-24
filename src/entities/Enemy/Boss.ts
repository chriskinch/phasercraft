import { log } from "console";
import Enemy from "./Enemy";
import { EnemyOptions } from "@/types/game";

// How much bigger than its base creature a boss is drawn. The spawner sizes
// the boss's footprint by it too, so a boss never spawns half into a tree.
export const BOSS_SCALE = 3;

class Boss extends Enemy {
    constructor(config: EnemyOptions) {
        super(config);

        this.setScale(BOSS_SCALE);
    }
}

export default Boss;
