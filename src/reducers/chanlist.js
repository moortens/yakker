const initialState = {
  loading: true,
  channels: [],
};

const channelListState = {
  channel: null,
  topic: null,
  users: 0,
  modes: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CHANLIST_ADD': {
      const { channel, topic, users, modes } = payload;

      return Object.assign({}, state, {
        ...state,
        channels: [
          ...state.channels,
          Object.assign({}, channelListState, {
            channel,
            topic,
            users,
            modes,
          }),
        ],
      });
    }

    case 'CHANLIST_CLEAR': {
      return initialState;
    }

    case 'CHANLIST_SET_LOADING': {
      const { loading } = payload;
      return Object.assign({}, state, {
        ...state,
        loading,
      });
    }

    default:
      return state;
  }
};
