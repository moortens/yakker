import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-dropdown';

import { setCache } from 'actions/cache';
import { connectToNetwork } from 'actions/irc';
import { VerticalBox, HorizontalBox, FullScreenBox, FixedBox } from './Box';
import Button from './Button';

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
    <FullScreenBox>
      <FixedBox size="network-container">
        <VerticalBox justifyContent="space-between" height="100%">
          <div className="network-header">Hello you!</div>

          <VerticalBox>
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
          </VerticalBox>

          <HorizontalBox justifyContent="space-between">
            <Button color="#fff" onClick={() => null}>
              Advanced...
            </Button>
            <Button color="#fff" onClick={connect}>
              Go
            </Button>
          </HorizontalBox>
        </VerticalBox>
      </FixedBox>
    </FullScreenBox>
  );
};

export default Network;
