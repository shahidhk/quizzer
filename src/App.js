import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Question from './components/Question';
import Success from './components/Success';
import Failure from './components/Failure';
import { useAuth0 } from "./react-auth0-spa";

import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* Don't forget to include the history module */}
      <Router history={history}>
        <header>
          <Header />
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/question" component={Question} />
          <Route path="/success" component={Success} />
          <Route path="/failure" component={Failure} />
        </Switch>
      </Router>

    </div>
  );
}

export default App;