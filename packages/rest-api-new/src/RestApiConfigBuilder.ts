import RequestAdditionalConfig from './RequestAdditionalConfigTsType';
import RequestConfig from './RequestConfig';

const createConfigWithPathAndConfig = (name, path, contextPath, config) => new RequestConfig(name, path, contextPath, config);

/**
 * RestApiConfigBuilder
 *
 * Brukes for å sette opp server-endepunkter.
 */
class RestApiConfigBuilder {
  endpoints: RequestConfig[] = [];

  contextPath?: string = '';

  constructor(contextPath?: string) {
    this.contextPath = contextPath;
  }

  withGet(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, this.contextPath, config).withGetMethod());
    return this;
  }

  withAsyncGet(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, this.contextPath, config).withGetAsyncMethod());
    return this;
  }

  withPost(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, this.contextPath, config).withPostMethod());
    return this;
  }

  withAsyncPost(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, this.contextPath, config).withPostAsyncMethod());
    return this;
  }

  withPut(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, this.contextPath, config).withPutMethod());
    return this;
  }

  withAsyncPut(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, this.contextPath, config).withPutAsyncMethod());
    return this;
  }

  withRel(rel: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, undefined, undefined, config).withRel(rel));
    return this;
  }

  build(): RequestConfig[] {
    return this.endpoints;
  }
}

export default RestApiConfigBuilder;
