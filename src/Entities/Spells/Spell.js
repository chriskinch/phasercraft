class Spell extends Phaser.GameObjects.Sprite {

	constructor(config) {
		super(config.scene, config.x, config.y, config.key);

		this.player = config.player;
		this.name = this.constructor.name.toLowerCase();
		this.icon_name = config.icon_name;
		this.cooldown = config.cooldown;
		this.value = config.value;
		this.cost = config.cost;

		this.scene.anims.create({
			key: this.name + '-animation',
			frames: this.scene.anims.generateFrameNumbers(this.name + '-effect', { start: 0, end: 24 }),
			frameRate: 24,
			repeat: 0,
			showOnStart: true,
			hideOnComplete: true
		});

		this.on('animationupdate', this.animationUpdate);
		// this.on('animationcomplete', this.animationComplete);
		
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
			this.enable();
		}else{
			this.disable();
		}
		console.log(this.name, ready);

		return ready;
	}

	checkResource(){
		return (this.cost < this.player.resource.value);
	}

	checkCooldown(){
		return (this.timer) ? false : true;
	}

	enable(){
		this.setIconEvents('on');
		this.button.setAlpha(1);
	}

	disable(){
		this.setIconEvents('off');
		this.button.setAlpha(0.5);
	}

	setIconEvents(type){
		this.button[type]('pointerover', this.over, this);
		this.button[type]('pointerout', this.out, this);
		this.button[type]('pointerdown', this.prime, this);
	}

	over(){
		this.button.setTint(0x55ff55);
	}

	out() {
		this.button.setTint(0xffffff);
	}

	prime(){
		this.scene.spell = this; // Let the scene know what spell is primed for various effects.
		this.scene.events.emit('spell:primed', this);
		this.setIconEvents('off');
		this.setTargetEvents('on');
		this.once('cast', this.cast, this);
		this.button.setTint(0xff9955);
	}

	cast(target){
		console.log("Cast: ", target);
		this.target = target;
		this.scene.events.emit('spell:cast', this);
		this.effect();

		// Play the animation
		this.scene.add.existing(this).setDepth(1000);
		this.anims.play(this.name + '-animation');

		// Disable the button, show and start spell cooldown
		this.disable();
		this.text.setVisible(true);
		this.timer = this.scene.tweens.addCounter({
			from: 0,
			to: this.cooldown,
			duration: this.cooldown * 1000,
			onUpdate: this.timerUpdate.bind(this),
			onComplete: this.timerComplete.bind(this)
		});
	}
	focused(target){
		if(this.ready) {
			this.target = target;
			this.emit('cast', this);
		}
	}

	timerUpdate(){
		let remaining = this.cooldown - Math.floor(this.timer.getValue());
		this.text.setText(remaining);
	}

	timerComplete(){
		console.log(this.timer.getProgress())
		this.text.setVisible(false);
		this.checkReady();
	}

	setAttribute(prop, value) {
		this[prop] = value;
	}

	getAttribute(prop) {
		return this[prop];
	}

	// setReady() {
	// 	this.enable();
	// 	this.text.setVisible(false);
	// 	this.once('cast', this.cast, this);
	// }

	// animationComplete(){
	// 	this.target = null;
	// }

	// clear(){
	// 	this.primed = false;
	// 	this.scene.spell = null;
	// 	this.setTargetEvents('off');
	// 	this.out();
	// }
}

export default Spell;