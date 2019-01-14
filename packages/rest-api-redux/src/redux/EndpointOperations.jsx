/* @flow */
import type { RequestConfig } from '@fpsak-frontend/rest-api/src/RequestConfigFlowType';

class EndpointOperations {
  restApi: any;

  contextPath: string

  name: string

  path: string

  constructor(restApi: any, contextPath: string, config: RequestConfig) {
    this.restApi = restApi;
    this.contextPath = contextPath;
    this.name = config.name;
    this.path = config.path ? `/${contextPath}${config.path}` : '';
  }

  makeRestApiRequest = () => this.restApi.makeRestApiRequest(this.name);

  cancelRestApiRequest = () => this.restApi.cancelRestApiRequest(this.name);

  resetRestApi = () => this.restApi.resetRestApi(this.name);

  setDataRestApi = () => this.restApi.setDataRestApi(this.name);

  getRestApiData = () => this.restApi.getRestApiData(this.name);

  getRestApiMeta =() => this.restApi.getRestApiMeta(this.name);

  getRestApiError = () => this.restApi.getRestApiError(this.name);

  getRestApiStarted = () => this.restApi.getRestApiStarted(this.name);

  getRestApiFinished = () => this.restApi.getRestApiFinished(this.name);

  getRestApiPollingTimeout = () => this.restApi.getRestApiPollingTimeout(this.name);
}

export default EndpointOperations;
