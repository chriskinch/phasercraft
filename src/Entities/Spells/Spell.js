class Spell extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.name = this.constructor.name.toLowerCase();
		this.icon_name = config.icon_name;
		this.cooldown = config.cooldown;
		this.value = config.value;

		this.scene.anims.create({
			key: this.name + '-animation',
			frames: this.scene.anims.generateFrameNumbers(this.name + '-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: 0,
			showOnStart: true,
			hideOnComplete: true
		});

		this.on('animationupdate', this.animationUpdate);
		this.on('animationcomplete', this.animationComplete);
		this.setIcon();
		this.setReady();
	}

	setAttribute(prop, value) {
		this[prop] = value;
	}

	getAttribute(prop) {
		return this[prop];
	}

	setIcon(){
		let p = 30;
		this.button = this.scene.add.sprite(0, 0, 'icon', this.icon_name).setInteractive().setDepth(this.scene.depth_group.UI).setScale(2);
		this.button.block_events = true;

		let styles = {
			font: '21px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		this.text = this.scene.add.text(0, 0, this.cooldown, styles).setOrigin(0.5).setDepth(this.scene.depth_group.UI);

		this.button.on('pointerover', this.over, this);
		this.button.on('pointerout', this.out, this);
		this.button.on('pointerdown', this.prime, this);
	}

	prime(){
		if(this.ready) {
			this.primed = true;
			this.scene.events.emit('spell:primed', this);
			this.scene.spell = this; // Let the scene know what spell is primed for various effects.
			this.setTargetEvents('on');
			this.button.setTint(0xff9955);
		}
	}

	focused(target){
		if(this.ready) {
			this.target = target;
			this.emit('cast', this);
		}
	}

	cast(){
		this.scene.events.emit('spell:cast', this);
		this.effect();
		this.animate();
		this.clear();
		this.startCooldown();
	}

	startCooldown(){
		this.ready = false;
		this.button.setAlpha(0.5);
		this.text.setVisible(true);

		this.timer = this.scene.tweens.addCounter({
        from: 0,
        to: this.cooldown,
        duration: this.cooldown * 1000,
        onUpdate: this.updateText.bind(this),
        onComplete: this.setReady.bind(this)
    });
	}

	updateText(){
		let remaining = this.cooldown - Math.floor(this.timer.getValue());
		this.text.setText(remaining);
	}

	setReady() {
		this.ready = true;
		this.button.setAlpha(1);
		this.text.setVisible(false);
		this.once('cast', this.cast, this);
	}

	animate(){
		this.scene.add.existing(this).setDepth(1000);
		this.anims.play(this.name + '-animation');
	}

	animationComplete(){
		this.target = null;
	}

	over(){
		if(this.ready && !this.primed) this.button.setTint(0x55ff55);
	}

	out() {
		if(!this.primed) this.button.setTint(0xffffff);
	}

	clear(){
		this.primed = false;
		this.scene.spell = null;
		this.setTargetEvents('off');
		this.button.setTint(0xffffff);
	}
}

export default Spell;