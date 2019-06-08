import { combineReducers } from 'redux';

import channels from './channel';
import messages from './message';
import userlist from './userlist';
import server from './server';
import buffer from './buffer';
import chanlist from './chanlist';
import cache from './cache';
import settings from './settings';
import typing from './typing';

export default combineReducers({
  buffer,
  channels,
  messages,
  userlist,
  server,
  chanlist,
  cache,
  settings,
  typing,
});
