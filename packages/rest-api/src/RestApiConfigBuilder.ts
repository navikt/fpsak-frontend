import { RequestAdditionalConfig } from './RequestAdditionalConfigTsType';
import RequestConfig from './RequestConfig';

const createConfigWithPathAndConfig = (name, path, config) => new RequestConfig(name, path, config);

/**
 * RestApiConfigBuilder
 *
 * Brukes for å sette opp server-endepunkter.
 */
class RestApiConfigBuilder {
  endpoints: RequestConfig[] = [];

  withGet(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withGetMethod());
    return this;
  }

  withAsyncGet(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withGetAsyncMethod());
    return this;
  }

  withPost(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withPostMethod());
    return this;
  }

  withAsyncPost(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withPostAsyncMethod());
    return this;
  }

  withPut(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withPutMethod());
    return this;
  }

  withAsyncPut(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withPutAsyncMethod());
    return this;
  }

  withPostAndOpenBlob(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, path, config).withPostAndOpenBlob());
    return this;
  }

  withInjectedPath(rel: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push(createConfigWithPathAndConfig(name, undefined, config).withRel(rel));
    return this;
  }

  build(): RequestConfig[] {
    return this.endpoints;
  }
}

export default RestApiConfigBuilder;
