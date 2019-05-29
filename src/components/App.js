import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import Container from './Container';
import ChanList from './ChanList';
import Settings from './Settings';
import Network from './Network';
import Loading from './Loading';
import Sidebar from './Sidebar';
import Buffer from './Buffer';

import './App.css';

const App = ({ history, location }) => {
  const status = useSelector(state => state.server.status);
  const channels = useSelector(state => Object.keys(state.channels.ids).length);

  useEffect(() => {
    if (status === 'connected' && channels === 0) {
      /** fix loop if history is added to dependencies */
      history.push('/channels');
    }
  }, [status, channels]);

  if (status === 'disconnected') {
    return <Network />;
  }

  if (status === 'connecting') {
    return <Loading />;
  }

  return (
    <Container direction="row">
      <Sidebar />
      <Switch>
        <Route component={Buffer} path="/channel/:channel" exact />
        <Route component={Buffer} path="/message/:nickname" exact />
        <Route component={ChanList} path="/channels" />
        <Route component={Settings} path="/settings" />
      </Switch>
    </Container>
  );
};

App.propTypes = {
  location: propTypes.shape().isRequired,
  history: propTypes.shape().isRequired,
};

export default withRouter(App);
