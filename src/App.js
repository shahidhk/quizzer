import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import CertificateAdmin from './components/CertificateAdmin';

import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';

import { getSessionId, createSessionId } from './localstorage';


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
        'x-hasura-session-id': sessionId,
      }
    }
  });

  const httpLink = createHttpLink({
    uri: 'https://summerise-api.shahidh.in/v1/graphql'
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
            <Route path="/" exact component={Home} />
            <Route path="/home" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/quiz/:quizId" component={Quiz} />
            <Route path="/result/:quizId" component={Result} />
            <Route path="/certificate" component={CertificateAdmin} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
