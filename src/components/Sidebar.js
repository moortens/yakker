import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import bufferListSelector from '../selectors/buffer';
import { Header, SubTitle } from './Typography';
import { VerticalBox } from './Box';
import BufferList from './BufferList';
import Status from './Status';

const SidebarBox = styled(VerticalBox)`
  background-color: ${({ theme }) => theme.colors.sidebar};
  color: ${({ theme }) => theme.colors.secondary};
  width: 260px;
  height: 100vh;
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  flex-direction: column;
`;

export default () => {
  const network = useSelector(state => state.server.network);
  const { channels, directs } = useSelector(bufferListSelector);

  return (
    <SidebarBox>
      {network && (
        <Header color="secondary" p={10}>
          {network}
        </Header>
      )}
      {channels.length > 0 && (
        <>
          <SubTitle color="heading">Channels:</SubTitle>
          <BufferList buffers={channels} channel />
        </>
      )}

      {directs.length > 0 && (
        <>
          <SubTitle color="heading">Direct messages:</SubTitle>
          <BufferList buffers={directs} />
        </>
      )}
      <Status />
    </SidebarBox>
  );
};
