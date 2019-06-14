import React, { useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import ScrollBar from 'react-perfect-scrollbar';

import { bufferMessageSelector } from '../selectors/message';
import { Reply, AngleRight } from './Icons';
import useHotKey from './hooks/useHotKey';
import Container from './Container';
import types from './types';

import './MessageList.css';

const MessageList = ({ bid, match, history }) => {
  const { ids, messages } = useSelector(
    state => bufferMessageSelector(state, bid),
    [bid],
  );
  const { embedUntrustedImages } = useSelector(state => state.settings);
  
  const scrollElm = useRef(null);

  useEffect(() => {
    scrollElm.current.scrollIntoView({ behaviour: 'smooth' });
  });

  useHotKey('alt+t', () => {
    if (messages.length === 0) {
      return;
    }

    const message = messages[messages.length - 1];
    const tid = message.parent === null ? message.id : message.parent;

    history.push(`${match.url}/thread/${tid}`, {
      bid,
      tid,
    });
  });

  const showCollapsedList = () =>
    messages
      .filter(item => item.parent === null || !ids.includes(item.parent))
      .sort(
        ({ timestamp: timestampA }, { timestamp: timestampB }) =>
          timestampA - timestampB,
      )
      .map((message, idx) => {
        const { type, nick, timestamp, parent, id } = message;
        const previous = messages[idx - 1];
        const tid = id;
        const thread = messages
          .filter(item => item.id === id || item.parent === id)
          .sort(
            ({ timestamp: timestampA }, { timestamp: timestampB }) =>
              timestampA - timestampB,
          );
        // since the replies array contain the parent element, subtract one.
        const amount = thread.length - 1;

        const continouous =
          previous &&
          previous.type.toLowerCase() === type.toLowerCase() &&
          type.toLowerCase() === 'privmsg' &&
          previous.nick === nick &&
          previous.parent === null &&
          parent === null &&
          (timestamp - previous.timestamp) / 1000 <= 300;

        const Message = types[type.toUpperCase()];

        if (!Message) {
          return null;
        }

        if (idx === messages.length - 1) {
          console.log("dispatch")
        }

        return (
          <div key={message.id} className="message-item-container">
            <Message
              bid={bid}
              tid={tid}
              message={message}
              continouous={continouous}
              embed={embedUntrustedImages}
            />
            {amount > 0 && (
              <Container direction="row" className="message-reply">
                <Reply />
                <Link
                  className="message-list-reply"
                  to={{
                    pathname: `${match.url}/thread/${tid}`,
                    state: {
                      tid,
                      bid,
                    },
                  }}
                >
                  {amount > 1 ? `${amount} replies...` : `${amount} reply...`}
                </Link>
                <div className="message-reply-details">
                  <AngleRight />
                </div>
              </Container>
            )}
          </div>
        );
      });

  return (
    <ScrollBar>
      <div className="message-list-container">
        {showCollapsedList()}
        <div ref={scrollElm} />
      </div>
    </ScrollBar>
  );
};

MessageList.propTypes = {
  bid: propTypes.string.isRequired,
  match: propTypes.shape().isRequired,
  history: propTypes.shape().isRequired,
};

export default withRouter(MessageList);
