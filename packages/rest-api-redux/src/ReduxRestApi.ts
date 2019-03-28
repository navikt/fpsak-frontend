import { createRequestApi, RequestConfig } from '@fpsak-frontend/rest-api';
import { Link } from '@fpsak-frontend/rest-api/src/requestApi/LinkTsType';
import { HttpClientApi } from '@fpsak-frontend/rest-api/src/HttpClientApiTsType';

import EndpointOperations from './redux/EndpointOperations';
import ReduxApiCreator from './redux/ReduxApiCreator';
import ReduxEvents from './redux/ReduxEvents';

const getDataContext = (reducerName: string) => (state: any) => state.default[reducerName];

class ReduxRestApi {
  config: RequestConfig[];

  contextPath: string = '';

  requestApi;

  httpClientApi: HttpClientApi;

  reduxApiCreator: ReduxApiCreator;

  constructor(config: RequestConfig[], reducerName: string, contextPath: string, reduxEvents: ReduxEvents) {
    this.config = config;
    this.contextPath = contextPath;
    this.requestApi = createRequestApi(contextPath, config);
    this.httpClientApi = this.requestApi.getHttpClientApi();
    this.reduxApiCreator = new ReduxApiCreator(this.requestApi, getDataContext(reducerName), reduxEvents);
  }

  getEndpointApi = (): { [name: string]: EndpointOperations } => this.config.reduce((acc, c) => ({
    ...acc,
    [c.name]: new EndpointOperations(this.reduxApiCreator, this.contextPath, c),
  }), {})

  getDataReducer = () => this.reduxApiCreator.createReducer();

  injectPaths = (links: Link[]) => {
    this.requestApi.injectPaths(links);
  };

  getHttpClientApi = () => this.httpClientApi;
}

export default ReduxRestApi;
