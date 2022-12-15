import { Dropdown } from 'react-bootstrap';
import { CustomToggle } from './CustomToggle';
import { CustomMenu } from './CustomMenu';
import React from 'react';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const UserProfileDropdown: React.FC = () => (
  <Dropdown>
    <Dropdown.Toggle as={CustomToggle} id='user-profile-dropdown'>
      <FontAwesomeIcon icon={faCircleUser} size='xl' />
    </Dropdown.Toggle>

    <Dropdown.Menu as={CustomMenu}>
      <Dropdown.Item eventKey='1'>Red</Dropdown.Item>
      <Dropdown.Item eventKey='2'>Blue</Dropdown.Item>
      <Dropdown.Item eventKey='3' active>
        Orange
      </Dropdown.Item>
      <Dropdown.Item eventKey='1'>Red-Orange</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);
