import React from 'react';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Container from './Container';
import { Hashtag, Exclamation, Local, Plus } from './Icons';
import bufferListSelector from '../selectors/buffer';

import './BufferList.css';

const BufferList = () => {
  const { channels, directs } = useSelector(bufferListSelector);

  const generateList = (buffer, channel = false) => {
    const channelTypes = {
      '#': <Hashtag />,
      '!': <Exclamation />,
      '&': <Local />,
      '+': <Plus />,
    };

    return buffer.map(({ name, bid: id }) => {
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
          className="channel-list"
        >
          {channel && channelTypes[name.charAt(0)]}
          <span>{channel ? name.substring(1) : name}</span>
        </NavLink>
      );
    });
  };

  return (
    <div className="channel-list-container">
      <div className="channel-list-header">Channels:</div>

      <Container direction="column">{generateList(channels, true)}</Container>

      <div className="channel-list-header">Direct messages:</div>

      <Container direction="column">{generateList(directs)}</Container>
    </div>
  );
};

export default BufferList;
