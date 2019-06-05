import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';

const threadSelector = (state, bid, tid) => {
  let messages = [];

  const ids = state.messages.ids[bid];

  // fix this crap.
  if (ids === undefined) {
    return {
      ids: [],
      messages: [],
    };
  }

  messages = Object.values(state.messages.entities)
    .filter(item => ids.includes(item.id))
    .filter(item => item.parent === tid || item.id === tid)
    .map(({ uid, ...data }) => {
      const user = state.userlist.entities[uid];

      return {
        ...user,
        ...data,
      };
    });

  return {
    ids,
    messages,
  };
};

const messageSelector = (state, cid) => {
  let messages = [];

  const ids = state.messages.ids[cid];

  // fix this crap.
  if (ids === undefined) {
    return {
      ids: [],
      messages: [],
    };
  }

  messages = Object.values(state.messages.entities)
    .filter(item => ids.includes(item.id))
    .map(({ uid, ...data }) => {
      const user = state.userlist.entities[uid];

      return {
        ...user,
        ...data,
      };
    });

  return {
    ids,
    messages,
  };
};

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

export const bufferMessageSelector = createDeepEqualSelector(
  messageSelector,
  ({ ids, messages }) => ({ ids, messages }),
);

export const bufferThreadMessageSelector = createDeepEqualSelector(
  threadSelector,
  ({ ids, messages }) => ({ ids, messages }),
);
