import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Container from './Container';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';
import Userlist from './Userlist';
import Thread from './Thread';

import './Buffer.css';
import TypingIndicator from './TypingIndicator';

const Buffer = ({ location: { state: { bid = null } = {} } }) => {
  const buffer = useSelector(state => state.buffer.entities[bid]);

  useEffect(() => {
    if (buffer === undefined) {
      return;
    }

    const { name } = buffer;

    document.title = `${name}`;
  }, [buffer]);

  if (bid === null || buffer === undefined) {
    return <Redirect to="/" />;
  }

  return (
    <Container
      direction="row"
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100vh',
      }}
    >
      <Container
        direction="column"
        style={{
          justifyContent: 'space-between',
          height: '100vh',
          maxHeight: '100vh',
          width: '100%',
        }}
      >
        <Header bid={bid} />
        <Container
          direction="row"
          style={{
            width: '100%',
            height: 'inherit',
          }}
        >
          <Container
            direction="column"
            style={{
              justifyContent: 'space-between',
              height: '100%',
              maxHeight: '100%',
              width: '100%',
            }}
          >
            <MessageList bid={bid} />
            <div className="buffer-input">
              <MessageInput editor="main" bid={bid} />
            </div>
            <TypingIndicator bid={bid} />
          </Container>
          <Route
            render={() => <Userlist bid={bid} />}
            path="/channel/:channel/details"
            exact
          />
        </Container>
      </Container>
      <Route
        render={() => <Thread bid={bid} />}
        path="/channel/:channel/thread/:tid"
        exact
      />
    </Container>
  );
};

Buffer.propTypes = {
  location: propTypes.shape(),
};

Buffer.defaultProps = {
  location: {
    state: {
      bid: null,
    },
  },
};

export default Buffer;
