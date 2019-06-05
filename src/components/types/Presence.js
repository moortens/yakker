/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import Container from '../Container';
import Avatar from '../Avatar';

import './Presence.css';

const types = {
  JOIN: 'joined',
  PART: 'left',
  QUIT: 'quit',
};

const Join = ({ message, ...props }) => {
  const { type, timestamp = new Date(), data } = message;

  const verb = types[type.toUpperCase()];

  return (
    <Container direction="row" className="presence-container">
      <div className="presence-gutter" />
      <div className="presence-avatar">
        <Avatar text={message.nick} small />
      </div>
      <div className="presence-user">{message.nick}</div>
      <div className="presence-action">
        <span>
          {verb} ({message.ident}@{message.hostname})
        </span>
        {data && <span>({message.data})</span>}
      </div>
      <div className="presence-time">
        {timestamp.toLocaleTimeString('default', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </div>
    </Container>
  );
};

export default Join;
