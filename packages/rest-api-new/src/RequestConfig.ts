import RequestAdditionalConfig from './RequestAdditionalConfigTsType';

export const RequestType = {
  GET: 'GET',
  GET_ASYNC: 'GET_ASYNC',
  POST: 'POST',
  POST_ASYNC: 'POST_ASYNC',
  PUT: 'PUT',
  PUT_ASYNC: 'PUT_ASYNC',
};

/**
 * maxPollingLimit: Maksimum antall ganger en skal forsøke å polle når en venter på ressurs (long polling). Kun aktuell ved metodene som inkluderer "Async".
 * saveResponseIn: Bruk denne når en utfører long-polling og resultatet skal lagres på en annen nøkkel en den som initierer kallet.
 */
const defaultConfig = {
  maxPollingLimit: undefined,
  saveResponseIn: undefined,
};
const formatConfig = (config = {}) => ({
  ...defaultConfig,
  ...config,
});

/**
 * RequestConfig
 */
class RequestConfig {
    name: string;

    config?: RequestAdditionalConfig;

    path?: string;

    contextPath?: string;

    restMethod?: string = RequestType.GET;

    rel?: string;

    requestPayload?: any;

    constructor(name: string, path?: string, contextPath?: string, config?: RequestAdditionalConfig) {
      this.name = name;
      this.path = path;
      this.contextPath = contextPath;
      this.config = formatConfig(config);
    }

    withGetMethod = () => {
      this.restMethod = RequestType.GET;
      return this;
    }

    withGetAsyncMethod = () => {
      this.restMethod = RequestType.GET_ASYNC;
      return this;
    }

    withPostMethod = () => {
      this.restMethod = RequestType.POST;
      return this;
    }

    withPostAsyncMethod = () => {
      this.restMethod = RequestType.POST_ASYNC;
      return this;
    }

    withPutMethod = () => {
      this.restMethod = RequestType.PUT;
      return this;
    }

    withPutAsyncMethod = () => {
      this.restMethod = RequestType.PUT_ASYNC;
      return this;
    }

    withRel = (rel: string) => {
      this.rel = rel;
      return this;
    }

    withRestMethod = (restMethod: string) => {
      this.restMethod = restMethod.toUpperCase();
      return this;
    }

    withRequestPayload = (requestPayload?: any) => {
      this.requestPayload = requestPayload;
      return this;
    }

    getContextPath = () => this.contextPath
}

export default RequestConfig;
