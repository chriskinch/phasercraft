import { Scene } from 'phaser';
import store from "@store";

interface Config {
	type?: string | null;
}

export default class SelectScene extends Scene {
	private config: Config;

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
		this.config.type = store.getState().game.character;
		this.scene.start('GameScene', this.config);
	}
}