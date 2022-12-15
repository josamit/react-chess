import React, { FC } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { UserProfileDropdown } from './userProfileDropdown';

const NavbarContainer: FC = () => {
  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand href='#home'>
          <img
            src={logo}
            width='108'
            height='30'
            alt='Reactive Chess Logo'
            className='d-inline-block align-top'
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/'>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to='/game'>
              Game
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className='justify-content-end'>
          <UserProfileDropdown />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarContainer;
