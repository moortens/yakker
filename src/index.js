import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import createWebSocketConnectionMiddleware from './middleware/websocket';
import reducers from './reducers';
import { saveCachedState, loadCachedState } from './lib/storage';
import history from './lib/history';

const configureStore = () => {
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

  return store;
};

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
