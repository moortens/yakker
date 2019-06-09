import { createStore, applyMiddleware, compose } from 'redux';
import createWebSocketConnectionMiddleware from '../middleware/websocket';
import { saveCachedState, loadCachedState } from './storage';
import reducers from '../reducers';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const preloadedCache = loadCachedState();

const store = createStore(
  reducers,
  preloadedCache,
  composeEnhancers(applyMiddleware(createWebSocketConnectionMiddleware())),
);

store.dispatch({ type: '@@INIT_STORE' });

store.subscribe(() => {
  // do some memoization
  const { cache, settings } = store.getState();

  saveCachedState({
    cache,
    settings,
  });
});

export default store;
