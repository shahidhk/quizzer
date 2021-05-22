import React, {useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { brand } from '../constants';

const Header = () => {
  useEffect(()=>{
    document.fonts.load('35pt Elmessiri')
  });
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Brand href="#">
        <img
          src={brand.navbar_logo_url}
          height="40"
          className="d-inline-block align-top"
          alt="LilBerry logo"
        />
      </Navbar.Brand>
      
    </Navbar>
  );
}

export default Header;
