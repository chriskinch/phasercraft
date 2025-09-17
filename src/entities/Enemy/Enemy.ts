import { Core, Math as PhaserMath, GameObjects, Geom, Scene, Physics, Types } from "phaser";
import { v4 as uuid } from 'uuid';
import AssignResource, { AssignResourceType } from "@entities/Resources/AssignResource";
import Monster from "./Monster";
import Coin from "@entities/Loot/Coin";
import Crafting from "@entities/Loot/Crafting";
// import Gem from "@entities/Loot/Gem"; // TODO: Create TypeScript version
import Banes from "@entities/UI/Banes";
import type { EnemyOptions, EnemyAttributes, LootTable, TargetType } from "@/types/game";

interface EnemyStats extends EnemyAttributes {
	health_value?: number;
}
interface EnemyStates {
	movement: string;
	attack: string;
}

interface CirclingConfig {
	from: number;
	to: number;
	delay: number;
	duration: number;
	repeat: number;
	completeDelay: number;
}

interface MoveOptions {
	target?: TargetType;
	bias?: number;
}

interface HitParams {
	power: number;
	type?: string;
	crit?: boolean;
}

class Enemy extends GameObjects.Container {
	public uuid: string;
	public monster: Monster;
	public key: string;
	public target: TargetType;
	public attack_ready: boolean;
	public attack_radius: number;
	public aggro_radius: number;
	public circling_radius: number;
	public loot_chance: number;
	public coin_multiplier: number;
	public active_group: GameObjects.Group;
	public alive: boolean;
	public wave_multiplier: number;
	public base_stats: EnemyStats;
	public stats: EnemyStats;
	public loot_table: LootTable;
	public xp: number;
	public state: string;
	public states: EnemyStates;
	public graphics: { [key: string]: GameObjects.Graphics };
	public health: AssignResourceType;
	public banes: Banes;
	public spawn_stop: Physics.Arcade.Image;
	public point: PhaserMath.Vector2;
	public distance_to_player: number;
	public destination: PhaserMath.Vector2 | null;
	public caution: number;
	public circling: Phaser.Tweens.Tween | null;
	public wandering_looped_timer: Phaser.Time.TimerEvent | null = null;
	public selected: boolean;
	public swing: Phaser.Time.TimerEvent | null = null;
	public collider: Physics.Arcade.Collider;
	public body: Physics.Arcade.Body;

	constructor(config: EnemyOptions) {
		super(config.scene, config.x, config.y - 300);

		this.uuid = uuid();

		this.monster = new Monster({
			scene: this.scene,
			key: config.key,
			x: Math.random() * 800,
			y: Math.random() * 600,
			target: config.target
		});
		this.add(this.monster);

		this.setSize(this.monster.getBounds().width, this.monster.getBounds().height);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setFriction(0,0).setDrag(0).setGravityY(200).setBounce(0.2);

		this.key = config.key;
		this.target = config.target;
		this.attack_ready = true;
		this.attack_radius = config.attributes.range || 40;
		this.aggro_radius = config.aggro_radius || 250;
		this.circling_radius = config.circling_radius || 30;
		this.loot_chance = 0.75;
		this.coin_multiplier = config.coin_multiplier;
		this.active_group = config.active_group;
		this.alive = true;

		this.wave_multiplier = config.wave_multiplier || 0;
		this.base_stats = this.setStats(config.attributes, this.wave_multiplier);
		this.loot_table = config.loot_table || [];
		this.stats = { ...this.base_stats };
		this.stats.health_value = this.stats.health_max;

		this.xp = this.stats.health_max / 10;

		this.state = "spawning";
		this.states = {
			movement: "spawning",
			attack: "primed"
		};

		this.graphics = {};
		this.graphics.selected = this.drawSelected();
		this.add(this.graphics.selected);

		this.health = AssignResource('Health', {
			container: this,
			scene: config.scene,
			x: -14,
			y: -30,
			...this.stats
		});
		this.add(this.health);

		this.banes = new Banes(this.scene, this);

		this.spawn_stop = this.scene.physics.add.staticImage(this.x, config.y, 'blank-gif');
		this.scene.physics.add.collider(this.spawn_stop, this);

		this.setAlpha(0);
		this.scene.tweens.add({ targets: this, alpha: 1, ease: 'Power1', duration: 500});

		// Odd bug where the hit box is offset by 14px. not sure why but compensating here
		this.setInteractive(new Geom.Circle(14, 14, 15), Geom.Circle.Contains);
		this.bringToTop(this.monster);
		
		this.scene.events.on('pointerdown:game', this.deselect, this);
		this.scene.events.on('pointerdown:enemy', this.deselect, this);
		this.once('enemy:dead', this.death, this);

		this.active_group.add(this);
		this.showDebugInfo();
	}

	update(time: number, delta: number): void {
		this.setDepth(this.y);

		if(this.state === "spawned"){
			this.health.update(this);

			this.point = new PhaserMath.Vector2();
			this.point.x = this.x;
			this.point.y = this.y;
			this.distance_to_player = PhaserMath.Distance.BetweenPoints(this, (this.scene as Scene & { player: { x: number; y: number } }).player);

			if(this.distance_to_player < this.attack_radius && this.states.attack === "primed") this.attack();

			this.movementAnimationHandler();

			if(this.destination && PhaserMath.Distance.BetweenPoints(this, this.destination) < 10 && this.states.movement !== "idle"){
				this.setIdle();
			}

			if(this.isInAggroDistance()) {
				if(this.states.movement !== 'chasing') this.setChasing();
				this.move({bias: this.caution});
			}else{
				if(this.target === (this.scene as Scene & { player: unknown }).player) {
					this.target = null;
					this.setIdle();
					this.setWandering();
				}
			}

			if(this.health.getValue() <= 0) this.emit('enemy:dead', this);
		}else{
			this.spawningEnemy();
		}
	}

	setCircling(config: CirclingConfig): void {
		const { from, to, delay, duration, repeat, completeDelay } = config;
		this.caution = from;
		if(!this.circling) {
			this.circling = this.scene.tweens.addCounter({
				from,
				to,
				delay,
				ease: "CubicInOut",
				duration,
				yoyo: true,
				repeat,
				completeDelay,
				onComplete: () => {
					this.stopCircling();
					this.setCircling(config);
				},
				onUpdate: () => {
					this.caution = this.circling!.getValue() ?? 1;
					if(!this.isInCirclingDistance()) this.stopCircling();
				},
			});
		}
	}

	stopCircling(): void {
		if (this.circling) {
			this.circling.remove();
			this.circling = null;
		}
		this.caution = 1;
	}

	isInCirclingDistance(): boolean {
		return this.distance_to_player <= this.circling_radius;
	}

	isInAggroDistance(): boolean {
		return this.distance_to_player <= this.aggro_radius;
	}

	move({target = this.target, bias = 1}: MoveOptions = {}): void {
		if (!target) return;
		const physicsTarget = target as GameObjects.GameObject;
		const speed = Math.min(this.body.maxVelocity.x, this.stats.speed);
		this.scene.physics.accelerateToObject(this, physicsTarget, 200 * bias, speed, speed);
	}

	enemySpawned(): void {
		this.body.setGravityY(0).setDrag(300);
		this.spawn_stop.destroy();
		this.state = "spawned";

		this.scene.physics.add.collider((this.scene as Scene & { player: { hero: Phaser.Physics.Arcade.Sprite } }).player.hero, this);
		this.collider = this.scene.physics.add.collider((this.scene as Scene & { active_enemies: Phaser.GameObjects.Group }).active_enemies, (this.scene as Scene & { active_enemies: Phaser.GameObjects.Group }).active_enemies);

		this.on('pointerdown', () => {
			this.scene.events.emit('pointerdown:enemy', this);
			this.select();
		});

		this.setIdle();
		this.setWandering();
	}

	spawningEnemy(): void {
		if(this.body.touching.down && this.body.wasTouching.down) this.enemySpawned();
	}

	setIdle(): void {
		this.states.movement = "idle";
		this.body.setAcceleration(0);
	}

	wander(): void {
		this.states.movement = "wandering";
		const point = new PhaserMath.Vector2();
		point.x = this.spawn_stop.x + Math.floor(Math.random() * 61) - 30;
		point.y = this.spawn_stop.y + Math.floor(Math.random() * 61) - 30;
		this.destination = point;
		// this.scene.physics.add.staticImage(point.x, point.y, 'blank-gif');

		this.move({target: point});
	}

	setWandering(): void {
		this.wandering_looped_timer = this.scene.time.addEvent({
			delay: 2000 + Math.random() * 1000,
			callback: () => this.wander(),
			callbackScope: this,
			loop: true
		});
	}

	setChasing(): void {
		this.states.movement = "chasing";
		this.body.setAcceleration(0);
		if (this.wandering_looped_timer) {
			this.wandering_looped_timer.remove();
		}
		this.target = (this.scene as Scene & { player: TargetType }).player;
		this.destination = null;
	}

	movementAnimationHandler(): void {
		const is_moving = this.body.velocity.x !== 0;
		const direction = this.body.velocity.x < 0 ? "left-down" : "right-up";
		is_moving ? this.monster.walk(`${this.key}-${direction}`) : this.monster.idle();
	}

	setStats(attributes: EnemyAttributes, wave_multiplier: number): EnemyStats {
		// Stats get adjusted individually as wave go on.
		const stats: Partial<EnemyAttributes> = {};
		stats.damage = Math.round(attributes.damage * (wave_multiplier/5 + 1));
		stats.health_max = attributes.health_max * (wave_multiplier + 1);
		stats.attack_speed = attributes.attack_speed - (wave_multiplier/50);

		return {...attributes, ...stats} as EnemyAttributes;
	}

	drawSelected(): GameObjects.Graphics {
		let size = 5;
		let graphics = this.scene.add.graphics();
				graphics.scaleY = 0.5;
				graphics.lineStyle(4, 0xb93f3c, 0.9);
				graphics.strokeCircle(0, this.height/2 + size, this.width/2 + size);
				graphics.setDepth(10);
				graphics.visible = false;
		return graphics;
	}

	select(): void {
		this.graphics.selected.visible = true;
		this.selected = true;
		(this.scene as Scene & { selected?: Enemy }).selected = this;
	}

	deselect(): void {
		if(this.selected){
			this.graphics.selected.visible = false;
			this.selected = false;
			(this.scene as Scene & { selected?: Enemy | null }).selected = null;
		}
	}

	hit({power, type = 'physical', crit}: HitParams): void {
		this.health.adjustValue(-power, type, crit);
	}

	death(): void {
		this.state = "dead";
		if(this.circling) this.circling.remove();
		if(this.wandering_looped_timer) this.wandering_looped_timer.remove();
		this.deselect();
		this.health.remove();
		this.scene.events.off('pointerdown:enemy', this.deselect, this);
		this.scene.events.off('pointerdown:game', this.deselect, this);
		this.scene.events.emit('enemy:dead', this);
		this.monster.death();
		this.alive = false;
		this.active = false;
		if (this.input) this.input.enabled = false;
		this.scene.physics.world.disable(this);
		(this.scene as Scene & { enemies: Phaser.GameObjects.Group }).enemies.remove(this);
		(this.scene as Scene & { active_enemies: Phaser.GameObjects.Group }).active_enemies.remove(this);
		this.decompose();
		this.dropLoot();
	}

	decompose(): void {
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			ease: 'Power1',
			duration: 10000,
			onComplete: this.cleanup.bind(this)
		});
	}

	cleanup(): void {
		this.destroy();
	}

	dropLoot(): void {
		if(!this.loot_table) return;

		const loot = this.loot_table.map(item => {
			const whole = Math.floor(item.rate / 100);
			const isChance = item.rate % 100 / 100 > Math.random();
			
			const isBonus = Math.random() < 0.25 && (whole > 0 || isChance);
			const bonus = Math.round(Math.random() * item.bonus);
			
			const drop = whole + (isChance ? 1 : 0) + (isBonus ? bonus : 0);

			return Array(drop).fill(item.name);
		}).flat();

		loot.forEach(name => {
			switch(name) {
				case "coin":
					return new Coin({scene:this.scene, x:this.x, y:this.y});
				case "gem":
					// return new Gem({scene:this.scene, x:this.x, y:this.y}); // TODO: Create TypeScript version
					console.warn('Gem loot not implemented in TypeScript yet');
					break;
				default:
					return new Crafting({scene:this.scene, x:this.x, y:this.y, key: name});
			}
		});
	}

	attack(): void {
		if(this.states.attack === "primed") {
			this.states.attack = "recovering";
			this.scene.events.emit('enemy:attack', this.stats.damage);
			this.attack_ready = false;
			this.swing = this.scene.time.addEvent({ 
				delay: this.stats.attack_speed*1000,
				callback: this.attackReady,
				callbackScope: this,
				loop: true
			});
		}
	}

	attackReady(): void {
		this.states.attack = "primed";
		if (this.swing) {
			this.swing.remove(false);
		}
	}

	showDebugInfo(): void {
		if(this.scene.sys.game.config.physics.arcade && this.scene.sys.game.config.physics.arcade.debug) {
			this.add([
				this.scene.add.arc(0, 0, this.attack_radius).setStrokeStyle(1, 0x00ffff),
				this.scene.add.arc(0, 0, this.aggro_radius).setStrokeStyle(1, 0xff1111),
				this.scene.add.arc(0, 0, this.circling_radius).setStrokeStyle(1, 0x550055, 0.5)
			]);
		}
	}
}

export default Enemy;