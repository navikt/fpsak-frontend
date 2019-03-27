import { RequestConfig } from '@fpsak-frontend/rest-api';
import ReduxRestApi from './ReduxRestApi';
import ReduxEvents from './redux/ReduxEvents';

class ReduxRestApiBuilder {
  config: RequestConfig[];

  reducerName: string;

  contextPath: string = '';

  reduxEvents: ReduxEvents = new ReduxEvents();

  constructor(config: RequestConfig[], reducerName: string) {
    this.config = config;
    this.reducerName = reducerName;
  }

  withContextPath = (contextPath: string) => {
    this.contextPath = contextPath;
    return this;
  }

  withReduxEvents = (reduxEvents: ReduxEvents) => {
    this.reduxEvents = reduxEvents;
    return this;
  }

  build = () => new ReduxRestApi(this.config, this.reducerName, this.contextPath, this.reduxEvents)
}

export default ReduxRestApiBuilder;
