import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { lighten } from 'polished';
import { NavLink } from 'react-router-dom';

import { VerticalBox } from './Box';
import { Hashtag, Exclamation, Local, Plus } from './Icons';
import { SubTitle } from './Typography';

const BufferVerticalBox = styled(VerticalBox)`
  & a {
    font-family: monospace;
    font-size: 1.4rem;
    width: 100%;
    margin: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-sizing: border-box;
    color: ${({ theme }) => theme.sidebar.colors.primary};
    text-decoration: none;
  }

  & a:hover {
    background-color: ${({ theme }) => theme.sidebar.colors.hover.background};
    border-radius: 3px;
    color: ${({ theme }) => theme.sidebar.colors.hover.color};
  }

  & a.active {
    background-color: ${({ theme }) => theme.sidebar.colors.active.background};
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: ${({ theme }) => theme.sidebar.colors.active.color};
  }
`;

const BufferText = styled.span`
  font-size: 1.4rem;
`;

const BufferTitle = styled(SubTitle)`
  color: ${({ theme }) => lighten(0.2, theme.sidebar.colors.primary)};
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-transform: uppercase;
  font-size: 1.4rem;
  width: 100%;
  font-family: monospace;
`;

const BufferIcon = ({ name }) => {
  const channelTypes = {
    '#': Hashtag,
    '!': Exclamation,
    '&': Local,
    '+': Plus,
  };

  const Type = channelTypes[name.charAt(0)];

  if (Type) {
    return <Type />;
  }

  return null;
};

const BufferList = ({ buffers, channel }) => {
  if (!buffers.length) {
    return null;
  }

  return (
    <BufferVerticalBox>
      {channel ? (
        <BufferTitle>Channels</BufferTitle>
      ) : (
        <BufferTitle>Direct messages</BufferTitle>
      )}

      {buffers.map(({ name, bid: id }) => {
        const pathname = channel
          ? `/channel/${name.substring(1)}`
          : `/message/${name}`;

        return (
          <NavLink
            to={{
              pathname,
              state: { bid: id, name },
            }}
            key={name}
          >
            <BufferIcon name={name} />
            <BufferText>{channel ? name.substring(1) : name}</BufferText>
          </NavLink>
        );
      })}
    </BufferVerticalBox>
  );
};

BufferList.propTypes = {
  buffers: propTypes.arrayOf(propTypes.object).isRequired,
  channel: propTypes.bool,
};

BufferIcon.propTypes = {
  name: propTypes.string.isRequired,
};

BufferList.defaultProps = {
  channel: false,
};

export default BufferList;
