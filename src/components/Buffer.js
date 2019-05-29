import React from 'react';
import propTypes from 'prop-types';

import Container from './Container';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';
import Userlist from './Userlist';

const Buffer = ({
  location: {
    state: { bid },
  },
}) => {
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
  location: propTypes.shape().isRequired,
};

export default Buffer;
