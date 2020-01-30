import { createRequestApi, RequestConfig } from '@fpsak-frontend/rest-api';
import { Link } from '@fpsak-frontend/rest-api/src/requestApi/LinkTsType';
import { HttpClientApi } from '@fpsak-frontend/rest-api/src/HttpClientApiTsType';

import EndpointOperations from './redux/EndpointOperations';
import ReduxApiCreator from './redux/ReduxApiCreator';
import ReduxEvents from './redux/ReduxEvents';

const getDataContext = (reducerName: string) => (state: any) => state.default[reducerName];

const replaceWithConfigFromAnotherKey = (configs: RequestConfig[]) => configs.map((c) => {
  if (!c.config.saveResponseIn) {
    return c;
  }

  const otherConfig = configs.find((c2) => c2.name === c.config.saveResponseIn);
  if (!otherConfig) {
    throw Error(`Could not find config for key ${c.config.saveResponseIn}`);
  }

  const newConfig = {
    ...otherConfig.config,
    saveResponseIn: c.config.saveResponseIn,
  };
  return new RequestConfig(c.name, c.path, newConfig).withRel(c.rel).withRestMethod(c.restMethod);
});


class ReduxRestApi {
  configs: RequestConfig[];

  contextPath = '';

  requestApi;

  httpClientApi: HttpClientApi;

  reduxApiCreator: ReduxApiCreator;

  constructor(config: RequestConfig[], reducerName: string, contextPath: string, reduxEvents: ReduxEvents) {
    this.configs = replaceWithConfigFromAnotherKey(config);
    this.contextPath = contextPath;
    this.requestApi = createRequestApi(contextPath, this.configs);
    this.httpClientApi = this.requestApi.getHttpClientApi();
    this.reduxApiCreator = new ReduxApiCreator(this.requestApi, getDataContext(reducerName), reduxEvents);
  }

  getEndpointApi = (): { [name: string]: EndpointOperations } => this.configs.reduce((acc, c) => ({
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
