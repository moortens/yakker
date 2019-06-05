import React from 'react';
import propTypes from 'prop-types';
import classnames from 'classnames';

import './Avatar.css';

const Avatar = ({ text, small, saturation, lightness }) => {
  const toHslColor = () => {
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
  };

  const classes = classnames('avatar', {
    'avatar-small': small,
    'avatar-large': !small,
  });

  return (
    <div style={{ backgroundColor: toHslColor() }} className={classes}>
      {small ? null : text.charAt(0).toUpperCase()}
    </div>
  );
};

Avatar.propTypes = {
  text: propTypes.string.isRequired,
  small: propTypes.bool,
  saturation: propTypes.number,
  lightness: propTypes.number,
};

Avatar.defaultProps = {
  small: false,
  saturation: 40,
  lightness: 80,
};

export default Avatar;
