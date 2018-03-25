import LinkIdle from '../Graphics/blank_hero_idle.png';
import LinkRight from '../Graphics/blank_hero_right.png';
import Hero from '../Entities/Hero';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
          key: 'GameScene'
        });
        game: Phaser.Game;
    }

    preload (){
        this.load.image('blank-hero-idle', LinkIdle);
        this.load.spritesheet('blank-hero-right', LinkRight, { frameWidth: 64, frameHeight: 64, endFrame: 9 });
    }

    create (){
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('blank-hero-right', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        this.hero = new Hero({
            scene: this,
            key: 'blank-hero-idle',
            x: 16 * 6, // 3500, 
            y: this.sys.game.config.height - 48 - 48,
            name: "Chris",
            primary_class: "cleric"
        });
        console.log(this.hero)

        this.keys = {
          up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
          down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        };
    }

    update(time, delta) {
        this.hero.update(this.keys, time, delta);
    }
}

export default GameScene;