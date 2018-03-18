var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload (){
    this.load.spritesheet('character', 'Graphics/link.png', { frameWidth: 32, frameHeight: 24, endFrame: 23 });
}

function create (){
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
}