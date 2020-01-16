import { Scene } from 'phaser';
import store from "../store";

export default class SelectScene extends Scene {
	constructor() {
		super({
			key: 'SelectScene'
		});

		this.config = {};
	}

   	create(){
		// Save the returned unsub function and call one first action.
		// Looks like and infinite loop but actually acts like a "once" event.
		const unsubscribe = store.subscribe(() => {
			if(store.getState().character) {
				this.chooseCharacter()
				unsubscribe();
			}
		});
	}

	chooseCharacter(){
		this.config.type = store.getState().character;
		this.scene.start('GameScene', this.config);
	}
}