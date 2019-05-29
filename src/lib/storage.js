// stores the data in cache and reload it.

export const loadCachedState = () => {
  if (window.localStorage === undefined) {
    return undefined;
  }

  const cache = localStorage.getItem('cache');

  if (cache === undefined || cache === null) {
    return undefined;
  }

  return JSON.parse(cache);
};

export const saveCachedState = state => {
  if (window.localStorage === undefined) {
    return;
  }

  localStorage.setItem('cache', JSON.stringify(state));
};
