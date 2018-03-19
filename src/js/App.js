import '../css/style.css';

// import 'pixi';
// import 'p2';
// import Phaser from 'phaser';
import 'pixi';
import 'p2';
import * as Phaser from 'phaser';

import Title from 'states/Title';
import Main from 'states/Main';

class Game extends Phaser.Game {

    constructor() {
        super("100%", "100%", Phaser.CANVAS, 'picoplanetGameArea');

        this.state.add('Title', Title, false);
        this.state.add('Main', Main, false);

        this.state.start('Main');
    }

    // create() {
    //     console.log("APP CREATE!");
    // }

    // update() {
    //     console.log("APP UPDATE!");
    // }
};

new Game();