import 'pixi'
import 'p2'
import Phaser from 'phaser'

class Planet {
    constructor (game, {diameter = 100, slots = null}){
        this.game = game;
        this.diameter = diameter;
        this.slots = slots;
    }

    createPlanet() {
        let circle = new Phaser.Circle(this.game.world.centerX, this.game.world.centerY, this.diameter);

        //  And display our circle on the top
        let graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x66cc77);
            graphics.drawCircle(circle.x, circle.y, circle.diameter);
    }

    getDiameter() {
        return this.diameter;
    }
}

export default Planet;