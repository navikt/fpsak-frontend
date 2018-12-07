/* @flow */
import { createSelector } from 'reselect';

import ReduxRestApi from './ReduxRestApi';
import RequestApi from '../requestApi/RequestApi';

const getDataContext = reducerName => state => state.default[reducerName];

const createReduxRestApi = (requestApi: RequestApi, reducerName: string) => {
  const reduxRestApi = new ReduxRestApi(requestApi, getDataContext(reducerName));

  const getRestApiState = (endpointName: string) => reduxRestApi.getEndpointState(endpointName);
  const getRestApiPollingMessage = (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.pollingMessage);
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
    getRestApiError,
    getRestApiStarted: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.started),
    getRestApiFinished: (endpointName: string) => createSelector([getRestApiState(endpointName)], apiState => apiState.finished),

    getAllAsyncPollingMessages: (state: any) => reduxRestApi.ducks
      .filter(duck => requestApi.getHttpClientApi().isAsyncRestMethod(duck.requestRunner.getRestMethod()))
      .map(duck => getRestApiPollingMessage(duck.name)(state))
      .filter(message => message),
    getAllAsyncErrorMessages: (state: any) => reduxRestApi.ducks
      .filter(duck => requestApi.getHttpClientApi().isAsyncRestMethod(duck.requestRunner.getRestMethod()))
      .map(duck => getRestApiError(duck.name)(state))
      .filter(error => error),
  };
};

export default createReduxRestApi;
