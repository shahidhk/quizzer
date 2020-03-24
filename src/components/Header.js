import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from "../react-auth0-spa";
import { LinkContainer } from "react-router-bootstrap";
import logo from '../images/logo.png';

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand href="#">
        <img
          src={logo}
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
          {isAuthenticated && (
            <>
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
            </>
          )}
          {!isAuthenticated && (
            <Button onClick={() => loginWithRedirect({})}>Log In</Button>
          )}
          {isAuthenticated && <Button onClick={() => logout()}>Log out</Button>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;