import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import bufferListSelector from '../selectors/buffer';
import { Header, SubTitle } from './Typography';
import { VerticalBox } from './Box';
import BufferList from './BufferList';
import Status from './Status';

const SidebarBox = styled(VerticalBox)`
  background-color: ${({ theme }) => theme.sidebar.colors.background};
  color: ${({ theme }) => theme.sidebar.colors.secondary};
  width: 260px;
  height: 100vh;
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  flex-direction: column;
`;

const BufferBox = styled.div`
  color: ${({ theme }) => theme.sidebar.colors.primary}
  flex-grow: 1;
`;

export default () => {
  const network = useSelector(state => state.server.network);
  const { channels, directs } = useSelector(bufferListSelector);

  return (
    <SidebarBox>
      {network && (
        <Header color="secondary" p="5px">
          {network}
        </Header>
      )}
      <BufferBox>
        {channels.length > 0 && <BufferList buffers={channels} channel />}
        {directs.length > 0 && <BufferList buffers={directs} />}
      </BufferBox>
      <Status />
    </SidebarBox>
  );
};
