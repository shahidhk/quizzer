import React from "react";
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Result from './components/Result';

import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';

import { getSessionId, createSessionId } from './localstorage';
import { api_url } from './constants';

import PrivateRoute from './privateRoute';
import { useAuth } from "./context/auth";


const App = () => {

  const { getAccessToken } = useAuth();

  const authLink = setContext(async (_, { headers }) => {
    let sessionId = getSessionId();
    if (sessionId === null) {
      sessionId = createSessionId();
    }
    const token = await getAccessToken();
    return {
      headers: {
        ...headers,
        'authorization': 'Bearer ' + token,
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
            <Route path="/login" exact component={Login} />
            <PrivateRoute path="/" exact component={Home} />
            <PrivateRoute path="/home" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/quiz/:quizId" component={Quiz} />
            <PrivateRoute path="/result/:quizId" component={Result} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
