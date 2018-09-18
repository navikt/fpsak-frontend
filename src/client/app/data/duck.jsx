import { createSelector } from 'reselect';

import { isAsyncRestMethod } from './rest/restMethods';
import { createFpsakReduxApi } from './fpsakApi';

const getDataContext = state => state.default.dataContext;

const fpsakReduxApi = createFpsakReduxApi(getDataContext);

/* Action creators */
export const makeRestApiRequest = endpointName => fpsakReduxApi.makeRequestActionCreator(endpointName);

export const resetRestApi = endpointName => fpsakReduxApi.makeResetActionCreator(endpointName);

export const setDataRestApi = endpointName => fpsakReduxApi.setDataActionCreator(endpointName);

/* Reducers */
export const dataReducer = fpsakReduxApi.createReducer();

/* Selectors */
const getRestApiState = endpointName => fpsakReduxApi.getEndpointState(endpointName);
export const getRestApiData = endpointName => createSelector([getRestApiState(endpointName)], apiState => apiState.data);
export const getRestApiMeta = endpointName => createSelector([getRestApiState(endpointName)], apiState => apiState.meta);
export const getRestApiError = endpointName => createSelector([getRestApiState(endpointName)], apiState => apiState.error);
export const getRestApiStarted = endpointName => createSelector([getRestApiState(endpointName)], apiState => apiState.started);
export const getRestApiFinished = endpointName => createSelector([getRestApiState(endpointName)], apiState => apiState.finished);

const getRestApiPollingMessage = endpointName => createSelector([getRestApiState(endpointName)], apiState => apiState.pollingMessage);
export const getAllAsyncPollingMessages = state => fpsakReduxApi.ducks
  .filter(duck => isAsyncRestMethod(duck.restMethod))
  .map(duck => getRestApiPollingMessage(duck.name)(state))
  .filter(message => message);
export const getAllAsyncErrorMessages = state => fpsakReduxApi.ducks
  .filter(duck => isAsyncRestMethod(duck.restMethod))
  .map(duck => getRestApiError(duck.name)(state))
  .filter(error => error);
