import React from 'react';
import './App.css';
import Header from './components/Header';

import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';

import { getSessionId, createSessionId } from './localstorage';
import { api_url } from './constants';
import Certificate from './components/Certificate';
import CertificateAdmin from './components/CertificateAdmin';


const App = () => {

  const authLink = setContext(async (_, { headers }) => {
    let sessionId = getSessionId();
    if (sessionId === null) {
      sessionId = createSessionId();
    }
    return {
      headers: {
        ...headers,
        'x-hasura-role': 'anonymous',
      }
    }
  });

  const httpLink = createHttpLink({
    uri: api_url
  })

  const createApolloClient = () => {
    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  };

  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <div className="App">
        {/* Don't forget to include the history module */}
        <Router history={history}>
          <header>
            <Header />
          </header>
          <Switch>
            <Route path="/" exact component={Certificate} />
            <Route path="/admin" exact component={CertificateAdmin} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
