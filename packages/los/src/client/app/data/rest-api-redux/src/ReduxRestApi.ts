import { createRequestApi, RequestConfig } from 'data/rest-api';

import EndpointOperations from './redux/EndpointOperations';
import ReduxApiCreator from './redux/ReduxApiCreator';
import ReduxEvents from './redux/ReduxEvents';

const getDataContext = (reducerName: string) => state => state.default[reducerName];

class ReduxRestApi {
  config: RequestConfig[];

  contextPath: string = '';

  reduxApiCreator: ReduxApiCreator;

  constructor(config: RequestConfig[], reducerName: string, contextPath: string, reduxEvents: ReduxEvents) {
    this.config = config;
    this.contextPath = contextPath;
    const requestApi = createRequestApi(contextPath, config);
    this.reduxApiCreator = new ReduxApiCreator(requestApi, getDataContext(reducerName), reduxEvents);
  }

  getEndpointApi = (): { [name: string]: EndpointOperations } => this.config.reduce((acc, c) => ({
    ...acc,
    [c.name]: new EndpointOperations(this.reduxApiCreator, this.contextPath, c),
  }), {})

  getDataReducer = () => this.reduxApiCreator.createReducer();
}

export default ReduxRestApi;
