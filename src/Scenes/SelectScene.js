import { Scene } from 'phaser';
import store from "../store";

class SelectScene extends Scene {
	constructor() {
		super({
			key: 'SelectScene'
		});

		this.config = {};
	}

   	create(){
		store.subscribe(this.chooseCharacter.bind(this));
	}

	chooseCharacter(type){
		console.log(this)
		const { character } = store.getState();
		this.config.type = character;
		this.scene.start('GameScene', this.config);
	}
}

export default SelectScene;