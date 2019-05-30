import React from 'react';
import propTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Container from './Container';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';
import Userlist from './Userlist';

const Buffer = ({ location: { state: { bid = null } = {} } }) => {
  console.log(bid)
  if (bid === undefined || bid === null) {
    return <Redirect to="/" />;
  }

  return (
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
        <MessageList bid={bid} />
        <Userlist bid={bid} />
      </Container>
      <MessageInput bid={bid} />
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
