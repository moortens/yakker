const initialState = {
  current: null,
  ids: {},
  entities: {},
};

const bufferState = {
  bid: null,
  name: null,
  channel: false,
  lastReadMessage: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'BUFFER_ADD': {
      const { bid, name, channel } = payload;

      return Object.assign({}, state, {
        ...state,
        ids: {
          ...state.ids,
          [name]: bid,
        },
        entities: {
          ...state.entities,
          [bid]: Object.assign({}, bufferState, {
            bid,
            name,
            channel,
          }),
        },
      });
    }

    case 'BUFFER_SET_CURRENT': {
      const { bid } = payload;

      return Object.assign({}, state, {
        current: bid,
      });
    }

    case 'BUFFER_SET_LAST_READ_MESSAGE': {
      const { bid, lastReadMessage } = payload;

      return Object.assign({}, state, {
        ...state,
        entities: {
          ...state.entities,
          [bid]: Object.assign({}, bufferState, {
            ...state.entities[bid],
            lastReadMessage,
          }),
        },
      });
    }

    default:
      return state;
  }
};
