export default function createAnimations(scene){
	if(scene.sys.game.init) return;
	scene.sys.game.init = true;

	let player_animations = [
		{key: "player-idle", frames: { start: 12, end: 17 }, repeat: -1},
		{key: "player-right-up", frames: { start: 0, end: 5 }, repeat: -1},
		{key: "player-left-down", frames: { start: 6, end: 11 }, repeat: -1},
		{key: "player-death", frames: { start: 18, end: 23 }, repeat: 0}
	];

	player_animations.forEach(animation => {
		scene.anims.create({
			key: animation.key,
			frames: scene.anims.generateFrameNumbers('player', animation.frames),
			frameRate: 12,
			repeat: animation.repeat
		});
	});

	scene.anims.create({
		key: 'attack',
		frames: scene.anims.generateFrameNumbers('attack-swoosh', { start: 0, end: 3 }),
		frameRate: 12,
		repeat: 0,
		showOnStart: true,
		hideOnComplete: true
	});

	// Enemies
	let enemies = {
		atlas: 'enemy',
		types:[{
			frame: 'baby-ghoul',
			frameWidth: 24,
			frameHeight: 26,
			animations:[{
				key: 'baby-ghoul-right-up',
			 	frames: { start: 0, end: 5 },
			 	repeat: -1
			},{
				key: 'baby-ghoul-left-down',
			 	frames: { start: 6, end: 11 },
			 	repeat: -1
			},{
				key: "baby-ghoul-death",
				frames: { start: 12, end: 15 },
				repeat: 0
			}]
		},{
			frame: 'imp',
			frameWidth: 24,
			frameHeight: 30,
			animations:[{
				key: 'imp-right-up',
			 	frames: { start: 0, end: 5 },
			 	repeat: -1
			},{
				key: 'imp-left-down',
			 	frames: { start: 6, end: 11 },
			 	repeat: -1
			},{
				key: "imp-death",
				frames: { start: 12, end: 15 },
				repeat: 0
			}]
		},{
			frame: 'ghoul',
			frameWidth: 24,
			frameHeight: 32,
			animations:[{
				key: 'ghoul-right-up',
			 	frames: { start: 0, end: 5 },
			 	repeat: -1
			},{
				key: 'ghoul-left-down',
			 	frames: { start: 6, end: 11 },
			 	repeat: -1
			},{
				key: "ghoul-death",
				frames: { start: 12, end: 16 },
				repeat: 0
			}]
		},{
			frame: 'satyr',
			frameWidth: 24,
			frameHeight: 32,
			animations:[{
				key: 'satyr-right-up',
			 	frames: { start: 0, end: 5 },
			 	repeat: -1
			},{
				key: 'satyr-left-down',
			 	frames: { start: 6, end: 11 },
			 	repeat: -1
			},{
				key: "satyr-death",
				frames: { start: 12, end: 16 },
				repeat: 0
			}]
		},{
			frame: 'egbert',
			frameWidth: 24,
			frameHeight: 30,
			animations:[{
				key: 'egbert-right-up',
			 	frames: { start: 0, end: 5 },
			 	repeat: -1
			},{
				key: 'egbert-left-down',
			 	frames: { start: 6, end: 11 },
			 	repeat: -1
			},{
				key: "egbert-death",
				frames: { start: 12, end: 15 },
				repeat: 0
			}]
		},{
			frame: 'slime',
			frameWidth: 30,
			frameHeight: 32,
			animations:[{
				key: 'slime-right-up',
			 	frames: { start: 0, end: 3 },
			 	repeat: -1
			},{
				key: 'slime-left-down',
			 	frames: { start: 4, end: 7 },
			 	repeat: -1
			},{
				key: "slime-death",
				frames: { start: 8, end: 11 },
				repeat: 0
			}]
		}]
	};

	enemies.types.forEach(enemy => {
		scene.textures.addSpriteSheetFromAtlas(enemy.frame, {
			atlas: enemies.atlas,
			frame: enemy.frame,
			frameWidth: enemy.frameWidth,
			frameHeight: enemy.frameHeight
		});

		enemy.animations.forEach(animation => {
			scene.anims.create({
				key: animation.key,
				frames: scene.anims.generateFrameNumbers(enemy.frame, animation.frames),
				frameRate: 12,
				repeat: animation.repeat
			});
		});
	});
}