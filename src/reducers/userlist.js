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
            [nick.toLowerCase()]: uid,
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
      const { uid, old, nick } = payload;

      return Object.assign(
        state,
        {},
        {
          ...state,
          ids: {
            ...Object.fromEntries(
              Object.entries(state.ids).filter(([key]) => key !== old),
            ),
            [nick]: uid,
          },
          entities: {
            ...state.entities,
            [uid]: {
              ...state.entities[uid],
              nick,
            },
          },
        },
      );
    }

    case USERLIST_REMOVE_USER: {
      return state;
    }

    default:
      return state;
  }
};

export default userlistReducer;
