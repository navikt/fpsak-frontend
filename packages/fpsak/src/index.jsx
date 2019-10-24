import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';
import { init, Integrations } from '@sentry/browser';

import { reducerRegistry } from '@fpsak-frontend/fp-felles';
import errorHandler from '@fpsak-frontend/error-api-redux';

import AppIndex from './app/AppIndex';
import configureStore from './configureStore';


/* global VERSION:true */
/* eslint no-undef: "error" */
const release = VERSION;
const environment = window.location.hostname;
const isDevelopment = process.env.NODE_ENV === 'development';
init({
  dsn: isDevelopment ? 'http://dev@localhost:9000/1' : 'https://f1df84f98e254eea93e20afb33c0de19@sentry.nav.no/2',
  release,
  environment,
  integrations: [new Integrations.Breadcrumbs({ console: false })],
  beforeSend: (event, hint) => {
    const exception = hint.originalException;
    if (exception.isAxiosError) {
      const requestUrl = new URL(exception.request.responseURL);
      // eslint-disable-next-line no-param-reassign
      event.fingerprint = [
        '{{ default }}',
        String(exception.name),
        String(exception.message),
        String(requestUrl.pathname),
      ];
      // eslint-disable-next-line no-param-reassign
      event.extra = event.extra ? event.extra : {};
      // eslint-disable-next-line no-param-reassign
      event.extra.callId = exception.response.config.headers['Nav-Callid'];
    }
    return event;
  },
});

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
