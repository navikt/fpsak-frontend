import RequestConfig from '../RequestConfig';

class RestApiRequestContext {
  endpointName: string

  config: RequestConfig

  hostname = '';

  constructor(config: RequestConfig) {
    this.config = config;
    this.endpointName = config.name;
  }

  withHostname = (hostname: string) => {
    this.hostname = hostname;
    return this;
  }

  getEndpointName = () => this.endpointName

  getConfig = () => this.config

  getHostname = () => this.hostname
}

export default RestApiRequestContext;
