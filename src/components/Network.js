import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-dropdown';

import { setCache } from 'actions/cache';
import { connectToNetwork } from 'actions/irc';

import Container from './Container';
import Action from './Action';
import './Network.css';

const Network = () => {
  const [network, setNetwork] = useState(null);
  const [nickname, setNickname] = useState('');
  const networks = useSelector(state => state.settings.networks);
  const dispatch = useDispatch();

  const connect = () => {
    const [{ value }] = networks || network;

    if (nickname === null || value === null) {
      return;
    }

    const [host, port] = value.split(':');

    const payload = {
      host,
      port,
      nickname,
    };

    dispatch(connectToNetwork(host, port, nickname));
    dispatch(setCache(payload));
  };

  return (
    <div className="modal">
      <div className="network-modal">
        <Container
          direction="column"
          style={{
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div className="network-header">Hello you!</div>

          <Container direction="column">
            {networks.length > 1 && (
              <>
                <div style={{ fontSize: '18px', color: 'white' }}>
                  Select a network:
                </div>

                <Dropdown
                  baseClassName="network-dropdown"
                  options={networks}
                  value={network}
                  onChange={option => setNetwork(option)}
                />
              </>
            )}

            <div style={{ fontSize: '18px', color: 'white' }}>
              Choose a nickname:
            </div>
            <input
              onChange={({ target: { value } }) => setNickname(value)}
              value={nickname}
              placeholder="nickname..."
            />
          </Container>

          <Container
            direction="row"
            style={{
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Action onClick={() => null}>
              <span style={{ textDecoration: 'underline', color: 'white' }}>
                Advanced...
              </span>
            </Action>
            <button type="button" onClick={connect}>
              Go
            </button>
          </Container>
        </Container>
      </div>
    </div>
  );
};

export default Network;
