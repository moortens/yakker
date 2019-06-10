const initialState = {
  ids: {},
  entities: {},
};

const messageState = {
  bid: null,
  uid: null,
  id: null,
  target: null,
  data: null,
  nick: null,
  type: null,
  parent: null,
  timestamp: null,
  tags: [],
  status: 'received',
};

const MESSAGE_ADD = 'MESSAGE_ADD';
const MESSAGE_UPDATE = 'MESSAGE_UPDATE';

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case MESSAGE_ADD: {
      const { bid, id } = payload;

      if (!bid || !id) return state;

      return Object.assign({}, state, {
        ...state,
        ids: {
          ...state.ids,
          [bid]: [...(state.ids[bid] || []), id],
        },
        entities: {
          ...state.entities,
          [id]: Object.assign({}, messageState, {
            ...payload,
          }),
        },
      });
    }

    case MESSAGE_UPDATE: {
      const { label, bid, id } = payload;

      return Object.assign({}, state, {
        ...state,
        ids: {
          ...state.ids,
          [bid]: [...(state.ids[bid].filter(key => key !== label) || []), id],
        },
        entities: {
          ...Object.fromEntries(
            Object.entries(state.entities).filter(([key]) => key !== label) ||
              [],
          ),
          [id]: Object.assign({}, messageState, {
            ...payload,
          }),
        },
      });
    }

    default:
      return state;
  }
};
