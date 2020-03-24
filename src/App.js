import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { useAuth0 } from "./react-auth0-spa";

import { Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import history from "./utils/history";

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';


const App = () => {
  const { loading, getTokenSilently } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await getTokenSilently();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  const httpLink = createHttpLink({
    uri: 'https://lilberry-api.wisdomislam.org/v1/graphql'
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
