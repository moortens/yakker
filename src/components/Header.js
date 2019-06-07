import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import TextFormatter from './TextFormatter';
import Container from './Container';
import { Settings, Bars, Ellipsis } from './Icons';

import './Header.css';
import { selectChannelDetails } from '../selectors/channel';


const Header = ({ bid, match }) => {
  const { name, topic, count } = useSelector(
    state => selectChannelDetails(state, bid),
    [bid],
  );

  return (
    <div className="header-container">
      <Container direction="row" style={{ alignItems: 'baseline', width: '100%' }}>
        <div className="header-name">{name}</div>
        <TextFormatter
          className="header-title"
          title={topic}
          text={topic}
          embed={false}
        />
        <div className="header-nav">
          <Container direction="row" style={{ alignItems: 'flex-end' }}>
            <Link
              className="header-nav-link"
              to={{
                pathname: `${match.url}/details`,
                state: {
                  bid,
                },
              }}
            >
              <Bars />
              {count}
            </Link>
            <div className="header-nav-item">
              <Ellipsis />
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

export default withRouter(Header);
