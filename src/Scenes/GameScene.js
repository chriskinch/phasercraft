import Player from '../Entities/Player/Player';
import Enemy from '../Entities/Enemy';
import waveConfig from '../Config/waves.json';

class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene'
		});

		this.global_tick = 0.2;
		this.global_swing_speed = 1;
		this.global_attack_delay = 250;
		this.global_spawn_time = 500;

		this.wave = 0;
	}

	create (){
		this.player = new Player({
			scene:this,
			x: 400,
			y: 400
		});

		this.enemies = this.add.group();
		let enemy_array = waveConfig[this.wave];
		enemy_array.forEach((enemy, i) => {
			this.time.delayedCall(this.global_spawn_time*i, () => this.spawnEnemy(enemy), [], this);
		});

		//this.cameras.main.startFollow(this.player hero);

		this.input.mouse.capture = true;
		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player.hero, this);
		this.physics.add.collider(this.enemies, this.enemies);

		this.input.on('pointerdown', this.deselect, this);

		this.events.once('player-dead', this.gameOver, this);

		// Resume physics if we load the scene post game over.
		this.physics.resume();
	}

	update(time, delta) {
		let mouse = {
			pointer: this.input.activePointer,
			left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
			middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
			right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
		}

		if(this.player.alive) this.player.update(mouse, this.cursors, time, delta);

		this.enemies.children.entries.forEach(entry =>{
			entry.update(time, delta);
		});
	}

	deselect(){
		if(this.selected) this.selected.deselect();
	}

	gameOver(){
		this.physics.pause();
	}

	spawnEnemy(enemy){
		let rand = Math.round(Math.random() * 5);
		this.enemies.add(new Enemy({
			scene: this,
			key: enemy,
			x: Math.random() * 800,
			y: Math.random() * 800,
			target: this.player
		}));
	}
}

export default GameScene;