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
