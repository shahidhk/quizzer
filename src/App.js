import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Question from './components/Question';
import Success from './components/Success';
import Failure from './components/Failure';
import { useAuth0 } from "./react-auth0-spa";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Header />
      <Home />
      <Login />
      <Question />
      <Success />
      <Failure />
    </div>
  );
}

export default App;