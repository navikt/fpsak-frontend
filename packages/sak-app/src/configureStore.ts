import { connectRouter, routerMiddleware } from 'connected-react-router';
import {
  applyMiddleware, combineReducers, compose, createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';

const isDevelopment = process.env.NODE_ENV === 'development';
const logger = isDevelopment ? require('redux-logger') : null;

const combineAllReducers = (routerReducer, reduxFormReducer, applicationReducers) => combineReducers({
  default: combineReducers(applicationReducers),
  router: routerReducer,
  form: reduxFormReducer,
});

const configureStore = (browserHistory) => {
  const middleware = [thunkMiddleware, routerMiddleware(browserHistory)];
  let enhancer;
  if (isDevelopment) {
    middleware.push(logger.createLogger());
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    /* eslint-enable */
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  const routerReducer = connectRouter(browserHistory);
  const allReducers = combineAllReducers(routerReducer, formReducer, reducerRegistry.getReducers());

  const initialState = {};

  const store = createStore(allReducers, initialState, enhancer);

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener((reducers) => {
    const newReducers = combineAllReducers(routerReducer, formReducer, reducers);
    store.replaceReducer(newReducers);
  });

  return store;
};

export default configureStore;
