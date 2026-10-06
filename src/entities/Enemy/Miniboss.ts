import { log } from "console";
import Enemy from "./Enemy";
import { EnemyOptions } from "@/types/game";

// How much bigger than its base creature a miniboss is drawn. The spawner sizes
// the miniboss's footprint by it too, so a miniboss never spawns half into a tree.
export const MINIBOSS_SCALE = 3;

class Miniboss extends Enemy {
    constructor(config: EnemyOptions) {
        super(config);

        this.setScale(MINIBOSS_SCALE);
    }
}

export default Miniboss;
