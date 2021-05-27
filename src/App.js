import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Game from "./Game"
import UI from "@UI/UI";
import { Provider } from "react-redux";

import store from "@store";

import { ApolloProvider, ApolloClient } from "@apollo/client"
import { cache } from "./cache"

// import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    // typeDefs,
    cache,
})

document.body.setAttribute("style", "margin:0;");

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
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
            </ApolloProvider>
        );
    }
}

export default App;