const SERVER_SET_OPTIONS = 'SERVER_SET_OPTIONS';
const SERVER_SET_STATUS = 'SERVER_SET_STATUS';
const SERVER_SET_NICKNAME = 'SERVER_SET_NICKNAME';

const initialState = {
  status: 'disconnected',
  capabilities: [],
  chantypes: ['#'],
  prefix: [
    { symbol: '@', mode: 'o' },
    { symbol: '%', mode: 'h' },
    { symbol: '+', mode: 'v' },
  ],
  network: null,
  nickname: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SERVER_SET_OPTIONS: {
      return Object.assign({}, state, {
        ...state,
        ...payload,
      });
    }

    case SERVER_SET_STATUS: {
      return Object.assign({}, state, {
        ...state,
        status: payload,
      });
    }

    case SERVER_SET_NICKNAME: {
      const { nickname } = payload;
      return Object.assign({}, state, {
        ...state,
        nickname,
      });
    }

    default: {
      return state;
    }
  }
};
