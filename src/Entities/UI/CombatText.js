import { GameObjects } from 'phaser';

class CombatText extends GameObjects.Text {
	constructor(scene, { x, y, value, type, crit, wander = 1, length = 500, speed = 60, gravity = 200}) {
        const color = {
            physical: '#fff',
            magic: '#ef0',
            burn: '#fa0',
            bleed: '#f33',
            poison: '#5c5',
            heal: '#7c6',
            health: '#9c6',
            level: '#8f0'
        }

        super(scene, x, y-25, value, { 
            fontFamily: 'VT323',
            fontSize: (crit) ? '21px' : '16px',
            stroke: (crit) ? '#800' : '#000',
            color: (type) ? color[type] : '#fff',
            strokeThickness: 5,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000',
                blur: 1,
                stroke: true,
                fill: false
            }
        });
        
        this.scene.physics.world.enable(this);

        const rand_plus_minus = (Math.random() - 0.5) * wander;
        this.body.setVelocity(120 * rand_plus_minus, -speed).setGravityY(gravity);
        this.setOrigin(0.5);

        this.scene.add.existing(this);

        this.scene.add.tween({
            targets: this,
            ease: 'Sine.easeInOut',
            duration: length,
            delay: 250,
            alpha: {
                from: 1,
                to: 0
            },
            onComplete: () => this.destroy()
        });
    }

    getRandomVelocity(){
		let min = 50;
		let max = 100;
		let v = min + (Math.random() * (max-min));
		let absV = (Math.random() >= 0.5) ? -v : v;
		return absV;
	}
}

export default CombatText;