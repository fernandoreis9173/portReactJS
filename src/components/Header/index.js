import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

class Header extends Component {
  render() {
    return (
      <Navbar bg="primary" variant="dark" className="fixed-top">
        <Navbar.Brand href="#">Agenda Usando ReactJS + NodeJS</Navbar.Brand>
      </Navbar>
    );
  }
}

export default Header;