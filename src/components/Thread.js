import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { withRouter } from 'react-router-dom';

import { bufferThreadMessageSelector } from '../selectors/message';
import { Close } from './Icons';
import Button from './Button';
import MessageInput from './MessageInput';
import Container from './Container';
import ThreadList from './ThreadList';
import useHotKey from './hooks/useHotKey';

import './Thread.css';

const Thread = ({
  bid,
  match: {
    params: { tid },
  },
  history,
}) => {
  const { messages } = useSelector(
    state => bufferThreadMessageSelector(state, bid, tid),
    [bid, tid],
  );

  useHotKey('esc', () => {
    history.goBack();
  });

  const getUniqueNickString = () => {
    const nicks = [...new Set(messages.map(({ nick }) => nick))];
    if (nicks.length === 0) {
      return '';
    }

    if (nicks.length === 1) {
      return nicks.pop();
    }

    const first = nicks.slice(0, 3);
    const rest = nicks.slice(3);
    if (rest.length > 0) {
      return `${first.join(', ')} and ${rest.length} more`;
    }

    const last = first.pop();

    return `${first.join(', ')} and ${last}`;
  };

  return (
    <div className="thread-container">
      <Container
        direction="column"
        style={{
          justifyContent: 'space-between',
          height: '100%',
          maxHeight: '100%',
          width: '100%',
        }}
      >
        <div className="thread-header">
          <div className="thread-header-text">Thread in #dev</div>
          <div className="thread-header-nicks">{getUniqueNickString()}</div>
          <div className="thread-header-actions">
            <Button onClick={() => history.goBack()}>
              <Close />
            </Button>
          </div>
        </div>
        <Container
          direction="column"
          style={{
            justifyContent: 'space-between',
            height: '100%',
            maxHeight: '100%',
            width: '100%',
          }}
        >
          <ThreadList thread={messages} />

          <div className="thread-input">
            <MessageInput bid={bid} tid={tid} />
          </div>
        </Container>
      </Container>
    </div>
  );
};

Thread.propTypes = {
  bid: propTypes.string.isRequired,
  history: propTypes.shape().isRequired,
  match: propTypes.shape().isRequired,
};

export default withRouter(Thread);
