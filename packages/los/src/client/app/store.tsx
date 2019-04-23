import { routerMiddleware, connectRouter } from 'connected-react-router';
import {
  createStore, compose, combineReducers, applyMiddleware,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import * as reducers from './reducers';

const isDevelopment = process.env.NODE_ENV === 'development';
const logger = isDevelopment ? require('redux-logger') : {};

const configureStore = (browserHistory: any) => {
  const rootReducer = combineReducers({
    ...reducers,
    router: connectRouter(browserHistory),
  });

  const middleware = [thunkMiddleware, routerMiddleware(browserHistory)];
  if (isDevelopment) {
    middleware.push(logger.createLogger());
  }

  const initialState = {};
  const enhancer = compose(applyMiddleware(...middleware));
  return createStore(rootReducer, initialState, enhancer);
};

export default configureStore;
