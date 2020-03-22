import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Question from './components/Question';
import Success from './components/Success';
import Failure from './components/Failure';

function App() {
  return (
    <div className="App">
      <Header />
      {/* <Home />
      <Login />
      <Question /> */}
      {/* <Success /> */}
      <Failure /> 
    </div>
  );
}

export default App;
