import { routerReducer, routerMiddleware } from 'react-router-redux';
import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import * as reducers from './reducers';

const isDevelopment = process.env.NODE_ENV === 'development';
const logger = isDevelopment ? require('redux-logger') : null;

const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer,
  form: formReducer,
});

const configureStore = (browserHistory) => {
  const middleware = [thunkMiddleware, routerMiddleware(browserHistory)];
  if (isDevelopment) {
    middleware.push(logger.createLogger());
  }

  const initialState = {};
  const enhancer = compose(applyMiddleware(...middleware));
  return createStore(rootReducer, initialState, enhancer);
};

export default configureStore;
