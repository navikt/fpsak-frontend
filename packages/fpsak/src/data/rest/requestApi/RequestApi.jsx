/* @flow */
import RequestRunner from './RequestRunner';
import RestApiRequestContext from './RestApiRequestContext';
import type { HttpClientApi } from '../HttpClientApiFlowType';
import type { RequestConfig } from '../RequestConfigFlowType';

/**
 * RequestApi
 *
 * Denne klassen opprettes med en referanse til et HttpClientApi (for eksempel Axios), context-path og konfig for
 * de enkelte endepunktene. Det blir så satt opp RequestRunner's for endepunktene. Desse kan hentes via metoden @see getRequestRunner.
 *
 * Bruk metoden @see replaceEndpointContexts for å oppdatere konfig for en eller flere RequestRunner's. En kan ikke legge til nye endepunkt,
 * kun oppdatere eksisterende.
 */
class RequestApi {
  httpClientApi: HttpClientApi

  requestRunnersMappedByName: {[key: string]: RequestRunner};

  constructor(httpClientApi: HttpClientApi, contextPath: string, configs: RequestConfig[]) {
    this.httpClientApi = httpClientApi;
    this.requestRunnersMappedByName = configs.reduce((acc, config) => ({
      ...acc,
      [config.name]: new RequestRunner(httpClientApi, new RestApiRequestContext(contextPath, config)),
    }), {});
  }

  getHttpClientApi = () => this.httpClientApi;

  getEndpointNames = (): string[] => Object.keys(this.requestRunnersMappedByName)

  getCurrentContexts = (): RestApiRequestContext[] => (Object.values(this.requestRunnersMappedByName): any)
    .map(runner => runner.getContext())

  replaceEndpointContexts = (contexts: RestApiRequestContext[]) => {
    contexts.forEach((context) => {
      const requestRunner = this.requestRunnersMappedByName[context.getEndpointName()];
      if (!requestRunner) {
        throw new Error(`No request runner is configured: ${context.getEndpointName()}`);
      }
      requestRunner.replaceContext(context);
    });
  }

  getRequestRunner = (endpointName: string): RequestRunner => this.requestRunnersMappedByName[endpointName];
}

export default RequestApi;
