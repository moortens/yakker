export const addBuffer = (bid, name, channel = false) => ({
  type: 'BUFFER_ADD',
  payload: {
    bid,
    name,
    channel,
  },
});

export const removeBuffer = bid => ({
  type: 'BUFFER_REMOVE',
  payload: {
    bid,
  },
});

export const setCurrentBuffer = bid => ({
  type: 'BUFFER_SET_CURRENT',
  payload: {
    bid,
  },
});

export const setBufferLastReadMessage = (bid, lastReadMessage) => ({
  type: 'BUFFER_SET_LAST_READ_MESSAGE',
  payload: {
    bid,
    lastReadMessage,
  },
});
