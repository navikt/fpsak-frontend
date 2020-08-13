import RequestRunner from './RequestRunner';
import AbstractRequestApi from './AbstractRequestApi';

/**
 * RequestApi
 *
 * Denne klassen opprettes med en referanse til et HttpClientApi (for eksempel Axios), context-path og konfig for
 * de enkelte endepunktene. Det blir så satt opp RequestRunner's for endepunktene. Desse kan hentes via metoden @see getRequestRunner.
 */
class RequestApiMock extends AbstractRequestApi {
  mockdata: {[key: string]: RequestRunner} = {};

  public startRequest = (endpointName: string) => {
    const data = this.mockdata[endpointName];
    if (!data) {
      throw new Error(`Det er ikke satt opp mock-data for endepunkt ${endpointName}`);
    }
    return data;
  }

  public cancelRequest = () => undefined;

  public hasPath = () => true;

  public injectPaths = () => {
  }

  public mock = (endpointName: string, data: any): void => {
    this.mockdata = {
      ...this.mockdata,
      [endpointName]: data,
    };
  };

  public clearAllMockData = () => { this.mockdata = {}; };
}

export default RequestApiMock;
