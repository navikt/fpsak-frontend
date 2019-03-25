import RequestConfig from '../RequestConfig';

class RestApiRequestContext {
  endpointName: string

  contextPath: string

  config: RequestConfig

  hostname: string = '';

  constructor(contextPath: string, config: RequestConfig) {
    this.contextPath = contextPath;
    this.config = config;
    this.endpointName = config.name;
  }

  withHostname = (hostname: string) => {
    this.hostname = hostname;
    return this;
  }

  getEndpointName = () => this.endpointName

  getContextPath = () => this.contextPath

  getConfig = () => this.config

  getHostname = () => this.hostname
}

export default RestApiRequestContext;
