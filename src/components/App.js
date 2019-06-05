import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import useHotKey from './hooks/useHotKey';

import Container from './Container';
import ChanList from './ChanList';
import Settings from './Settings';
import Network from './Network';
import Loading from './Loading';
import Sidebar from './Sidebar';
import Buffer from './Buffer';
import KeyBindings from './KeyBindings';

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

  useHotKey('mod+,', () => {
    history.push('/settings');
  });


  if (status === 'disconnected') {
    return <Network />;
  }

  if (status === 'connecting') {
    return <Loading />;
  }

  return (
    <Container direction="row">
      <Sidebar />
      
        <Route component={Buffer} path="/channel/:channel" />
        <Route component={Buffer} path="/message/:nickname" exact />
        <Route component={ChanList} path="/channels" />
        <Route component={Settings} path="/settings" />
        <Route component={KeyBindings} path="/shortcuts" />
    </Container>
  );
};

App.propTypes = {
  location: propTypes.shape().isRequired,
  history: propTypes.shape().isRequired,
};

export default withRouter(App);
