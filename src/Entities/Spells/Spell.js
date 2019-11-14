import { GameObjects, Display } from "phaser"
import store from "../../store"

class Spell extends GameObjects.Sprite {
	constructor({scene, x, y, key, ...config} = {}) {
		super(scene, x, y, key);	
		Object.assign(this, config);

        this.typedCost = this.cost[this.player.resource.name];
        this.hasAnimation = true;
        this.enabled = false;
        // Placeholder empty function for clearing last spell
        this.player.clearLastPrimedSpell = () => {};
        
        this.setAnimation();
        Object.assign(this, this.setIcon());
        // Initial state is assumed to be off so check for ready if not monitor.
        if(this.checkReady()) {
			this.enableSpell();
		}else{
			this.monitorReady();
		}
        // On any spell cast check all spells for readiness and disable if needed.
        this.scene.events.on('spell:cast', () => {
			this.disableSpell();
		}, this);
		// Once a spell is cooling down monitor if all spells are ready.
		// This covers us for disabling spells while one is channeled.
		this.scene.events.on('spell:cooldown', () => {
			this.monitorReady();
        }, this);
        
        this.scene.add.existing(this).setDepth(1000).setVisible(false);
    }

    checkResource() {
		return (this.typedCost <= this.player.resource.getValue());
    }
    
    checkCooldown() {
		return (!this.cooldownTimer || this.cooldownTimer.getValue() === this.cooldown);
    }
    
    checkReady() {
        return (this.checkResource() && this.checkCooldown() && !this.enabled);
    }
    
    monitorReady() {
        this.player.resource.on('change', this.onResourceChangeHandler, this);
        this.onResourceChangeHandler(); // Check instantly as some resources update infrequently.
    }

    onResourceChangeHandler() {
        if(this.checkReady()) this.enableSpell();
    }

    enableSpell() {
        this.enabled = true;
        this.button.setAlpha(1);
        this.setButtonEvents('on');
        this.player.resource.off('change', this.onResourceChangeHandler, this);
    }

    disableSpell() {
        this.enabled = false;
		this.button.setAlpha(0.4);
		this.setButtonEvents('off');
        this.setCastEvents('off');
        this.out();
        this.player.clearLastPrimedSpell = () => {};
        this.player.resource.off('change', this.onResourceChangeHandler, this);
    }

    clearSpell() {
        this.out();
        this.setCastEvents('off');
        this.setButtonEvents('on');
        this.scene.events.emit('spell:cleared', this);
    }

    setCooldown() {
		this.text.setVisible(true);
        return this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
			duration: this.cooldown * 1000,
			onStart: () => {
				// Do this on start so we know the timer has been setup.
				this.scene.events.emit('spell:cooldown', this);
			},
			onUpdate: () => {
                const time = this.cooldown - Math.floor(this.cooldownTimer.getValue());
                this.text.setText(time);
            },
			onComplete: () => {
                this.text.setVisible(false);
            }
        });
	}



    castSpell(target) {
        this.target = target;
        this.effect(target);
        // Charge the player some resource
        this.player.resource.adjustValue(-this.typedCost);
        // Do the animation
        this.animation = (this.hasAnimation) ? this.startAnimation() : null;
		
		// Check if cooldown should be trigger automatically. Other wise spell must handle this.
		if(!this.cooldownDelay) this.cooldownTimer = this.setCooldown();
		
		this.scene.events.emit('spell:cast', this);
	}
	
	clearLastPrimedSpell() {
		this.player.clearLastPrimedSpell();
		this.player.clearLastPrimedSpell = () => this.clearSpell(this.name);
	}
    
    setPrimed() {
		this.clearLastPrimedSpell();
        this.scene.events.emit('spell:primed', this);
        this.setButtonEvents('off');
        this.setCastEvents('on');
		this.button.setTint(0xff9955);
    }

    over() {
		this.button.setTint(0x55ff55);
	}

	out() {
        // For some reason this doesn work as this.button.setTint(); ???
		// this.scene.time.delayedCall(0, () => this.button.setTint(), [], this);
		this.button.setTint();
    }

    setButtonEvents(state) {
        this.button[state]('pointerover', this.over, this);
        this.button[state]('pointerout', this.out, this);
        this.button[state]('pointerdown', this.setPrimed, this);
        this.scene.input.keyboard[state](`keydown-${this.hotkey}`, this.setPrimed, this);
    }

    setIcon() {
        const button = this.scene.add.sprite(0, 0, 'icon', this.icon_name)
            .setInteractive()
            .setDepth(this.scene.depth_group.UI)
            .setAlpha(0.4)
            .setScale(1.5);

		let styles = {
			font: '16px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		const text = this.scene.add.text(-2, -2, this.cooldown, styles).setOrigin(0.5).setDepth(this.scene.depth_group.UI).setVisible(false);

		Display.Align.In.BottomLeft(button, this.scene.UI.frames[this.slot]);
        Display.Align.In.Center(text, button, 0, 0);
        
        return {button: button, text: text};
    }

    setAnimation() {
        this.scene.anims.create({
			key: this.name + '-animation',
			frames: this.scene.anims.generateFrameNumbers(this.name + '-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: 0,
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
        const power = store.getState().stats[key];
		// Value based on base + scaled percentage of base from power + flat percent of power
		const scaled = base + (base * (power/100)) + power/10;
		// Check for crit
		const crit = this.player.isCritical();
		const total = reducer(crit ? scaled * 1.5 : scaled);
		return { crit: crit, amount: total };
	}
}

export default Spell;