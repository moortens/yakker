import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-dropdown';
import styled from 'styled-components';

import { setCache } from 'actions/cache';
import { connectToNetwork } from 'actions/irc';
import { VerticalBox, HorizontalBox, FullScreenBox, FixedBox } from './Box';
import Button from './Button';

import { Header, SubTitle } from './Typography';

const DropDownContainer = styled.div`
  & .network-dropdown-root {
    position: relative;
  }

  & .network-dropdown-control {
    position: relative;
    overflow: hidden;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 2px;
    box-sizing: border-box;
    color: #333;
    cursor: default;
    outline: none;
    padding: 8px 52px 8px 10px;
    transition: all 200ms ease;
  }

  & .network-dropdown-control:hover {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  }

  & .network-dropdown-arrow {
    border-color: #999 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: ' ';
    display: block;
    height: 0;
    margin-top: -ceil(2.5);
    position: absolute;
    right: 10px;
    top: 14px;
    width: 0;
  }

  & .is-open .network-dropdown-arrow {
    border-color: transparent transparent #999;
    border-width: 0 5px 5px;
  }

  & .network-dropdown-menu {
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    margin-top: -1px;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
  }

  & .network-dropdown-menu .network-dropdown-group > .network-dropdown-title {
    padding: 8px 10px;
    color: rgba(51, 51, 51, 1);
    font-weight: bold;
    text-transform: capitalize;
  }

  & .network-dropdown-option {
    box-sizing: border-box;
    color: rgba(51, 51, 51, 0.8);
    cursor: pointer;
    display: block;
    padding: 8px 10px;
  }

  & .network-dropdown-option:last-child {
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  & .network-dropdown-option:hover {
    background-color: #aaa;
    color: #333;
  }

  & .network-dropdown-option.is-selected {
    background-color: #f2f9fc;
    color: #333;
  }

  & .network-dropdown-noresults {
    box-sizing: border-box;
    color: #ccc;
    cursor: default;
    display: block;
    padding: 8px 10px;
  }
`;

const Input = styled.input`
  width: 50%;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 3.2rem;
`;

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
          <Header color="secondary">Hello you!</Header>

          <VerticalBox>
            {networks.length > 1 && (
              <>
                <SubTitle color="secondary">Select a network:</SubTitle>
                <DropDownContainer>
                  <Dropdown
                    baseClassName="network-dropdown"
                    options={networks}
                    value={network}
                    onChange={option => setNetwork(option)}
                  />
                </DropDownContainer>
              </>
            )}

            <SubTitle color="secondary">Choose a nickname:</SubTitle>
            <Input
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
