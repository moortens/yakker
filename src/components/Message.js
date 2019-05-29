import React from 'react';

import Join from './types/Join';
import Part from './types/Part';
import Quit from './types/Quit';
import Kick from './types/Kick';
import Privmsg from './types/Privmsg';

const Message = ({ message, ...props }) => {
  const { type } = message;
  const handlers = {
    JOIN: Join,
    PART: Part,
    QUIT: Quit,
    KICK: Kick,
    PRIVMSG: Privmsg,
  };

  const MessageHandler = handlers[type.toUpperCase()];

  return <MessageHandler message={message} {...props} />;
};

export default Message;
