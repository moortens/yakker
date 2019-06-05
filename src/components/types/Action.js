import React from 'react';

import Container from '../Container';
import TextFormatter from '../TextFormatter';
import Avatar from '../Avatar';

import './Action.css';

const Action = ({ message, ...props }) => {
  return (
    <Container direction="row" className="action-container">
      <div className="action-gutter" />
      <div className="action-avatar">
        <Avatar text={message.nick} small />
      </div>
      <div className="action-user">{message.nick}</div>
      <div className="action-main">
        <TextFormatter
          className="action-data"
          text={message.data}
          {...props}
        />
      </div>
      <div className="action-time">
        {message.timestamp.toLocaleTimeString('default', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </div>
    </Container>
  );
};

export default Action;
