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
		// this.scene.start('LoadScene');

		var style = {
			'background-color': 'lime',
			'width': '220px',
			'height': '100px',
			'font': '48px Arial',
			'font-weight': 'bold'
		};
		var element = this.add.dom(400, 300, 'div', style, 'Phaser 3');
	}
}

export default BootScene;