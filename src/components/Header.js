import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';

import TextFormatter from './TextFormatter';
import Container from './Container';
import { Settings, Bars } from './Icons';

import './Header.css';
import { selectChannelDetails } from '../selectors/channel';

const Header = ({ bid }) => {
  const { name, topic, count } = useSelector(
    state => selectChannelDetails(state, bid),
    [bid],
  );

  return (
    <div className="header-container">
      <Container direction="row" style={{ alignItems: 'baseline' }}>
        <div className="header-name">{name}</div>
        <TextFormatter
          className="header-title"
          title={topic}
          text={topic}
          embed={false}
        />
        <div className="header-nav" style={{ width: '200px' }}>
          <Container direction="row" style={{ alignItems: 'flex-end' }}>
            <div className="header-nav-item">
              <Bars />
              {count}
            </div>
            <div className="header-nav-item">
              <Settings />
            </div>
          </Container>
        </div>
      </Container>
    </div>
  );
};

Header.propTypes = {
  bid: propTypes.string,
};

Header.defaultProps = {
  bid: null,
};

export default Header;
