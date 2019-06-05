import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import types from './types';

const ThreadList = ({ thread }) => {
  const { embedUntrustedImages } = useSelector(state => state.settings);

  const messages = thread.map((message, idx) => {
    const { type, nick, timestamp } = message;

    const Message = types[type.toUpperCase()];

    if (!Message) {
      return null;
    }

    const previous = thread[idx - 1];

    const continouous =
      previous &&
      previous.type.toLowerCase() === type.toLowerCase() &&
      type.toLowerCase() === 'privmsg' &&
      previous.nick === nick &&
      (timestamp - previous.timestamp) / 1000 <= 300;

    return (
      <div className="message-item-container">
        <Message
          key={message.id}
          message={message}
          continouous={continouous}
          embed={embedUntrustedImages}
          thread
        />
      </div>
    );
  });

  return <div className="message-list-container">{messages}</div>;
};

export default withRouter(ThreadList);
