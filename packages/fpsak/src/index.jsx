import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';

import errorHandler from '@fpsak-frontend/error-api-redux';

import AppIndex from 'app/AppIndex';
import configureStore from './store';
import reducerRegistry from './ReducerRegistry';

const history = createBrowserHistory({
  basename: '/fpsak/',
});
const store = configureStore(history);

reducerRegistry.register(errorHandler.getErrorReducerName(), errorHandler.getErrorReducer());

const renderFunc = (Component) => {
  const app = document.getElementById('app');
  if (app === null) {
    throw new Error('No app element');
  }
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    app,
  );
};

renderFunc(AppIndex);
