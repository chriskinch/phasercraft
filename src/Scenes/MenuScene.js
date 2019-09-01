import CharacterSelect from '../Entities/UI/CharacterSelect';

class MenuScene extends Phaser.Scene {
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
		const name = event.target.getAttribute('data-character-type');
		if (name) this.config.name = name;

		if(this.config.name) this.scene.start('GameScene', this.config);
	}
	
	setCharacterType(name) {
		console.log(name);
		this.config.name = name;
	}
}

export default MenuScene;