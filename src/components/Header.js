import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from "../react-auth0-spa";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand href="#home">LilBerry</Navbar.Brand>
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
              <LinkContainer to="/question">
                <Nav.Link>Question</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/congrats">
                <Nav.Link>Success</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/sorry">
                <Nav.Link>Failure</Nav.Link>
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