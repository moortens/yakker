import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';

import { selectChannelDetails } from '../selectors/channel';

import { Bars, Ellipsis } from './Icons';
import { HorizontalBox } from './Box';
import { Title } from './Typography';

import TextFormatter from './TextFormatter';

const HeaderBox = styled(HorizontalBox)`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #ccc;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  align-items: baseline;
`;

const HeaderNav = styled(HorizontalBox)`
  align-items: flex-end;
  width: auto;
  padding-left: 15px;
`;

const HeaderNavItem = styled.div`
  padding-left: 10px;
  color: ${({ theme }) => theme.colors.header.secondary};
  text-decoration: none;

  a,
  a:visited {
    color: ${({ theme }) => theme.colors.header.secondary};
    text-decoration: none;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.header.primary};
  }
`;

const Expand = styled.div`
  font-size: 12px;
  color: #999;
  flex-grow: 1;
  padding-left: 5px;
  width: 0;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Header = ({ bid, match }) => {
  const { name, topic, count } = useSelector(
    state => selectChannelDetails(state, bid),
    [bid],
  );

  return (
    <HeaderBox>
      <Title>{name}</Title>
      <Expand>
        <TextFormatter title={topic} text={topic} embed={false} />
      </Expand>
      <HeaderNav>
        <HeaderNavItem>
          <Link
            to={{
              pathname: `${match.url}/details`,
              state: {
                bid,
              },
            }}
          >
            <Bars />
            {count}
          </Link>
        </HeaderNavItem>
        <HeaderNavItem>
          <Ellipsis />
        </HeaderNavItem>
      </HeaderNav>
    </HeaderBox>
  );
};

Header.propTypes = {
  bid: propTypes.string,
  match: propTypes.shape().isRequired,
};

Header.defaultProps = {
  bid: null,
};

export default withRouter(Header);
