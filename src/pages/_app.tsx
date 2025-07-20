import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import store from '@store';
import { ApolloProvider, ApolloClient } from "@apollo/client"
import { cache } from "./cache.js"

// import HTML5Backend from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache,
    defaultOptions: {
        query: {
            fetchPolicy: 'cache-first',
        },
    },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
          <Provider store={store}>
              <DndProvider backend={TouchBackend} options={{enableMouseEvents: true, preview: true}}>
                  <Component {...pageProps} />
              </DndProvider>
          </Provider>
      </ApolloProvider>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=VT323&display=swap');
        
        body {
          margin: 0;
          font-size: 14px;
          font-family: 'VT323', monospace;
        }
        
        button {
          font-family: 'VT323', monospace;
          font-weight: bold;
        }
        
        h1, h2, h3, h4, h5, h6 {
          margin-bottom: 0.5em;
          margin-top: 0;
        }
      `}</style>
    </>
  );
}