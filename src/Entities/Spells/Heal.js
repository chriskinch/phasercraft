class Heal extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.cooldown = 10;
		this.value = 200;

		this.scene.anims.create({
			key: 'heal-animation',
			frames: this.scene.anims.generateFrameNumbers('heal-effect', { start: 0, end: 24 }),
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

	setIcon(){
		let p = 30;
		this.button = this.scene.add.sprite(0, 0, 'icon', 'icon_0015_heal').setInteractive().setDepth(this.scene.depth_group.UI).setScale(2);
		this.button.block_events = true;
		Phaser.Display.Align.In.BottomLeft(this.button, this.scene.zone, -p, -p);

		let styles = {
			font: '21px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		this.text = this.scene.add.text(0, 0, this.cooldown, styles).setOrigin(0.5).setDepth(this.scene.depth_group.UI);
		Phaser.Display.Align.In.Center(this.text, this.button, -2, -2);

		this.button.on('pointerover', this.over, this);
		this.button.on('pointerout', this.out, this);
		this.button.on('pointerdown', this.prime, this);
	}

	prime(){
		if(this.ready) {
			this.primed = true;
			this.setTargetEvents('on');
			this.button.setTint(0xff9955);
		}
	}

	setTargetEvents(type){
		// Elegible targets for this spell
		this.scene.events[type]('pointerdown:player', this.focused, this);
		// Event that clears the primed spell. Emitted by invalid targets.
		this.scene.events[type]('pointerdown:game', this.clear, this);
		this.scene.events[type]('keypress:esc', this.clear, this);
		this.scene.events[type]('pointerdown:enemy', this.clear, this);
	}

	setIconEvents(type){

	}

	focused(target){
		if(this.ready) {
			this.target = target;
			this.emit('cast', this);
		}
	}

	cast(){
		if(this.target.health) this.target.health.adjustValue(this.value);
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
		this.anims.play('heal-animation');
	}

	animationUpdate(){
		this.x = this.target.x;
		this.y = this.target.y;
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
		this.setTargetEvents('off');
		this.button.setTint(0xffffff);
	}
}

export default Heal;