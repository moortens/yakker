import React from 'react';

import './Container.css';
import classnames from 'classnames';

const Container = ({ children, className, direction, style, ...rest }) => {
  const klasses = classnames('container', className);

  return (
    <div
      className={klasses}
      style={{ flexDirection: direction, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Container;
