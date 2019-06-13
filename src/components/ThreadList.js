import React, { useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ScrollBar from 'react-perfect-scrollbar';

import types from './types';

const ThreadList = ({ thread }) => {
  const { embedUntrustedImages } = useSelector(state => state.settings);
  const scrollElm = useRef(null);

  useEffect(() => {
    scrollElm.current.scrollIntoView({ behaviour: 'smooth' });
  });

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

  return (
    <ScrollBar>
      <div className="message-list-container">{messages}</div>
      <div ref={scrollElm} />
    </ScrollBar>
  );
};

ThreadList.propTypes = {
  thread: propTypes.arrayOf(propTypes.object).isRequired,
};

export default withRouter(ThreadList);
