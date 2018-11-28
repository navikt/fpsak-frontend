/* @flow */
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';

import { getSuccessResponseHandler, getErrorResponseHandler } from 'data/restResponseHandlers';
import fpsakApi from 'data/fpsakApi';
import AppIndex from 'app/AppIndex';
import configureStore from './store';

const history = createBrowserHistory({
  basename: '/fpsak/',
});
const store = configureStore(history);

fpsakApi.setRestResponseHandlers(getSuccessResponseHandler(store), getErrorResponseHandler(store));

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
