import Cleric from './Cleric';
import Mage from './Mage';
import Occultist from './Occultist';
import Ranger from './Ranger';
import Warrior from './Warrior';
import type { Scene } from 'phaser';
import type { PlayerOptions } from '@/types/game';
import type Player from '@entities/Player/Player';

type PlayerConfig = {
	scene: Scene;
	x: number;
	y: number;
	immovable?: boolean;
}

const classes = {
	Cleric,
	Mage,
	Occultist,
	Ranger,
	Warrior
};
export type PlayerType = Cleric | Mage | Occultist | Ranger | Warrior;
export type PlayerName = keyof typeof classes;
class AssignClass {
	constructor(className: PlayerName, opts: PlayerConfig) {
		if (className === null || className === undefined || !(className in classes)) {
			throw new Error(`Class "${className}" does not exist.`);
		}
		return new classes[className](opts as PlayerOptions);
	}
}

export default AssignClass;