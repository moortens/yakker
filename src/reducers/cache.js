const initialState = {
  host: null,
  port: null,

  nickname: null,
  realname: null,
  username: null,

  channels: [],
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CACHE_SET': {
      return Object.assign({}, state, {
        ...state,
        ...payload,
      });
    }

    default: {
      return state;
    }
  }
};
