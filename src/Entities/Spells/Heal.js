class Heal extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.cooldown = 7000;
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
		this.button = this.scene.add.sprite(p, this.scene.global_game_height - p, 'icon', 'icon_0015_heal');
		this.button.setOrigin(0, 1).setInteractive().setDepth(this.scene.depth_group.UI).setScale(2);
		this.text = this.scene.add.text(32, 32);
		// Phaser.Display.Align.In.Center(pic, this.add.zone(400, 300, 800, 600));
		Phaser.Display.Align.In.Center(this.text, this.button);
	}

	prime(){
		this.primed = true;
		this.setTargetEvents('on');
		this.button.setTint(0xff9955);
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
		this.button[type]('pointerover', this.over, this);
		this.button[type]('pointerout', this.out, this);
		this.button[type]('pointerdown', this.prime, this);
	}

	focused(target){
		if(this.ready) {
			this.target = target;
			this.emit('cast', this);
		}
	}

	cast(){
		if(this.target.health) this.target.health.adjustValue(this.value);
		this.scene.events.off('pointerdown:player', this.focused);
		this.animate();
		this.clear();
		this.cooling();
	}

	cooling(){
		this.ready = false;
		this.button.setAlpha(0.5);
		this.setTimerText();
		this.setIconEvents('off');
		this.scene.time.delayedCall(this.cooldown, this.setReady, [], this);
	}

	setText(){
		this.text.setText(output);
	}

	setTimer(){
		this.timer = this.scene.time.addEvent({ delay: this.cooldown });
	}

	getTimerProgress(){
		let output = this.timer.getProgress().toString().substr(0, 4)
		return output;
	}

	setReady() {
		this.ready = true;
		this.button.setAlpha(1);
		this.out();
		this.setIconEvents('on');
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
		if(!this.primed) this.button.setTint(0x55ff55);
	}

	out() {
		if(!this.primed) this.button.setTint(0xffffff);
	}

	clear(){
		this.primed = false;
		this.setTargetEvents('off');
		this.out();
	}
}

export default Heal;