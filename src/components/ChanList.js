import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paginate from 'react-paginate';
import Container from './Container';
import { Spinner, Users, Search, AngleLeft, AngleRight } from './Icons';
import Action from './Action';

import './ChanList.css';

const ChanList = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const channels = useSelector(state => state.chanlist.channels);
  const loading = useSelector(state => state.chanlist.loading);

  const pageCount = Math.ceil(channels.length / 5);

  const showModeBadges = modes => {
    const badges = {
      k: 'Password required',
      i: 'Invite only',
      m: 'Moderated',
    };

    return modes.map(mode => {
      if (badges[mode]) {
        return (
          <span key={badges[mode]} className="chanlist-badge">
            {badges[mode]}
          </span>
        );
      }

      return null;
    });
  };

  const listChannels = () =>
    channels
      .filter(({ channel }) => channel.includes(query))
      .sort((a, b) => b.users - a.users)
      .map(({ channel, topic, users, modes }) => (
        <Container
          key={channel}
          direction="column"
          className="chanlist-item"
          onClick={() => dispatch({ type: 'WS::JOIN', payload: { channel } })}
        >
          <Container direction="row" className="chanlist-item-container">
            <div className="chanlist-channel">
              {channel}
              {showModeBadges(modes)}
            </div>
            <div className="chanlist-users">
              <span className="icon">
                <Users />
              </span>
              {users}
            </div>
          </Container>
          <div className="chanlist-topic">{topic || 'No topic set...'}</div>
        </Container>
      ));

  return (
    <div className="chanlist-top">
      <Container direction="column" className="chanlist">
        <header className="chanlist-header">Browse channels</header>
        <div className="chanlist-search">
          <Search />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={({ target: { value } }) => setQuery(value)}
          />
        </div>
        <div
          style={{
            marginTop: '20px',
            borderBottom: '1px solid #eee',
            width: '100%',
          }}
        >
          Channels:
        </div>
        {loading ? <Spinner /> : listChannels()}
        <div className="chanlist-paginate">
          <Paginate
            pageCount={pageCount}
            pageRangeDisplayed={10}
            marginPagesDisplayed={3}

            previousLabel={<AngleLeft />}
            nextLabel={<AngleRight />}
          />
        </div>
      </Container>
    </div>
  );
};

export default ChanList;
