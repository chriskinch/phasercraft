import Enemy from "./Enemy";
import { EnemyOptions } from "@/types/game";

class Boss extends Enemy {
    public readonly isBoss = true;

    constructor(config: EnemyOptions) {
        super(config);

        this.setScale(3);
    }
}

export default Boss;
