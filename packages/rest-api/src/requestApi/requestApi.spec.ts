
import { expect } from 'chai';

import RequestApi from './RequestApi';
import RequestRunner from './RequestRunner';
import RequestConfig from '../RequestConfig';

describe('RequestApi', () => {
  const contextPath = 'example';

  const httpClientGeneralMock = {
    get: () => undefined,
    post: () => undefined,
    put: () => undefined,
    getBlob: () => undefined,
    postBlob: () => undefined,
    postAndOpenBlob: () => undefined,
    getAsync: () => undefined,
    postAsync: () => undefined,
    putAsync: () => undefined,
    isAsyncRestMethod: () => undefined,
  };

  it('skal sette opp korrekt request-runner', () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const requestConfig = new RequestConfig('BEHANDLING', '/behandling');

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    expect(runner.httpClientApi).to.eql(httpClientMock);
    expect(runner.context.config).to.eql(requestConfig);
  });

  it('skal utføre get-request', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
        get: () => Promise.resolve(response),
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
