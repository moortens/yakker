const USERLIST_SET_USER = 'USERLIST_SET_USER';
const USERLIST_REMOVE_USER = 'USERLIST_REMOVE_USER';
const USERLIST_RENAME_USER = 'USERLIST_RENAME_USER';
const USERLIST_MODIFY_USER = 'USERLIST_MODIFY_USER';

const userState = {
  nick: null,
  ident: null,
  hostname: null,
  gecos: null,
  account: null,
  away: false,
  typing: false,
};

const initialState = {
  ids: {},
  entities: {},
};

const userlistReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USERLIST_MODIFY_USER:
    case USERLIST_SET_USER: {
      const { uid, nick } = payload;

      return Object.assign(
        state,
        {},
        {
          ...state,
          ids: {
            ...state.ids,
            [nick]: uid,
          },
          entities: {
            ...state.entities,
            [uid]: Object.assign({}, userState, {
              ...(state.entities[uid] || {}),
              ...payload,
            }),
          },
        },
      );
    }

    case USERLIST_RENAME_USER: {
      const { nick, newNick } = payload;

      return state;
    }

    case USERLIST_REMOVE_USER: {
      const { nick } = payload;

      return state;
    }

    default:
      return state;
  }
};

export default userlistReducer;
