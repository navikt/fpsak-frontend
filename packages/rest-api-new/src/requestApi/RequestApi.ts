import RequestRunner from './RequestRunner';
import RestApiRequestContext from './RestApiRequestContext';
import HttpClientApi from '../HttpClientApiTsType';
import RequestConfig from '../RequestConfig';
import NotificationMapper from './NotificationMapper';
import Link from './LinkTsType';
import AbstractRequestApi from './AbstractRequestApi';

/**
 * RequestApi
 *
 * Denne klassen opprettes med en referanse til et HttpClientApi (for eksempel Axios), context-path og konfig for
 * de enkelte endepunktene. Det blir så satt opp RequestRunner's for endepunktene. Desse kan hentes via metoden @see getRequestRunner.
 */
class RequestApi extends AbstractRequestApi {
  requestRunnersMappedByName: {[key: string]: RequestRunner};

  constructor(httpClientApi: HttpClientApi, configs: RequestConfig[]) {
    super();
    this.requestRunnersMappedByName = configs.reduce((acc, config) => ({
      ...acc,
      [config.name]: new RequestRunner(httpClientApi, new RestApiRequestContext(config)),
    }), {});
  }

  public startRequest = (endpointName: string, params: any, notificationMapper?: NotificationMapper) => this.requestRunnersMappedByName[endpointName]
    .startProcess(params, notificationMapper);

  public cancelRequest = (endpointName: string) => this.requestRunnersMappedByName[endpointName].cancelRequest();

  public hasPath = (endpointName: string) => !!this.requestRunnersMappedByName[endpointName].getConfig().path;

  public injectPaths = (links: Link[]) => {
    Object.values(this.requestRunnersMappedByName).forEach((runner) => {
      const { rel } = runner.getConfig();
      if (rel) {
        const link = links.find((l) => l.rel === rel);
        if (link) {
          runner.injectLink(link);
        } else {
          runner.resetLink(rel);
        }
      }
    });
  }

  public isMock = () => false;

  public mock = () => undefined;

  public getRequestMockData = () => undefined;

  public clearAllMockData = () => undefined;
}

export default RequestApi;
