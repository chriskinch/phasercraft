import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Game from "./Game"
import UI from "@UI/UI";
import { Provider } from "react-redux";

import store from "@store";

// import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';

document.body.setAttribute("style", "margin:0;");

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <DndProvider backend={TouchBackend} options={{enableMouseEvents: true, preview: true}}>
                    <div
                        style={{
                            height: "375px",
                            width: "667px"
                        }}>
                        <UI />
                        <Game />
                    </div>
                </DndProvider>
            </Provider>
        );
    }
}

export default App;