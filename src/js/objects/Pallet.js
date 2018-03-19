
class Pallet extends Phaser.Graphics {
    constructor({ game, x, y }){
        super(game, x, y);
        this.game = game;
        this.angle = { min: 0, max: 0 };
        this.graphics;
    }

    create ( max ){
        this.graphics = this.game.add.graphics(this.game.world.centerX, this.game.world.centerY);
        this.tween = this.game.add.tween(this.angle).to( { max: max }, 300, "Linear", true, 0, 0, false);
        this.game.updateEvent.add(this.update, this);
    }

    update(){
        console.log("update");
        this.graphics.clear();
        this.graphics.lineStyle(30, 0xffd9cc);
        this.graphics.arc(0, 0, 135, this.game.math.degToRad(this.angle.min), this.game.math.degToRad(this.angle.max), false);
    }

    destroy() {
        this.angle.max = 0;
        this.tween = this.game.add.tween(this.angle).to( { max: this.max }, 300, "Linear", true, 0, 0, false);
        this.tween.onComplete.add(this.killUpdate, this);
    }

    killUpdate(){
        console.log(this);
        if(this.angle.max == 0) {
            this.game.updateEvent.remove(this.update, this);
            this.graphics.clear();
        }
    }
}

export default Pallet;