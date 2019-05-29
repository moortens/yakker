export const setUserlistUser = (uid, payload) => ({
  type: 'USERLIST_SET_USER',
  payload: {
    uid,
    ...payload,
  },
});

export const removeUserlistUser = uid => ({
  type: 'USERLIST_REMOVE_USER',
  payload: {
    uid,
  },
});

export const renameUserlistUser = (uid, old, nick) => ({
  type: 'USERLIST_RENAME_USER',
  payload: {
    uid,
    old,
    nick,
  },
});
