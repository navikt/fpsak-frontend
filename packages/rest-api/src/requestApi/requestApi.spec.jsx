/* @flow */
import { expect } from 'chai';

import RequestApi from './RequestApi';
import RestApiRequestContext from './RestApiRequestContext';
import RequestRunner from './RequestRunner';

describe('RequestApi', () => {
  const contextPath = 'example';

  it('skal sette opp korrekt request-runner', () => {
    const httpClientMock = {
      get: (): Promise<Response> => Promise.resolve(new Response('data')),
    };

    const requestConfig = {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    };

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    expect(runner.httpClientApi).to.eql(httpClientMock);
    expect(runner.context.config).to.eql(requestConfig);
  });

  it('skal kunne oppdatere server-url i request-runner', () => {
    const httpClientMock = {
      get: (): Promise<Response> => Promise.resolve(new Response('data')),
    };

    const requestConfig = {
      path: '/behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    };

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    expect(runner.getPath()).to.eql(`/${contextPath}${requestConfig.path}`);

    const newContext = new RestApiRequestContext(runner.context.contextPath, runner.context.config)
      .withHostname('http://test.com');
    api.replaceEndpointContexts([newContext]);

    expect(runner.getPath()).to.eql(`http://test.com/${contextPath}${requestConfig.path}`);
  });

  it('skal ikke kunne lage/oppdatere endepunkt som ikke finnes', () => {
    const httpClientMock = {
      get: (): Promise<Response> => Promise.resolve(new Response('data')),
    };

    const requestConfig = {
      path: '/behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    };

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    expect(runner.getPath()).to.eql(`/${contextPath}${requestConfig.path}`);

    const requestConfigNotExisting = {
      path: '/fagsak',
      name: 'FAGSAK',
      restMethod: httpClientMock.get,
      config: {},
    };
    const newContext = new RestApiRequestContext(runner.context.contextPath, requestConfigNotExisting);
    try {
      api.replaceEndpointContexts([newContext]);
    } catch (error) {
      expect(error.message).to.eql('No request runner is configured: FAGSAK');
    }
  });

  it('skal utføre get-request', async () => {
    const httpClientMock = {
      get: () => 'data',
    };

    const requestConfig = {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    };
    const params = {
      behandlingId: 1,
    };

    const api = new RequestApi(httpClientMock, contextPath, [requestConfig]);
    const runner: RequestRunner = api.getRequestRunner(requestConfig.name);

    const result = await runner.startProcess(params);

    expect(result.payload).to.eql('data');
  });
});
