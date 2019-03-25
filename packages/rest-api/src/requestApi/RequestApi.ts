import RequestRunner from './RequestRunner';
import RestApiRequestContext from './RestApiRequestContext';
import { HttpClientApi } from '../HttpClientApiTsType';
import RequestConfig from '../RequestConfig';

/**
 * RequestApi
 *
 * Denne klassen opprettes med en referanse til et HttpClientApi (for eksempel Axios), context-path og konfig for
 * de enkelte endepunktene. Det blir så satt opp RequestRunner's for endepunktene. Desse kan hentes via metoden @see getRequestRunner.
 */
class RequestApi {
  httpClientApi: HttpClientApi;

  requestRunnersMappedByName: {[key: string]: RequestRunner};

  constructor(httpClientApi: HttpClientApi, contextPath: string, configs: RequestConfig[]) {
    this.httpClientApi = httpClientApi;
    this.requestRunnersMappedByName = configs.reduce((acc, config) => ({
      ...acc,
      [config.name]: new RequestRunner(httpClientApi, new RestApiRequestContext(contextPath, config)),
    }), {});
  }

  getEndpointNames = (): string[] => Object.keys(this.requestRunnersMappedByName)

  getRequestRunner = (endpointName: string): RequestRunner => this.requestRunnersMappedByName[endpointName];

  getHttpClientApi = () => this.httpClientApi;
}

export default RequestApi;
