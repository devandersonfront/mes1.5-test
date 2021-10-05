import * as React from 'react';

import { StyledChild } from './styles';

const Child: React.FC<ReactResizeable.ChildProps> = React.forwardRef(
  ({ children, resize, ...props }, ref) => (
    <StyledChild ref={ref} {...resize} {...props}>
      {children}
    </StyledChild>
  )
);

export default Child;
