import { RequestAdditionalConfig } from './RequestAdditionalConfigTsType';

export const RequestType = {
  GET: 'GET',
  GET_ASYNC: 'GET_ASYNC',
  POST: 'POST',
  POST_ASYNC: 'POST_ASYNC',
  PUT: 'PUT',
  PUT_ASYNC: 'PUT_ASYNC',
  POST_AND_OPEN_BLOB: 'POST_AND_OPEN_BLOB',
};

/**
 * maxPollingLimit: Maksimum antall ganger en skal forsøke å polle når en venter på ressurs (long polling). Kun aktuell ved metodene som inkluderer "Async".
 * fetchLinkDataAutomatically: Når satt til true blir "links" i en respons utført automatisk og resultatene fra desse kallene blir aggregert til en respons.
 * linksToFetchAutomatically: Liste med rel's som skal hentes automatisk
 * addLinkDataToArray: Når satt til true blir data hentet fra "links" lagt til i samme array (i responsen). Er kun aktuell når
 *  fetchLinkDataAutomatically=true.
 * storeResultKey: Bruk denne når en utfører long-polling og resultatet skal lagres på en annen nøkkel en den som initierer kallet.
 */
const defaultConfig = {
  maxPollingLimit: undefined,
  fetchLinkDataAutomatically: true,
  linksToFetchAutomatically: [],
  addLinkDataToArray: false,
  storeResultKey: undefined,
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

    restMethod?: string = RequestType.GET;

    rel?: string;

    constructor(name: string, path?: string, config?: RequestAdditionalConfig) {
      this.name = name;
      this.path = path;
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

    withPostAndOpenBlob = () => {
      this.restMethod = RequestType.POST_AND_OPEN_BLOB;
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
}

export default RequestConfig;
