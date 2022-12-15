import React from 'react';
import { NavLink } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
// @ts-expect-error
// eslint-disable-next-line react/prop-types
export const CustomToggle = React.forwardRef(({ children, onClick }) => (
  <NavLink
    href=''
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </NavLink>
));

CustomToggle.displayName = 'CustomToggle';
