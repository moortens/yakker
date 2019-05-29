const initialState = {
  current: null,
  ids: {},
  entities: {},
};

const bufferState = {
  bid: null,
  name: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'BUFFER_ADD': {
      const { bid, name } = payload;

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

    default:
      return state;
  }
};
