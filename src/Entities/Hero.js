import { getSpellSchools, getAssendedClass } from '../Config/ClassConfig'

class Hero extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);

		this.name = config.name;
		this.type = this.setClass([config.primary_class, config.secondary_class]);
		this.spell_schools = this.setSpellSchools();
		this.assended = false;

		this.pointer_down = {
			x: null,
			y: null
		}
		this.assendClass = this.assendClass.bind(this);

		console.log(this);

		this.anims.play('player-idle');
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

    isClose(obj, target, radius=10){
    	if((obj.x > target.x - radius && obj.x < target.x + radius) && (obj.y > target.y - radius && obj.y < target.y + radius)){
    		return true;
    	}
    }

    mouseDirection(pointer){
    	return (this.x - pointer.x > 0) ? "player-left-down" : "player-right-up";
    }

    getKeyByValue(object, value) {
	  return Object.keys(object).find(key => object[key] === value);
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

     update(mouse, keys, time, delta) {
     	let isClose = this.isClose(this, this.pointer_down);



		if(isClose) {
			this.body.setVelocity(0);
			this.anims.play('player-idle', true);
		}

		if(mouse.left.isDown) {
			this.pointer_down = {
				x: mouse.pointer.x,
				y: mouse.pointer.y
			}
			if(!isClose) {
				this.scene.physics.moveTo(this, mouse.pointer.x, mouse.pointer.y, 150);
				let walk_animation = (this.x - mouse.pointer.x > 0) ? "player-left-down" : "player-right-up";;
				this.anims.play(walk_animation, true);
			}
		}

		if(keys.space.isDown) {
			console.log("SWING!")
		}
    }
}

export default Hero;