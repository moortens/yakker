import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { VerticalBox } from './Box';
import { Hashtag, Exclamation, Local, Plus } from './Icons';

const BufferVerticalBox = styled(VerticalBox)`
  a {
    font-family: monospace;
    font-size: 1.4rem;
    width: 100%;
    margin: 0;
    padding: 5px;
    box-sizing: border-box;
    color: #9a8c98;
    text-decoration: none;
  }

  a:hover {
    background-color: #546a7b;
    border-radius: 3px;
    color: #fff;
  }

  a.active {
    background-color: #4a4e69;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    color: #dbf9f4;
  }
`;

const BufferText = styled.span`
  font-size: 1.4rem;
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
