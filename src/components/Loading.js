import React from 'react';

import { FullScreenBox, FixedBox } from './Box';
import { Header } from './Typography';

const Loading = () => (
  <FullScreenBox>
    <FixedBox>
      <Header color="secondary" textAlign="center">
        Monkeys are attempting to establish communication channels
      </Header>
    </FixedBox>
  </FullScreenBox>
);

export default Loading;
