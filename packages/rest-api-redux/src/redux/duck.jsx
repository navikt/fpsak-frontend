/* @flow */
import { createSelector } from 'reselect';
import { RequestApi } from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import ReduxRestApi from './ReduxRestApi';

const getDataContext = reducerName => state => state.default[reducerName];

const createReduxRestApi = (requestApi: RequestApi, reducerName: string, reduxEvents: ReduxEvents) => {
  const reduxRestApi = new ReduxRestApi(requestApi, getDataContext(reducerName), reduxEvents);

  const getRestApiState = (endpointName: string) => reduxRestApi.getEndpointState(endpointName);
  const getRestApiError = (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.error);

  return {
    /* Reducers */
    dataReducer: reduxRestApi.createReducer(),
    /* Action creators */
    makeRestApiRequest: (endpointName: string) => reduxRestApi.makeRequestActionCreator(endpointName),
    cancelRestApiRequest: (endpointName: string) => reduxRestApi.cancelRequest(endpointName),
    resetRestApi: (endpointName: string) => reduxRestApi.makeResetActionCreator(endpointName),
    setDataRestApi: (endpointName: string) => reduxRestApi.setDataActionCreator(endpointName),
    /* Selectors */
    getRestApiData: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.data),
    getRestApiMeta: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.meta),
    getRestApiStarted: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.started),
    getRestApiFinished: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.finished),
    getRestApiPollingTimeout: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.pollingTimeout),
    getRestApiError,
  };
};

export default createReduxRestApi;
