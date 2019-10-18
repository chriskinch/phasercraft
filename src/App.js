import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Game from "./Game"
import UI from "./UI/UI";
import { Provider } from "react-redux";

import store from "./store";

document.body.setAttribute("style", "margin:0;");

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div
          style={{
            // display: "flex",
            // alignContent: "center",
            // justifyContent: "center",
            // flexDirection: "row",
            height: "100vh",
            width: "100vw"
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