import React from 'react';
import Action from './Action';
import { useSelector } from 'react-redux';
import { bufferThreadMessageSelector } from '../selectors/message';
import { withRouter } from 'react-router-dom';
import './Thread.css';
import MessageInput from './MessageInput';
import Container from './Container';
import ThreadList from './ThreadList';
import { Close } from './Icons';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import useHotKey from './hooks/useHotKey';

const Thread = ({
  bid,
  match: {
    params: { tid },
  },
  history,
}) => {
  const { ids, messages } = useSelector(
    state => bufferThreadMessageSelector(state, bid, tid),
    [bid, tid],
  );

  useHotKey('esc', () => {
    history.goBack();
  });

  const getUniqueNickString = () => {
    const nicks = [...new Set(messages.map(({ nick }) => nick))]
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
            <Action onClickEvent={() => history.goBack()}>
              <Close />
            </Action>
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

export default withRouter(Thread);
