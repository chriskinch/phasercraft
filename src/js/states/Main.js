import Planet from 'objects/Planet.js';
import Pallet from 'objects/Pallet.js';

class Main extends Phaser.State {
 	constructor() {
        super();
    }

    preload() {
        this.game.load.bitmapFont('carrier_command', '/src/assets/fonts/bitmap/carrier_command.png', '/src/assets/fonts/bitmap/carrier_command.xml');
        this.game.load.image('block', '/src/assets/sprites/block.png');
    }
 
    create() {
 		console.log("MAIN CREATE!");

 		this.game.updateEvent = new Phaser.Signal();

 		this.game.stage.backgroundColor = 0x444444;

        let earth = new Planet(this.game, {diameter:200, slots:7});
        earth.createPlanet();
        console.log("what");
		this.sprite = this.game.add.sprite(150, 300, 'block');
		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.bmpText = this.game.add.bitmapText(10, 100, 'carrier_command','Drag me around !',34);
        this.bmpText.inputEnabled = true;
        
        let button = this.game.add.button(20, 20, 'button', this.actionOnClick, this, 2, 1, 0);
        button.input.enableDrag();

        let pallet = new Pallet({ game: this.game, x: 300, y: 200 });

        this.game.input.onDown.add(function() {
           pallet.create(361); 
        }.bind(this));

        this.game.input.onUp.add(function() {
           pallet.destroy();
        }.bind(this));
    }
 
    update() {
    	this.game.updateEvent.dispatch();
 		//console.log("MAIN UPDATE!");
 		//this.pallet.update();

		//  only move when you click
		if (this.game.input.mousePointer.isDown) {
		//  400 is the speed it will move towards the mouse
			this.game.physics.arcade.moveToPointer(this.sprite, 400);

			//  if it's overlapping the mouse, don't move any more
			if (Phaser.Rectangle.contains(this.sprite.body, this.game.input.x, this.game.input.y)) {
				this.sprite.body.velocity.setTo(0, 0);
			}
		} else {
			this.sprite.body.velocity.setTo(0, 0);
		}
    }

    actionOnClick () {
        var blockSprite = this.game.add.sprite(150, 300, 'block');
         //  Input Enable the sprites
        blockSprite.inputEnabled = true;
        //  Allow dragging - the 'true' parameter will make the sprite snap to the center
        blockSprite.input.enableDrag(true);
    }
 
};

export default Main;