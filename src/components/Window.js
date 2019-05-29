import React from 'react';

import Container from './Container';

class Window extends React.Component {
  render() {
    return (
      <Container
        direction="column"
        style={{
          justifyContent: 'space-between',
          height: '100vh',
          maxHeight: '100vh',
          width: '100%',
        }}
      />
    );
  }
}

export default Window;
