import { getSpellSchools, getAssendedClass } from '../Config/ClassConfig'

class Hero extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.name = config.name;
		this.type = this.setClass([config.primary_class, config.secondary_class]);
		this.spell_schools = this.setSpellSchools();
		this.assended = false;

		this.assendClass = this.assendClass.bind(this);

		config.scene.add.existing(this);
	}

    setClass(types){
    	return (types[1]) ? getAssendedClass(types) : types[0];
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

  //   update(keys, time, delta) {
  //   	let input = {
		// 	up: keys.up.isDown,
		// 	left: keys.left.isDown,
		// 	right: keys.right.isDown,
		// 	down: keys.down.isDown,
		// }

  //   	for(let key in input) {
  //   		this.move(key, input[key])
  //   	}
		
  //   }

  //   move(direction, isDown) {
  //   	if(isDown) {
		// 	if(!this.moving) {
		// 		this.anims.play('blank-hero-right');
		// 		this.moving = true;
		// 	}
		// 	this.x += 2;
  //   	}else{
  //   		if(this.moving) {
  //   			this.anims.stop('blank-hero-' + direction);
  //   			this.moving = false;
  //   		}
  //   	}
  //   }

     update(mouse, time, delta) {
		//console.log(mouse)


		if(mouse.left) {
			if(!this.moving){
				this.anims.play('blank-hero-right');
			}
			this.moving = true;
			this.x += 2;
		}else{
			this.moving = false;
		}

		// if(input.right) {
		// 	if(!this.moving) {
		// 		this.anims.play('blank-hero-right');
		// 		this.moving = true;
		// 	}
		// 	this.x += 2;
  //   	}else{
  //   		if(this.moving) {
  //   			this.anims.stop('blank-hero-right');
  //   			this.moving = false;
  //   		}
  //   	}
    }
}

export default Hero;