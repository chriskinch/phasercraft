class Spell extends Phaser.GameObjects.Sprite {

	constructor({scene, x, y, key, ...config} = {}) {
		super(scene, x, y, key);
		
		Object.assign(this, config);
		this.name = this.constructor.name.toLowerCase();
		console.log(this.name)
		this.setAnimation();

		this.setIcon();
		this.checkReady();
	}

	setAnimation(){
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

	animationStart(){};
	animationUpdate(){};
	animationComplete(){};

	setIcon(){
		let p = 30;
		this.button = this.scene.add.sprite(0, 0, 'icon', this.icon_name).setInteractive().setDepth(this.scene.depth_group.UI).setScale(2);

		let styles = {
			font: '21px monospace',
			fill: '#ffffff',
			align: 'center'
		};
		this.text = this.scene.add.text(0, 0, this.cooldown, styles).setOrigin(0.5).setDepth(this.scene.depth_group.UI).setVisible(false);

		Phaser.Display.Align.In.BottomLeft(this.button, this.scene.UI.frames[this.slot]);
		Phaser.Display.Align.In.Center(this.text, this.button, -2, -2);
	}

	setValue(base, power){
		// Value based on base + scaled percentage of base from power + flat percent of power
		const scaled = base + (base * (power/100)) + power/10;
		// Check for crit
		const crit = this.player.isCritical();
		const total = crit ? scaled * 1.5 : scaled;
		return { crit: crit, amount: total };
	}

	checkReady(){
		let ready = (this.checkResource() && this.checkCooldown()) ? true : false;
		console.log("CHECK", this.enabled);
		if(ready){
			if(!this.enabled) this.enable();
		}else{
			//this.disable();
		}
	}

	checkResource(){
		return (this.cost[this.player.resource.type] <= this.player.resource.getValue());
	}

	checkCooldown(){
		return (this.timer) ? false : true;
	}

	enable(){
		console.log("ENABLE");
		this.enabled = true;
		this.player.resource.off('change', this.checkReady, this);
		this.setIconEvents('on');
		this.once('cast', this.cast, this);
		this.button.setAlpha(1);
	}

	disable(){
		console.log("DISBALE");
		this.enabled = false;
		this.player.resource.on('change', this.checkReady, this);
		this.setIconEvents('off');
		this.off('cast', this.cast, this);
		this.button.setAlpha(0.5);
	}

	setIconEvents(type){
		console.log("SET ICON EVENTS", type);
		this.button[type]('pointerover', this.over, this);
		this.button[type]('pointerout', this.out, this);
		this.button[type]('pointerdown', this.prime, this);
		this.scene.input.keyboard[type](`keydown-${this.hotkey}`, this.prime, this); 
	}

	over(){
		this.button.setTint(0x55ff55);
	}

	out() {
		this.button.setTint(0xffffff);
	}

	clear() {
		console.log("CLEAR");
		this.checkReady();
		this.setTargetEvents('off');
		this.out();
		this.scene.events.emit('spell:cleared', this);
	}

	prime(){
		console.log("PRIME");
		// this.scene.spell = this; // Let the scene know what spell is primed for various effects.
		this.scene.events.emit('spell:primed', this);
		this.setIconEvents('off');
		this.setTargetEvents('on');
		this.button.setTint(0xff9955);
	}

	charge() {
		console.log("CHARGE");
		this.player.resource.adjustValue(-this.cost[this.player.resource.type]);
	}

	cast(){
		console.log("CAST");
		this.scene.events.emit('spell:cast', this);
		this.effect();
		this.charge();

		this.animation();

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

	animation() {
		// Play the animation
		this.scene.add.existing(this).setDepth(1000);
		this.anims.play(this.name + '-animation');
	}

	focused(target){
		console.log("FOCUSED");
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