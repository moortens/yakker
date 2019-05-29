export const addBuffer = (bid, name) => ({
  type: 'BUFFER_ADD',
  payload: {
    bid,
    name,
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
