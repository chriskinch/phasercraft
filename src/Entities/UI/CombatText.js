class CombatText extends Phaser.GameObjects.Text {
	constructor(scene, { x, y, value, type }) {
        const color = { physical: '#fff', magic: '#ef0', burn: '#fa0', bleed: '#f33', poison: '#5c5', heal: '#7c6' }
        super(scene, x, y-25, value, { 
            fontFamily: 'VT323',
            fontSize: '18px',
            stroke: '#000',
            color: color[type],
            strokeThickness: 5,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: false
            }
        });
        
        this.scene.physics.world.enable(this);

        const rand_plus_minus = Math.random() - 0.5;
        this.body.setVelocity(120 * rand_plus_minus, -60).setGravityY(200);
        this.setOrigin(0.5);

        this.scene.add.existing(this);

        this.scene.add.tween({
            targets: this,
            ease: 'Sine.easeInOut',
            duration: 500,
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