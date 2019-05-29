const initialState = {
  ids: {},
  entities: {},
};

const messageState = {
  id: null,
  parent: null,
  uid: null,

  bid: null,
  data: null,
  type: null, // notice, action, privmsg, tagmsg, join, part

  timestamp: null,
};

const MESSAGE_ADD = 'MESSAGE_ADD';

export default (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_ADD: {
      const {
        payload: {
          bid,
          uid,
          id,
          target,
          data,
          nick,
          type,
          parent,
          timestamp,
          tags,
        },
      } = action;

      return Object.assign({}, state, {
        ...state,
        ids: {
          ...state.ids,
          [bid]: [...(state.ids[bid] || []), id],
        },
        entities: {
          ...state.entities,
          [id]: Object.assign({}, messageState, {
            bid,
            uid,
            id,
            target,
            parent,
            data,
            nick,
            type,
            timestamp,
            tags,
          }),
        },
      });
    }

    default:
      return state;
  }
};
