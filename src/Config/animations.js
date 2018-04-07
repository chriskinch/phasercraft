export default function createAnimations(scene){
	let player_animations = [
		{key: "player-idle", frames: { start: 12, end: 17 }, repeat: -1},
		{key: "player-right-up", frames: { start: 0, end: 5 }, repeat: -1},
		{key: "player-left-down", frames: { start: 6, end: 11 }, repeat: -1},
		{key: "player-death", frames: { start: 18, end: 23 }, repeat: 0}
	]

	player_animations.forEach(animation => {
		scene.anims.create({
			key: animation.key,
			frames: scene.anims.generateFrameNumbers('player', animation.frames),
			frameRate: 12,
			repeat: animation.repeat
		});
	});

	let enemy_animations = [
		{key: "enemy-right-up", frames: { start: 0, end: 5 }},
		{key: "enemy-left-down", frames: { start: 6, end: 11 }}
	]

	enemy_animations.forEach(animation => {
		scene.anims.create({
			key: animation.key,
			frames: scene.anims.generateFrameNumbers('enemy', animation.frames),
			frameRate: 12,
			repeat: -1
		});
	});
}