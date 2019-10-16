import { Scene } from 'phaser';
import store from "../store";
import { TOGGLE_UI } from "../store/gameReducer";

class SelectScene extends Scene {
	constructor() {
		super({
			key: 'SelectScene'
		});

		this.config = {};
	}

   	create(){
		store.dispatch({ type: TOGGLE_UI });
	}

	clickHandler(event){
		const type = event.target.getAttribute('data-character-type');
		if (type) {
			this.config.type = type;
			this.scene.start('GameScene', this.config);
		}
	}
	
	setCharacterType(name) {
		this.config.name = name;
	}
}

export default SelectScene;