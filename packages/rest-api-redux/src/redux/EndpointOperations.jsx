/* @flow */
import { createSelector } from 'reselect';

import RequestConfig from '@fpsak-frontend/rest-api';

import ReduxApiCreator from './ReduxApiCreator';

class EndpointOperations {
  reduxApiCreator: ReduxApiCreator;

  contextPath: string

  name: string

  path: string

  constructor(reduxApiCreator: ReduxApiCreator, contextPath: string, config: RequestConfig) {
    this.reduxApiCreator = reduxApiCreator;
    this.contextPath = contextPath;
    this.name = config.name;
    this.path = config.path ? `/${contextPath}${config.path}` : '';
  }

  makeRestApiRequest = () => this.reduxApiCreator.makeRequestActionCreator(this.name);

  cancelRestApiRequest = () => this.reduxApiCreator.cancelRequest(this.name);

  resetRestApi = () => this.reduxApiCreator.makeResetActionCreator(this.name);

  setDataRestApi = () => this.reduxApiCreator.setDataActionCreator(this.name);

  getRestApiState = (): any => this.reduxApiCreator.getEndpointState(this.name);

  getRestApiData = (): any => createSelector([this.getRestApiState()], apiState => apiState.data);

  getRestApiMeta = (): any => createSelector([this.getRestApiState()], apiState => apiState.meta);

  getRestApiError = (): any => createSelector([this.getRestApiState()], apiState => apiState.error)

  getRestApiStarted = (): any => createSelector([this.getRestApiState()], apiState => apiState.started);

  getRestApiFinished = (): any => createSelector([this.getRestApiState()], apiState => apiState.finished);

  getRestApiPollingTimeout = (): any => createSelector([this.getRestApiState()], apiState => apiState.pollingTimeout);
}

export default EndpointOperations;
