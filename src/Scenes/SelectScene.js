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
		store.subscribe(this.chooseCharacter.bind(this));
	}

	chooseCharacter(){
		const { character } = store.getState();
		this.config.type = character;
		this.scene.start('GameScene', this.config);
	}
}