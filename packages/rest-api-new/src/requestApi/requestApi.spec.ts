import { expect } from 'chai';

import RequestApi from './RequestApi';
import RequestConfig from '../RequestConfig';

describe('RequestApi', () => {
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
  };

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

    const api = new RequestApi(httpClientMock, [requestConfig]);

    const result = await api.startRequest(requestConfig.name, params);

    expect(result.payload).to.eql('data');
  });
});
