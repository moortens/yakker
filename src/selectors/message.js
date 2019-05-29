import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';

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

  messages = Object.values(state.messages.entities).filter(item =>
    ids.includes(item.id),
  );

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
