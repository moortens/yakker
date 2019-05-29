export const setCache = payload => ({
  type: 'CACHE_SET',
  payload: {
    ...payload,
  },
});