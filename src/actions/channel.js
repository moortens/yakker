export const addChannel = (bid, channel) => ({
  type: 'CHANNEL_ADD',
  payload: {
    bid,
    channel,
  },
});

export const setChannelTopic = (bid, topic) => ({
  type: 'CHANNEL_SET_TOPIC',
  payload: {
    bid,
    topic,
  },
});

export const addChannelMember = (bid, uid, modes) => ({
  type: 'CHANNEL_ADD_MEMBER',
  payload: {
    bid,
    uid,
    modes,
  },
});

export const removeChannelMember = (bid, uid) => ({
  type: 'CHANNEL_REMOVE_MEMBER',
  payload: {
    bid,
    uid,
  },
});
