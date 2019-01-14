/* @flow */
import type { RequestAdditionalConfig } from './RequestAdditionalConfigFlowType';
import type { HttpClientApi } from './HttpClientApiFlowType';
import type { RequestConfig } from './RequestConfigFlowType';

/**
 * maxPollingLimit: Maksimum antall ganger en skal forsøke å polle når en venter på ressurs (long polling). Kun aktuell ved metodene som inkluderer "Async".
 * fetchLinkDataAutomatically: Når satt til true blir "links" i en respons utført automatisk og resultatene fra desse kallene blir aggregert til en respons.
 * addLinkDataToArray: Når satt til true blir data hentet fra "links" lagt til i samme array (i responsen). Er kun aktuell når fetchLinkDataAutomatically=true.
 */
const defaultConfig = {
  maxPollingLimit: undefined,
  fetchLinkDataAutomatically: true,
  addLinkDataToArray: false,
};
const getConfig = (config = {}) => ({
  ...defaultConfig,
  ...config,
});

class RestApiConfigBuilder {
  endpoints = [];

  httpClientApi: HttpClientApi;

  constructor(httpClientApi: HttpClientApi) {
    this.httpClientApi = httpClientApi;
  }

  withGet(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.get, config: getConfig(config),
    });
    return this;
  }

  withAsyncGet(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.getAsync, config: getConfig(config),
    });
    return this;
  }

  withPost(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.post, config: getConfig(config),
    });
    return this;
  }

  withAsyncPost(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.postAsync, config: getConfig(config),
    });
    return this;
  }

  withPut(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.put, config: getConfig(config),
    });
    return this;
  }

  withAsyncPut(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.putAsync, config: getConfig(config),
    });
    return this;
  }

  withPostAndOpenBlob(path: string, name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      path, name, restMethod: this.httpClientApi.postAndOpenBlob, config: getConfig(config),
    });
    return this;
  }

  withKeyName(name: string, config?: RequestAdditionalConfig) {
    this.endpoints.push({
      name, config: getConfig(config),
    });
    return this;
  }

  build(): RequestConfig[] {
    return this.endpoints;
  }
}

export default RestApiConfigBuilder;
