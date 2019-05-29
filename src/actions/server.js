export const setServerOptions = options => ({
  type: 'SERVER_SET_OPTIONS',
  payload: {
    ...options,
  },
});

export const setServerStatus = (status = 'disconnected') => ({
  type: 'SERVER_SET_STATUS',
  payload: status,
});

export const setServerNickname = nickname => ({
  type: 'SERVER_SET_NICKNAME',
  payload: {
    nickname,
  },
});