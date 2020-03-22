import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../logo.svg';

const Header = () => (
  <Navbar bg="light" variant="light">
    <Navbar.Brand href="#home">
      <img
        alt=""
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      QBerry
    </Navbar.Brand>
  </Navbar>
);

export default Header;