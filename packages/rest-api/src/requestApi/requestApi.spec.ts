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

  it('skal kunnne injecte url når rel er satt opp for endepunkt', () => {
    const rel = 'behandling-rel';
    const requestConfig = new RequestConfig('BEHANDLING').withRel(rel);

    const api = new RequestApi(httpClientGeneralMock, contextPath, [requestConfig]);

    const links = [{
      href: '/behandling',
      rel,
      type: 'GET',
    }];
    api.injectPaths(links);

    const newConfig = api.getRequestRunner(requestConfig.name).getConfig();
    expect(newConfig.name).to.eql('BEHANDLING');
    expect(newConfig.path).to.eql('/behandling');
    expect(newConfig.restMethod).to.eql('GET');
    expect(newConfig.rel).to.eql('behandling-rel');
  });

  it('skal resette alle injecta urler som ikke er med i siste lista', () => {
    const relBehandling = 'behandling-rel';
    const requestConfigBehandling = new RequestConfig('BEHANDLING').withRel(relBehandling);
    const relFagsak = 'fagsak-rel';
    const requestConfigFagsak = new RequestConfig('FAGSAK').withRel(relFagsak);

    const api = new RequestApi(httpClientGeneralMock, contextPath, [requestConfigBehandling, requestConfigFagsak]);

    const links1 = [{
      href: '/behandling',
      rel: relBehandling,
      type: 'GET',
    }, {
      href: '/fagsak',
      rel: relFagsak,
      type: 'POST',
    }];
    api.injectPaths(links1);

    const newConfig1 = api.getRequestRunner(requestConfigBehandling.name).getConfig();
    expect(newConfig1.path).to.eql('/behandling');
    const newConfig2 = api.getRequestRunner(requestConfigFagsak.name).getConfig();
    expect(newConfig2.path).to.eql('/fagsak');

    const links2 = [{
      href: '/behandling',
      rel: relBehandling,
      type: 'GET',
    }];
    api.injectPaths(links2);

    const newConfig21 = api.getRequestRunner(requestConfigBehandling.name).getConfig();
    expect(newConfig21.path).to.eql('/behandling');
    const newConfig22 = api.getRequestRunner(requestConfigFagsak.name).getConfig();
    expect(newConfig22.path).is.undefined;
  });
});
