import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { channelsSelector } from '../selectors/userlist';

import './Userlist.css';
import Container from './Container';
import classnames from 'classnames';
import Avatar from './Avatar';

const Userlist = ({ bid }) => {
  const [searchInput, setSearchInput] = useState('');

  const userlist = useSelector(state => channelsSelector(state, bid), [bid]);
  const prefix = useSelector(state => state.server.prefix);

  const defaultModeNames = {
    y: 'Administrators',
    q: 'Founder',
    a: 'Protected',
    o: 'Operators',
    h: 'Moderators',
    v: 'Voice',
  };

  const defaultSymbolRange = [
    ...prefix.map(({ mode }) => defaultModeNames[mode]),
    'Members',
  ];

  const sortByPrefix = () => {
    return userlist
      .filter(
        ({ nick }) => searchInput.length === 0 || nick.includes(searchInput),
      )
      .sort(({ nick: nickA, modes: [a] }, { nick: nickB, modes: [b] }) => {
        if ((a === undefined && b === undefined) || a === b) {
          return nickA.localeCompare(nickB);
        }

        const prefixA = prefix.findIndex(item => item.mode === a);
        const prefixB = prefix.findIndex(item => item.mode === b);

        if (prefixA === -1 && prefixB !== -1) {
          return 1;
        }

        if (prefixA !== -1 && prefixB === -1) {
          return -1;
        }

        if (prefixA > prefixB) {
          return 1;
        }

        if (prefixA < prefixB) {
          return -1;
        }

        return nickA.localeCompare(nickB);
      })
      .map(user => {
        const {
          modes: [mode],
        } = user;

        const type = defaultModeNames[mode] || 'Members';

        return Object.assign({}, user, {
          type,
          ...user,
        });
      });
  };

  const generateBlocks = () => {
    return defaultSymbolRange.map(name => {
      const users = sortByPrefix().filter(({ type }) => type === name);

      if (users.length === 0) {
        return null;
      }

      const styles = ['userlist-mode', `userlist-mode-${name.toLowerCase()}`];

      return (
        <div key={name} className={styles.join(' ')}>
          <header>{name}</header>
          {users.map(user => {
            const { away = false } = user;
            const klasses = classnames('userlist-nick', {
              'userlist-away': away,
            });

            return (
              <div key={user.nick} className="userlist-item-container">
                <Avatar text={user.nick} small />
                <div className={klasses}>{user.nick}</div>
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="userlist-container">
      <div className="userlist-search">
        <input
          className="userlist-search-input"
          placeholder="Search..."
          type="text"
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>
      {generateBlocks()}
    </div>
  );
};

Userlist.propTypes = {
  bid: propTypes.string,
};

Userlist.defaultProps = {
  bid: null,
};

export default Userlist;
