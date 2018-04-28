

class Test extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.add.existing(this);

		//this.setDepth(100);

		this.name = config.name;

		this.assended = false;



	}


	setSpellSchools(){
		return getSpellSchools(this.type);
	}

	assendClass(type){
		if(!this.assended) {
			this.type = this.setClass([this.type, type]);
			this.spell_schools = this.setSpellSchools();
			this.assended = true;
		}
	}
}

export default Test;