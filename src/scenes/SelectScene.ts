import { Scene } from 'phaser';
import store from "@store";
import type { PlayerName } from "@entities/Player/AssignClass";

export interface GameSceneConfig {
	type?: PlayerName;
}

export default class SelectScene extends Scene {
	private config: GameSceneConfig;

	constructor() {
		super({
			key: 'SelectScene'
		});

		this.config = {};
	}

	create(): void {
		// Save the returned unsub function and call one first action.
		// Looks like and infinite loop but actually acts like a "once" event.
		const unsubscribe = store.subscribe(() => {
			if(store.getState().game.character) {
				this.chooseCharacter();
				unsubscribe();
			}
		});
	}

	chooseCharacter(): void {
		const character = store.getState().game.character;
		if(!character) throw Error("No character set!")
		this.config.type = character;
		this.scene.start('GameScene', this.config);
	}
}