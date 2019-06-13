import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';

export const channelsSelector = (state, cid) => {
  const users = state.channels.users[cid];

  if (users === undefined) {
    return [];
  }

  return Object.keys(users).map(uid => {
    return {
      ...state.userlist.entities[uid],
      ...users[uid],
    };
  });
};

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const channelListSelector = createDeepEqualSelector(
  channelsSelector,
  value => value,
);
