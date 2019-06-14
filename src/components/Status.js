import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Settings, Keyboard } from './Icons';

const StatusContainer = styled.div`
  font-size: 2rem;
  height: 38px;
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 38px;
  text-align: left;

  a {
    text-decoration: none;
    color: inherit;
    padding-right: 5px;

    &:hover {
      color: black;
    }
  }
`;

const Status = () => {
  return (
    <StatusContainer>
      <Link to="/settings">
        <Settings />
      </Link>
      <Link to="/shortcuts">
        <Keyboard />
      </Link>
    </StatusContainer>
  );
};

export default Status;
