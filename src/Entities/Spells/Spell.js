import { GameObjects } from "phaser"
import mapStateToData from "@Helpers/mapStateToData"
import store from "@store"
import { disableSpell, enableSpell, clearSpell  } from "@store/reducers/spellReducer"

class Spell extends GameObjects.Sprite {
	constructor({scene, x, y, key, ...config} = {}) {
		super(scene, x, y, key);	
        Object.assign(this, config);
        
        this.typedCost = this.cost[this.player.resource.name];
        this.hasAnimation = true;
        this.enabled = false;
        
        this.setAnimation();
        // Initial state is assumed to be off so monitor spell.
        this.monitorSpell();
        
        this.scene.events.on('spell:disableall', this.killSpell, this);
        this.scene.events.on('spell:enableall', this.monitorSpell, this);
        this.scene.add.existing(this).setDepth(1000).setVisible(false);

        mapStateToData("primed", primed => this.primeSpell(primed), {init:false, type:"spell"});
        mapStateToData("disabled", disabled => this.primeSpell(disabled), {init:false, type:"spell"});
    }

    checkResource() {
		return (this.typedCost <= this.player.resource.getValue());
    }
    
    checkCooldown() {
		return (!this.cooldownTimer || this.cooldownTimer.getValue() === this.cooldown);
    }
    
    checkReady() {
        return (this.checkResource() && this.checkCooldown());
    }

    onResourceChangeHandler() {
        this.checkReady() ? this.enableSpell() : this.disableSpell();
    }

    enableSpell() {
        if(!this.enabled) {
            this.enabled = true;
            store.dispatch(enableSpell(this.name))
        }
    }

    monitorSpell() {
        this.player.resource.on('change', this.onResourceChangeHandler, this);
        if(this.checkReady()) this.enableSpell();
    }

    disableSpell() {
        if(this.enabled) {
            this.setCastEvents('off');
            store.dispatch(disableSpell(this.name))
            // this.player.clearLastPrimedSpell = () => {};
            this.enabled = false;
        }
    }

    killSpell() {
        this.player.resource.off('change', this.onResourceChangeHandler, this);
        this.disableSpell();
    }

    clearSpell() {
        this.setCastEvents('off');
        this.scene.events.emit('spell:cleared', this);
        store.dispatch(clearSpell(this.name))
    }

    setCooldown() {
        return this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
			duration: this.cooldown * 1000,
			onStart: () => {
                // this.text.setVisible(true);
			},
			onUpdate: () => {
                const time = this.cooldown - Math.floor(this.cooldownTimer.getValue());
                // this.text.setText(time);
            },
			onComplete: () => {
                // this.text.setVisible(false);
                this.onResourceChangeHandler();
            }
        });
    }

    primeSpell(primed) {
        // this.disableSpell();
        // this.enableSpell();
        const onoff = this === primed ? "on" : "off";
        console.log(this, primed, onoff)
        this.setCastEvents(onoff);
    }
    
    castSpell(target) {
        this.target = target;
        this.effect(target);
        // Charge the player some resource
        this.player.resource.adjustValue(-this.typedCost);
        // Do the animation
        this.animation = (this.hasAnimation) ? this.startAnimation() : null;
        // Check if cooldown should be trigger automatically. Other wise spell must handle this.
		if(!this.cooldownDelayAll) {
            if(!this.cooldownDelay) {
                this.cooldownTimer = this.setCooldown();
            }else{
                this.killSpell();
            }
        }else{
            this.scene.events.emit('spell:disableall', this);
        }
		this.scene.events.emit('spell:cast', this);
	}

    setAnimation() {
        this.scene.anims.create({
			key: this.name + '-animation',
			frames: this.scene.anims.generateFrameNumbers(this.name + '-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: this.loop ? -1 : 0,
			showOnStart: true,
            hideOnComplete: true
        });
        this.on('animationstart', this.animationStart);
        this.on('animationupdate', this.animationUpdate);
        this.on('animationcomplete', this.animationComplete);
    }

    // Holding functions
    animationStart() {}
    animationUpdate() {}
    animationComplete() {}

    startAnimation() {
		this.anims.play(this.name + '-animation');
    }
    
    setValue({base, key, reducer=(v)=>v }){
        const power = store.getState().game.stats[key];
		// Value based on base + scaled percentage of base from power + flat percent of power
		const scaled = base + (base * (power/100)) + power/10;
		// Check for crit
		const crit = this.player.isCritical();
		const total = reducer(crit ? scaled * 1.5 : scaled);
		return { crit: crit, amount: total };
	}
}

export default Spell;