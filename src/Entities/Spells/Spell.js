class Spell extends Phaser.GameObjects.Sprite {
	constructor({scene, x, y, key, ...config} = {}) {
		super(scene, x, y, key);	
		Object.assign(this, config);
        this.name = this.constructor.name.toLowerCase();
        this.typedCost = this.cost[this.player.resource.type];
		this.hasAnimation = true;
		// Placeholder for clearnign the previous spell so it doesn't error
		this.player.clearLastPrimedSpell = () => {};
        
        this.setAnimation();
        Object.assign(this, this.setIcon());
        // Initial state is assumed to be off so check for ready.
        this.checkReady();

        // On any spell cast check all spells for readiness and disable if needed.
        this.scene.events.on('spell:cast', () => {
            if(!this.checkResource()) {
                this.button.setAlpha(0.4);
                this.setButtonEvents('off');
                this.checkReady();
            }
        }, this);
    }

    checkReady() {
        this.player.resource.on('change', this.onResourceChangeHandler, this);
        this.onResourceChangeHandler(); // Check instantly as some resources update infrequently.
    }

    clearSpell() {
        this.out();
        this.setCastEvents('off');
        this.setButtonEvents('on');
        this.scene.events.emit('spell:cleared', this);
	}

    onResourceChangeHandler() {
        if(this.checkResource()) {
            this.setButtonEvents('on');
            this.button.setAlpha(1);
            this.player.resource.off('change', this.onResourceChangeHandler, this);
        }
    }

    setCooldown() {
        this.button.setAlpha(0.4);
        this.text.setVisible(true);
        this.setCastEvents('off');
        this.out();
        this.player.clearLastPrimedSpell = () => {};
        this.player.resource.off('change', this.onResourceChangeHandler, this);
        return this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
            duration: this.cooldown * 1000,
			onUpdate: () => {
                const time = this.cooldown - Math.floor(this.cooldownTimer.getValue());
                this.text.setText(time);
            },
			onComplete: () => {
                this.text.setVisible(false);
                this.checkReady();
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

        this.scene.events.emit('spell:cast', this);

		// Set spell cooldown
		this.cooldownTimer = this.setCooldown();
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

    checkResource() {
		return (this.typedCost <= this.player.resource.getValue());
	}

    setIcon() {
        let p = 30;
        const button = this.scene.add.sprite(0, 0, 'icon', this.icon_name)
            .setInteractive()
            .setDepth(this.scene.depth_group.UI)
            .setScale(2)
            .setAlpha(0.4);

		let styles = {
			font: '21px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		const text = this.scene.add.text(0, 0, this.cooldown, styles).setOrigin(0.5).setDepth(this.scene.depth_group.UI).setVisible(false);

		Phaser.Display.Align.In.BottomLeft(button, this.scene.UI.frames[this.slot]);
        Phaser.Display.Align.In.Center(text, button, -2, -2);
        
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
        this.on('animationupdate', this.animationUpdate);
    }

    startAnimation() {
        this.scene.add.existing(this).setDepth(1000);
		this.anims.play(this.name + '-animation');
    }
    
    setValue(base, power){
		// Value based on base + scaled percentage of base from power + flat percent of power
		const scaled = base + (base * (power/100)) + power/10;
		// Check for crit
		const crit = this.player.isCritical();
		const total = crit ? scaled * 1.5 : scaled;
		return { crit: crit, amount: total };
	}
}

export default Spell;