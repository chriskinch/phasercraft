import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Game from "./Game";
import UI from "./UI";
import { Provider } from "react-redux";

import store from "./store";

// import 'phaser';
// import LoadScene from './Scenes/LoadScene';
// import GameScene from './Scenes/GameScene';
// import GameOverScene from './Scenes/GameOverScene';
// import SelectScene from './Scenes/SelectScene';

document.body.setAttribute("style", "margin:0;");

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            flexDirection: "row",
            height: "100vh"
          }}
        >
          <UI />
          <Game />
        </div>
      </Provider>
    );
  }
}

export default App;