import Wayne3D from '../Graphics/fonts/wayne-3d.png';

class BootScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'BootScene'
		});
	}

	preload(){
		this.load.image('wayne-3d', Wayne3D);
    }

   	create(){
		this.scene.start('LoadScene');
	}
}

export default BootScene;