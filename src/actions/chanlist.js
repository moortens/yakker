export const clearChanlist = () => ({
  type: 'CHANLIST_CLEAR',
});

export const addChanlist = (channel, topic, users, modes) => ({
  type: 'CHANLIST_ADD',
  payload: {
    channel,
    topic,
    users,
    modes,
  },
});

export const setChanlistLoading = (loading = true) => ({
  type: 'CHANLIST_SET_LOADING',
  payload: {
    loading,
  },
});
