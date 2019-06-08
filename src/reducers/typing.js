export default (state = {}, { type, payload }) => {
  switch (type) {
    case 'TYPING_ADD_USER': {
      const { bid, uid, timestamp } = payload;

      return Object.assign({}, state, {
        ...state,
        [bid]: [
          ...(state[bid]
            ? state[bid].filter(typing => typing.uid !== uid)
            : []),
          {
            uid,
            timestamp,
          },
        ],
      });
    }

    case 'TYPING_DELETE_USER': {
      const { bid, uid } = payload;

      if (!state[bid]) {
        return state;
      }

      return state[bid].filter(typing => typing.uid !== uid);
    }

    default: {
      return state;
    }
  }
};
