class SpellRework extends Phaser.GameObjects.Sprite {

	constructor({scene, x, y, key, ...config} = {}) {
		super(scene, x, y, key);
		
		Object.assign(this, config);
        this.name = this.constructor.name.toLowerCase();
        this.typedCost = this.cost[this.player.resource.type];
        
        this.scene.anims.create({
			key: this.name + '-animation',
			frames: this.scene.anims.generateFrameNumbers(this.name + '-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: 0,
			showOnStart: true,
            hideOnComplete: true,
            onUpdate: this.animationUpdate
        });
                
        Object.assign(this, this.setIcon());
        this.setButtonEvents(this.checkReady());
        this.player.resource.on('change', this.onResourceChangeHandler, this);

        console.log(this);

        
    }

    onResourceChangeHandler() {
        console.log("CHECK: ", this.checkResource(), this.checkCooldown())
        this.setButtonEvents(this.checkReady());
    }

    setCooldown(){
        console.log("COOLING DOWN");
        this.button.setAlpha(0.5);
        this.text.setVisible(true);
        return this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
            duration: this.cooldown * 1000,
            onStart: () => this.out(),
			onUpdate: () => this.text.setText(this.cooldown - Math.floor(this.cooldownTimer.getValue())),
			onComplete: () => {
                this.text.setVisible(false);
                this.setButtonEvents(this.checkReady());
            }
        });
	}

    castSpell(target) {
        console.log("CAST", target);
		this.scene.events.emit('spell:cast', this);
        this.effect(target);
        
        // Charge the player some resource
        this.player.resource.adjustValue(-this.typedCost);

        // Do the animation
		this.scene.add.existing(this).setDepth(1000);
		this.anims.play(this.name + '-animation');

		// Set spell cooldown
		this.cooldownTimer = this.setCooldown();
    }
    
    setPrimed() {
        this.scene.events.emit('spell:primed', this);
        this.setButtonEvents(false);
        this.setCastEvents('on');
		this.button.setTint(0xff9955);
    }

    over(){
		this.button.setTint(0x55ff55);
	}

	out() {
		this.button.setTint(0xffffff);
	}

    setButtonEvents(enabled) {
        console.log("SET BUTTON EVENTS", enabled)
        const state = enabled ? 'on' : 'off';
        const alphr = enabled ? 1 : 0.5;
        
        this.button[state]('pointerover', this.over, this);
        this.button[state]('pointerout', this.out, this);
        this.button[state]('pointerdown', this.setPrimed, this);
        this.button.setAlpha(alphr);
    }

    checkResource(){
		return (this.typedCost <= this.player.resource.getValue());
	}

	checkCooldown(){
        console.log(this.cooldownTimer.getValue())
		return !this.cooldownTimer || this.cooldownTimer.getValue() === 1;
    }

    checkReady() {
        return this.checkResource() && this.checkCooldown();
    }

    setIcon() {
        let p = 30;
		const button = this.scene.add.sprite(0, 0, 'icon', this.icon_name).setInteractive().setDepth(this.scene.depth_group.UI).setScale(2);

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
    
    setValue(base, power){
		// Value based on base + scaled percentage of base from power + flat percent of power
		const scaled = base + (base * (power/100)) + power/10;
		// Check for crit
		const crit = this.player.isCritical();
		const total = crit ? scaled * 1.5 : scaled;
		return { crit: crit, amount: total };
	}

}

export default SpellRework;