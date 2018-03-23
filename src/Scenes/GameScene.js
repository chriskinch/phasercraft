import Link from '../Graphics/link.png'
import Hero from '../Entities/Hero';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super();
        game: Phaser.Game;
    }

    preload (){
        this.load.spritesheet('character', Link, { frameWidth: 32, frameHeight: 24, endFrame: 23 });
    }

    create (){
        var config = {
            key: 'walk',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 8, first: 8 }),
            frameRate: 8,
            repeat: 1000
        };

        console.log(this.anims)

        this.anims.create(config);

        var character = this.add.sprite(400, 300, 'character');

        character.anims.play('walk');

        let Player = new Hero({
            name: "Chris",
            primary_class: "cleric"
        });

        console.log(Player)
    }
}