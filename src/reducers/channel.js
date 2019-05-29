const CHANNEL_ADD = 'CHANNEL_ADD';
const CHANNEL_DELETE = 'CHANNEL_DELETE';
const CHANNEL_SET_TOPIC = 'CHANNEL_SET_TOPIC';
const CHANNEL_ADD_NAMED_THREAD = 'CHANNEL_ADD_NAMED_THREAD';
const CHANNEL_ADD_MEMBER = 'CHANNEL_ADD_MEMBER';
const CHANNEL_REMOVE_MEMBER = 'CHANNEL_REMOVE_MEMBER';
const CHANNEL_RENAME_MEMBER = 'CHANNEL_RENAME_MEMBER';

// flatten more?
const initialState = {
  ids: {},
  entities: {},
  topics: {},
  users: {},
};

const channelState = {
  bid: null,
  channel: null,
  threads: [],
  topic: null,
  url: null,
  created: null,
  users: {},
};

const userState = {
  modes: [],
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CHANNEL_ADD: {
      const { channel, bid } = payload;

      return Object.assign({}, state, {
        ...state,
        ids: {
          ...state.ids,
          [channel]: bid,
        },
        entities: {
          ...state.entities,
          [bid]: Object.assign({}, channelState, {
            bid,
            channel,
          }),
        },
      });
    }

    case CHANNEL_DELETE: {
      const { channel } = payload;

      return state.filter(c => c.channel !== channel);
    }

    case CHANNEL_SET_TOPIC: {
      const { bid, topic } = payload;

      return Object.assign({}, state, {
        ...state,
        topics: {
          ...state.topics,
          [bid]: topic,
        },
      });
    }

    case CHANNEL_ADD_NAMED_THREAD: {
      const { channel, thread } = payload;

      return state.map(c => {
        if (c.channel === channel) {
          if (c.threads[thread] === undefined) {
            return Object.assign({}, c, {
              ...c,
              threads: [...c.threads, thread],
            });
          }
        }
        return c;
      });
    }

    case CHANNEL_ADD_MEMBER: {
      const { uid, bid, modes } = payload;

      return Object.assign({}, state, {
        ...state,
        users: {
          ...state.users,
          [bid]: {
            ...(state.users[bid] || {}),
            [uid]: Object.assign({}, userState, {
              modes,
            }),
          },
        },
      });
    }

    case CHANNEL_REMOVE_MEMBER: {
      const { uid, bid } = payload;

      if (!state.users[bid]) {
        return state;
      }

      return Object.assign({}, state, {
        ...state,
        users: {
          ...state.users,
          [bid]: Object.fromEntries(
            Object.entries(state.users[bid]).filter(([key]) => key !== uid),
          ),
        },
      });
    }

    case CHANNEL_RENAME_MEMBER: {
      const { nick, newNick } = payload;

      return state.map(c => {
        const user = c.users.find(u => u.nick === nick);
        if (user) {
          user.nick = newNick;

          return {
            ...c,
            users: [...c.users.filter(u => u.nick !== nick), user],
          };
        }
        return c;
      });
    }

    /* case CHANNEL_THREAD_ADD:

    case CHANNEL_THREAD_DELETE:
    */

    default:
      return state;
  }
};

export default reducer;
