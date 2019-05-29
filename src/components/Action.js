import React from 'react';
import propTypes from 'prop-types';

import './Action.css';

const Button = ({ onClickEvent, children }) => (
  <button type="button" onClick={onClickEvent} className="action">
    {children}
  </button>
);

Button.propTypes = {
  onClickEvent: propTypes.func.isRequired,
  children: propTypes.node.isRequired,
};

export default Button;
