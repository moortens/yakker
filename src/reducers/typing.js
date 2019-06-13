export default (state = {}, { type, payload }) => {
  switch (type) {
    case 'TYPING_ADD_USER': {
      const { bid, uid } = payload;

      return Object.assign({}, state, {
        ...state,
        [bid]: [
          ...(state[bid]
            ? state[bid].filter(typing => typing.uid !== uid)
            : []),
          {
            uid,
          },
        ],
      });
    }

    case 'TYPING_DELETE_USER': {
      const { bid, uid } = payload;

      if (!state[bid]) {
        return state;
      }

      return Object.assign({}, state, {
        ...state,
        [bid]: state[bid].filter(typing => typing.uid !== uid),
      });
    }

    default: {
      return state;
    }
  }
};
