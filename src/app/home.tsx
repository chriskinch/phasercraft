"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import store from "@store";
import { ApolloProvider, ApolloClient } from "@apollo/client";
import { cache } from "../lib/cache";

// import HTML5Backend from 'react-dnd-html5-backend'
import { TouchBackend } from "react-dnd-touch-backend";
import { DndProvider } from "react-dnd";
import UI from "@ui/UI";

const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache,
    defaultOptions: {
        query: {
            fetchPolicy: "cache-first",
        },
    },
});

const PhaserGameWithoutSSR = dynamic(() => import("../PhaserGame"), { ssr: false });

// This is a Client Component (same as components in the `pages` directory)
// It receives data as props, has access to state and effects, and is
// prerendered on the server during the initial page load.
export default function Home() {
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <DndProvider
                    backend={TouchBackend}
                    options={{ enableMouseEvents: true, preview: true }}
                >
                    <UI />
                    <PhaserGameWithoutSSR />
                </DndProvider>
            </Provider>
        </ApolloProvider>
    );
}
