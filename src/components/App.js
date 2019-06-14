import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import useHotKey from './hooks/useHotKey';

import { HorizontalBox } from './Box';
import ChanList from './ChanList';
import Settings from './Settings';
import Network from './Network';
import Loading from './Loading';
import Sidebar from './Sidebar';
import Buffer from './Buffer';
import KeyBindings from './KeyBindings';

const App = ({ history }) => {
  const status = useSelector(state => state.server.status);
  const channels = useSelector(state => Object.keys(state.channels.ids).length);

  useHotKey('esc', () => {
    history.goBack();
  });

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
    <HorizontalBox>
      <Sidebar />
      <Route component={Buffer} path="/channel/:channel" />
      <Route component={Buffer} path="/message/:nickname" exact />
      <Route component={ChanList} path="/channels" />
      <Route component={Settings} path="/settings" />
      <Route component={KeyBindings} path="/shortcuts" />
    </HorizontalBox>
  );
};

App.propTypes = {
  history: propTypes.shape().isRequired,
};

export default withRouter(App);
