import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';
import { init } from '@sentry/browser';

import AppIndex from 'app/AppIndex';
import configureStore from './store';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

init({
  dsn: 'https://a9c4a0ca9c2147bd82b524fbab2c92df@sentry.nais.adeo.no/3',
  environment,
});


const history = createBrowserHistory({
  basename: '/fplos/',
});
const store = configureStore(history);

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
