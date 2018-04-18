import createAnimations from '../Config/animations';
import Player from '../Entities/Player/Player';
import Enemy from '../Entities/Enemy';

class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene'
		});

		this.global_tick = 0.2;
		this.global_swing_speed = 1;
		this.global_attack_delay = 250;
	}

	create (){
		createAnimations(this);

		this.player = new Player({
			scene:this,
			x: 400,
			y: 400
		});

		let enemies = 5;
		this.group = this.add.group();

		let enemy_types = [
			'baby-ghoul',
			'imp',
			'ghoul',
			'satyr',
			'egbert',
			'slime'
		];

		for(let i = 0; i < enemies; i++){
			let rand = Math.round(Math.random() * 5);
			this.group.add(new Enemy({
				scene: this,
				key: enemy_types[rand],
				x: Math.random() * 800,
				y: Math.random() * 800,
			}));
		}

		//this.cameras.main.startFollow(this.player hero);

		this.input.mouse.capture = true;
		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player.hero, this);

		this.physics.add.collider(this.player.hero, this.group, (hero, group) => group.attack() ,null, this.group);
		this.physics.add.collider(this.group, this.group);

		this.input.on('pointerdown', this.deselect, this);

		this.events.once('player-dead', this.gameOver, this);
	}

	update(time, delta) {
		let mouse = {
			pointer: this.input.activePointer,
			left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
			middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
			right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
		}
		if(this.player.alive) this.player.update(mouse, this.cursors, time, delta);

		this.group.children.entries.forEach(entry =>{
			entry.update(time, delta);
		});
	}

	deselect(){
		if(this.selected) this.selected.deselect();
	}

	gameOver(){
		this.physics.pause();
	}
}

export default GameScene;