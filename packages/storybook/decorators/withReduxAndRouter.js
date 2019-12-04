import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import configureStore from '@fpsak-frontend/sak-app/src/configureStore';

const history = createBrowserHistory({
  basename: '/',
});

const withReduxAndRouterProvider = (story) => {
  const store = configureStore(history);

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        { story() }
      </ConnectedRouter>
    </Provider>
  );
};

export default withReduxAndRouterProvider;
