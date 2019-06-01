import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { bufferMessageSelector } from '../selectors/message';
import Message from './Message';

import './MessageList.css';

const MessageList = ({ bid }) => {
  const { ids, messages } = useSelector(
    state => bufferMessageSelector(state, bid),
    [bid],
  );
  const { embedUntrustedImages } = useSelector(state => state.settings);

  const isContinouousMessage = idx => {
    const previousMessage = messages[idx - 1];
    const currentMessage = messages[idx];

    if (!previousMessage) {
      return false;
    }

    // hard-coded to 300 seconds per now.
    return (
      previousMessage.nick === currentMessage.nick &&
      (currentMessage.timestamp - previousMessage.timestamp) / 1000 <= 300
    );
  };

  const showCollapsedList = () => {
    return messages
      .filter(item => item.parent === null || !ids.includes(item.parent))
      .map((message, idx) => {
        const replies = messages.filter(item => item.parent === message.id);

        return (
          <Message
            key={message.id}
            message={message}
            replies={replies}
            continouous={isContinouousMessage(idx)}
            embed={embedUntrustedImages}
          />
        );
      });
  };

  return (
    <div
      style={{
        flexGrow: 1,
        overflow: 'auto',
        height: '100%',
        paddingTop: '15px',
      }}
    >
      {showCollapsedList()}
    </div>
  );
};

MessageList.propTypes = {
  bid: propTypes.string.isRequired,
};

export default MessageList;
