import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Container from './Container';
import { Hashtag, Exclamation, Local, Plus } from './Icons';
import bufferListSelector from '../selectors/buffer';

import './BufferList.css';
import { VerticalBox } from './Box';

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
      {channels.length > 0 && (
        <>
          <div className="channel-list-header">Channels:</div>
          <VerticalBox>
            {generateList(channels, true)}
          </VerticalBox>
        </>
      )}

      {directs.length > 0 && (
        <>
          <div className="channel-list-header">Direct messages:</div>
          <VerticalBox>
            {generateList(directs)}
          </VerticalBox>
        </>
      )}
    </div>
  );
};

export default BufferList;
