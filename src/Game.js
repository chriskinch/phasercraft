import Phaser from "phaser";
import ExampleScene from "./Scenes/ExampleScene";

import * as React from "react";

import { GAME_HEIGHT, GAME_WIDTH } from "./config";

export default class IGame extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: "phaser-game",
      scene: [ExampleScene]
    };

    new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id="phaser-game" />;
  }
}
