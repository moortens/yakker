import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import './TypingIndicator.css';

export default ({ bid }) => {
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

  if (!typings) {
    return null;
  }

  return (
    <div className="typing-container">
      {typings.map(({ nick }) => (
        <div>{nick}</div>
      ))}
    </div>
  );
};
