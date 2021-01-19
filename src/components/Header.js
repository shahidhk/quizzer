import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";
import NewSession from './NewSession';

import { brand } from '../constants';

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand href="#">
        <img
          src={brand.navbar_logo_url}
          height="50"
          className="d-inline-block align-top"
          alt="LilBerry logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
        </Nav>
        <Nav>
          <>
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {/* <LinkContainer to="/profile">
              <Nav.Link>Profile</Nav.Link>
            </LinkContainer> */}
            <NewSession />
          </>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
