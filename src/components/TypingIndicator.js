import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';

import './TypingIndicator.css';

const TypingIndicator = ({ bid }) => {
  const typings = useSelector(state => {
    if (state.typing[bid] === undefined) {
      return [];
    }

    return state.typing[bid].map(({ uid }) => {
      return {
        ...state.userlist.entities[uid],
      };
    });
  });

  const getUniqueNickString = () => {
    const nicks = typings.map(({ nick }) => nick);
    if (nicks.length === 0) {
      return '';
    }

    if (nicks.length === 1) {
      return `${nicks.pop()} is typing`;
    }

    const first = nicks.slice(0, 3);
    const rest = nicks.slice(3);
    if (rest.length > 0) {
      return `${first.join(', ')} and ${rest.length} more are typing`;
    }

    const last = first.pop();

    return `${first.join(', ')} and ${last} are typing`;
  };

  return (
    <div className="typing-container">
      {typings.length !== 0 && (
        <div className="typing-text">
          <span>{getUniqueNickString()}</span>
          <span className="typing-animation" />
        </div>
      )}
    </div>
  );
};

TypingIndicator.propTypes = {
  bid: propTypes.string.isRequired,
};

export default TypingIndicator;
