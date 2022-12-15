import React from 'react';

export const CustomMenu = React.forwardRef(
  // @ts-expect-error
  // eslint-disable-next-line react/prop-types
  ({ children, style, className, 'aria-labelledby': labeledBy }) => (
    <div style={style} className={className} aria-labelledby={labeledBy}>
      {children}
    </div>
  ),
);

CustomMenu.displayName = 'CustomMenu';
