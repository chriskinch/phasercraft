class Spell extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.player = config.player;
		this.name = this.constructor.name.toLowerCase();
		this.icon_name = config.icon_name;
		this.cooldown = config.cooldown;
		this.value = config.value;
		this.cost = config.cost;
		this.slot = config.slot;

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
		this.checkReady();
		this.player.resource.on('change', this.checkReady, this);
	}

	setIcon(){
		let p = 30;
		this.button = this.scene.add.sprite(0, 0, 'icon', this.icon_name).setInteractive().setDepth(this.scene.depth_group.UI).setScale(2);

		let styles = {
			font: '21px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		this.text = this.scene.add.text(0, 0, this.cooldown, styles).setOrigin(0.5).setDepth(this.scene.depth_group.UI).setVisible(false);
	}

	checkReady(){
		let ready = (this.checkResource() && this.checkCooldown()) ? true : false;
		if(ready){
			if(!this.enabled) this.enable();
		}else{
			this.disable();
		}
	}

	checkResource(){
		return (this.cost < this.player.resource.value);
	}

	checkCooldown(){
		return (this.timer) ? false : true;
	}

	enable(){
		this.enabled = true;
		this.setIconEvents('on');
		this.once('cast', this.cast, this);
		this.button.setAlpha(1);
	}

	disable(){
		this.enabled = false;
		this.setIconEvents('off');
		this.off('cast', this.cast, this);
		this.button.setAlpha(0.5);
	}

	setIconEvents(type){
		this.button[type]('pointerover', this.over, this);
		this.button[type]('pointerout', this.out, this);
		this.button[type]('pointerdown', this.prime, this);
		this.scene.input.keyboard[type](`keydown-${this.slot}`, this.prime, this); 
	}

	over(){
		this.button.setTint(0x55ff55);
	}

	out() {
		this.button.setTint(0xffffff);
	}

	clear() {
		this.setIconEvents('on');
		this.setTargetEvents('off');
		this.out();
	}

	prime(){
		this.scene.spell = this; // Let the scene know what spell is primed for various effects.
		this.scene.events.emit('spell:primed', this);
		this.setIconEvents('off');
		this.setTargetEvents('on');
		this.button.setTint(0xff9955);
	}

	cast(){
		this.scene.events.emit('spell:cast', this);
		this.effect();

		// Play the animation
		this.scene.add.existing(this).setDepth(1000);
		this.anims.play(this.name + '-animation');

		// Disable the button, show and start spell cooldown
		this.disable();
		this.clear();
		this.text.setVisible(true);
		this.enabled = false;
		this.timer = this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
			duration: this.cooldown * 1000,
			onUpdate: this.timerUpdate.bind(this),
			onComplete: this.timerComplete.bind(this)
		});
	}

	focused(target){
		this.target = target;
		this.emit('cast', this);
	}

	timerUpdate(){
		let remaining = (this.timer) ? this.cooldown - Math.floor(this.timer.getValue()) : 0;
		this.text.setText(remaining);
	}

	timerComplete(){
		this.timer = null;
		this.text.setVisible(false);
		this.out();
		this.checkReady();
	}

	animationComplete(){
		this.target = null;
	}

	setAttribute(prop, value) {
		this[prop] = value;
	}

	getAttribute(prop) {
		return this[prop];
	}
}

export default Spell;