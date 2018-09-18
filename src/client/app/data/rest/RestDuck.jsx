import { createSelector } from 'reselect';

import createRequestReducer from './redux/restReducer';
import createRequestActionTypes from './redux/restActionTypes';
import createRequestActionCreators from './redux/restActionCreators';

/**
 * RestDuck
 * Klasse som tilbyr action types, action creators, reducer og selectors for et AJAX-kall.
 *
 * Eks.
 * const getBehandlingerDuck = new RestDuck(execGetRequest, 'behandlinger', GET_BEHANDLINGER_SERVER_URL);
 * // Action creators
 * export const fetchBehandlinger = getBehandlingerDuck.actionCreators.execRequest;
 * // Reducer
 * export const dataReducer = combineReducers(
 *   ...,
 *   getBehandlingerDuck.reducer,
 * }
 * // Selectors
 * export const getDataContext = state => state.default.dataContext;
 * export const getBehandlingerData = getBehandlingerDuck.selectors.getRequestData(getDataContext);
 * export const getBehandlingerStarted = getBehandlingerDuck.selectors.getRequestStarted(getDataContext);
 * ...
 */
class RestDuck {
  constructor(name, path, restMethod, getApiContext) {
    this.restMethod = restMethod;
    this.name = name;
    this.path = path;
    this.getApiContext = getApiContext;
    this.$$duck = {}; // for class internal use
  }

  get actionTypes() {
    if (!this.$$duck.actionTypes) {
      this.$$duck.actionTypes = createRequestActionTypes(this.name, this.restMethod, this.path);
    }
    return this.$$duck.actionTypes;
  }

  get actionCreators() {
    if (!this.$$duck.actionCreators) {
      this.$$duck.actionCreators = createRequestActionCreators(this.restMethod, this.path, this.actionTypes);
    }
    return this.$$duck.actionCreators;
  }

  get reducer() {
    if (!this.$$duck.reducer) {
      this.$$duck.reducer = createRequestReducer(this.restMethod, this.name, this.actionTypes);
    }
    return this.$$duck.reducer;
  }

  get stateSelector() {
    return createSelector([this.getApiContext], restApiContext => restApiContext[this.name]);
  }
}

export default RestDuck;
