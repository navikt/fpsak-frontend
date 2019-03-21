/* @flow */
import { expect } from 'chai';

import RequestApi from './RequestApi';
import RequestRunner from './RequestRunner';
import RequestConfig from '../RequestConfig';

describe('RequestApi', () => {
  const contextPath = 'example';

  it('skal sette opp korrekt request-runner', () => {
    const httpClientMock = {
      get: (): Promise<Response> => Promise.resolve(new Response('data')),
    };

    const requestConfig = new RequestConfig('BEHANDLING', '/behandling');

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    expect(runner.httpClientApi).to.eql(httpClientMock);
    expect(runner.context.config).to.eql(requestConfig);
  });

  it('skal utføre get-request', async () => {
    const httpClientMock = {
      get: () => ({
        data: 'data',
        status: 200,
      }),
    };

    const requestConfig = new RequestConfig('BEHANDLING', '/behandling');
    const params = {
      behandlingId: 1,
    };

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    const result = await runner.startProcess(params);

    expect(result.payload).to.eql('data');
  });
});
