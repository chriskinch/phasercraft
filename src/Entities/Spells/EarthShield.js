import Spell from './Spell';

class EarthShield extends Spell {
	constructor(config) {
		const defaults = {
            name: "earthshield",
			icon_name: 'icon_0008_ki',
			cooldown: 0,
			cost: {
				rage: 20,
				mana: 30,
				energy: 20
			},
            type: 'magic',
            duration: 6,
            lifespan: 20
        }
		super({ ...defaults, ...config });
        
        this.radius = 40;

        // this.scene.physics.world.enable(this);
        console.log(this);
        // this.body.setSize(101, 101, true);
        // this.body.syncBounds = true;
        // this.body.isCircle = true;
        // this.body.immovable = true;
    }

	setCastEvents(state){
		// Elegible targets for this spell
		this.scene.events[state]('pointerdown:player', this.castSpell, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[state]('pointerdown:game', this.clearSpell, this);
		this.scene.events[state]('keypress:esc', this.clearSpell, this);
		this.scene.events[state]('pointerdown:enemy', this.clearSpell, this);
	}

    effect(target){
        this.scene.physics.world.enable(this);
        this.body.syncBounds = true;
        this.body.isCircle = true;
        this.body.immovable = true;
        this.scene.physics.add.collider(this.scene.active_enemies, this, this.touch, null, this);
    }

    touch() {
        const value = this.setValue({ base: 5, key: "magic_power" });
        this.target.health.adjustValue(value.amount, this.type, value.crit);
    }

    animationStart() {
        this.x = this.target.x + this.radius;
		this.y = this.target.y;
    }

	animationUpdate(){
        const frames = 2; //this.anims.currentAnim.frames.length - 1;
        const end = this.anims.currentAnim.frames[frames];
        if(this.anims.currentFrame === end) {
            this.anims.currentAnim.pause(end);
            this.motion = this.startMotion();
        }
    }
    
    startMotion() {
        return this.scene.tweens.addCounter({
			from: 0,
            to: 360,
            repeat: -1,
            duration: 3000,
            delay: 250,
			onUpdate: () => {
                const time = Math.floor(this.motion.getValue());
                const angle = Math.PI/180 * time;
                this.x = Math.cos(angle) * this.radius + this.target.x;
                this.y = -Math.sin(angle) * (this.radius * 0.75) + this.target.y; // 0.75 to squash the radius for perspective.
                // Crazy depth sorting. If spell is south of target it must go over all entities.
                // If it's north of target it need to go between the target and all entities hence 
                // the sub pixel numbers.
                const sub_depth = (this.y - this.target.y) / this.radius;
                (this.y > this.target.y) ? this.setDepth(10000) : this.setDepth(this.target.y + sub_depth)
            }
        });
        
        // this.scene.tweens.add({
        //     targets: this,
        //     repeat: -1,
        //     y: {
        //         value: this.y - 25,
        //         duration: 750,
        //         ease: 'Cubic.easeOut'
        //     },
        //     onUpdate: () => console.log(this)
        // });

        // $.each(dots, function(key, value){
        //     var segment = angle*key;
        //     var x = Math.cos(segment) * radius;
        //     var y = Math.sin(segment) * radius;
        //     $(value).css({
        //       'left': ox + x,
        //       'top': oy + y
        //     });
        //     console.text(dots.length);
            
        //   });
    }
}

export default EarthShield;