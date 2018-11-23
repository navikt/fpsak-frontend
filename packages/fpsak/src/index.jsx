import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { render } from 'react-dom';

import configureRestInterceptors from '@fpsak-frontend/data/rest/restConfig';
import AppIndex from './AppIndex';
import configureStore from './store';

const history = createBrowserHistory({
  basename: '/fpsak/',
});
const store = configureStore(history);

configureRestInterceptors(store);

const renderFunc = (Component) => {
  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app'),
  );
};

renderFunc(AppIndex);
