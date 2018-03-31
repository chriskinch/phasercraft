import HeroIdle from '../Graphics/blank_hero_idle.png';
import HeroSprite from '../Graphics/blank.png';
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
        this.load.image('blank-hero-idle', HeroIdle);
        this.load.spritesheet('blank-hero', HeroSprite, { frameWidth: 64, frameHeight: 64, endFrame: 41 });
    }

    create (){
        let animations = [
            {key: "blank-hero-right", frames: { start: 0, end: 8 }, repeat:-1},
            {key: "blank-hero-left", frames: { start: 9, end: 17 }, repeat:-1},
            {key: "blank-hero-up", frames: { start: 19, end: 26 }, repeat:-1},
            {key: "blank-hero-down", frames: { start: 28, end: 35 }, repeat:-1},
            {key: "blank-hero-swing-right", frames: { start: 36, end: 41 }, repeat:1}
        ]

        animations.forEach(animation => {
            this.anims.create({
                key: animation.key,
                frames: this.anims.generateFrameNumbers('blank-hero', animation.frames),
                frameRate: 12,
                repeat: animation.repeat
            });
        });
        
        this.hero = new Hero({
            scene: this,
            key: 'blank-hero-idle',
            x: 16 * 6, // 3500, 
            y: this.sys.game.config.height - 48 - 48,
            name: "Chris",
            primary_class: "cleric",
            secondary_class: "warrior"
        });

        //this.cameras.main.startFollow(player);

        this.input.mouse.capture = true;
        
        this.keys = {
          space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
    }

    update(time, delta) {
        let mouse = {
            pointer: this.input.activePointer,
            left: { isDown: (this.input.activePointer.buttons === 1 && this.input.activePointer.isDown) },
            middle: { isDown: (this.input.activePointer.buttons === 4 && this.input.activePointer.isDown) },
            right: { isDown: (this.input.activePointer.buttons === 2 && this.input.activePointer.isDown) },
        }

        this.hero.update(mouse, this.keys, time, delta);
    }

    render() {
        game.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);
        game.debug.text("Middle Button: " + game.input.activePointer.middleButton.isDown, 300, 196);
        game.debug.text("Right Button: " + game.input.activePointer.rightButton.isDown, 300, 260);
    }
}

export default GameScene;