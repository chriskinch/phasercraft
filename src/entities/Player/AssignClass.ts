import Cleric from "./Cleric";
import Mage from "./Mage";
import Occultist from "./Occultist";
import Ranger from "./Ranger";
import Warrior from "./Warrior";
import type { Scene } from "phaser";
import type { PlayerOptions } from "@/types/game";
import type { SpellType } from "@entities/Spells/AssignSpell";
import type Player from "@entities/Player/Player";

type PlayerConfig = {
    scene: Scene;
    x: number;
    y: number;
    immovable?: boolean;
    // Overrides the class's default abilities. The town passes `[]` so the
    // non-combat hub spawns no spells (and no ability buttons).
    abilities?: SpellType[];
};

const classes = {
    Cleric,
    Mage,
    Occultist,
    Ranger,
    Warrior,
};
export type PlayerType = Cleric | Mage | Occultist | Ranger | Warrior;
export type PlayerName = keyof typeof classes;
/** All playable class names — the runtime counterpart of `PlayerName`. */
export const playerNames = Object.keys(classes) as PlayerName[];
class AssignClass {
    constructor(className: PlayerName, opts: PlayerConfig) {
        if (className === null || className === undefined || !(className in classes)) {
            throw new Error(`Class "${className}" does not exist.`);
        }
        return new classes[className](opts as PlayerOptions);
    }
}

export default AssignClass;
