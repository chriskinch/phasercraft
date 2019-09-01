import CharacterSelect from '../Entities/UI/CharacterSelect';

class SelectScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'MenuScene'
		});

		this.config = {};
	}

   	create(){
		const { centerX, centerY } = this.physics.world.bounds;
		this.character_select_menu = new CharacterSelect({
			scene: this,
			x: centerX,
			y: centerY,
			key:'S'
		}).createFromCache('character-select')
		.setVisible(true)
		.addListener('click')
		.on('click', (event) => { this.clickHandler(event); });
	}

	clickHandler(event){
		const type = event.target.getAttribute('data-character-type');
		if (type) {
			this.config.type = type;
			this.scene.start('GameScene', this.config);
		}
	}
	
	setCharacterType(name) {
		console.log(name);
		this.config.name = name;
	}
}

export default SelectScene;