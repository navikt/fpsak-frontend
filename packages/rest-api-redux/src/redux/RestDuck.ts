import { createSelector } from 'reselect';

import { RequestRunner } from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import createRequestReducer from './createRequestReducer';
import createRequestActionTypes from './createRequestActionTypes';
import createRequestActionCreators from './createRequestActionCreators';

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
  name: string;

  requestRunner: RequestRunner;

  getApiContext: (state: any) => any;

  reduxEvents: ReduxEvents;

  resultKeyActionCreators: any;

  $$duck: {
    actionTypes?: any;
    actionCreators?: any;
    reducer?: any;
  };

  constructor(requestRunner: RequestRunner, getApiContext: (state: any) => any, reduxEvents: ReduxEvents, resultKeyActionCreators) {
    this.requestRunner = requestRunner;
    this.name = requestRunner.getName();
    this.getApiContext = getApiContext;
    this.reduxEvents = reduxEvents;
    this.$$duck = {}; // for class internal use
    this.resultKeyActionCreators = resultKeyActionCreators;
  }

  get actionTypes() {
    if (!this.$$duck.actionTypes) {
      this.$$duck.actionTypes = createRequestActionTypes(this.requestRunner);
    }
    return this.$$duck.actionTypes;
  }

  get actionCreators() {
    if (!this.$$duck.actionCreators) {
      this.$$duck.actionCreators = createRequestActionCreators(this.requestRunner, this.actionTypes, this.reduxEvents, this.resultKeyActionCreators);
    }
    return this.$$duck.actionCreators;
  }

  get reducer() {
    if (!this.$$duck.reducer) {
      this.$$duck.reducer = createRequestReducer(this.actionTypes, this.name);
    }
    return this.$$duck.reducer;
  }

  get stateSelector(): any {
    return createSelector([this.getApiContext], restApiContext => restApiContext[this.name]);
  }
}

export default RestDuck;
