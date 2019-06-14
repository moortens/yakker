import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { HorizontalBox, VerticalBox } from './Box';
import TypingIndicator from './TypingIndicator';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';
import Userlist from './Userlist';
import Thread from './Thread';

const InputPadding = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 5px;
`;

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
    <HorizontalBox viewport>
      <VerticalBox justifyContent="space-between" width="100%">
        <Header bid={bid} />
        <VerticalBox justifyContent="space-between" width="100%" height="100%">
          <MessageList bid={bid} />
          <InputPadding>
            <MessageInput editor="main" bid={bid} />
          </InputPadding>
          <TypingIndicator bid={bid} />
        </VerticalBox>
      </VerticalBox>
      <Route
        render={() => <Thread bid={bid} />}
        path="/channel/:channel/thread/:tid"
        exact
      />
      <Route
        render={() => <Userlist bid={bid} />}
        path="/channel/:channel/details"
        exact
      />
    </HorizontalBox>
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
