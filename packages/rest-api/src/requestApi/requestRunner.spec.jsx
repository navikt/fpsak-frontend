/* @flow */
import sinon from 'sinon';
import { expect } from 'chai';

import RestApiRequestContext from './RestApiRequestContext';
import NotificationMapper from './NotificationMapper';
import asyncPollingStatus from './asyncPollingStatus';
import RequestRunner from './RequestRunner';

describe('RequestRunner', () => {
  it('skal sette opp korrekt request-runner', () => {
    const httpClientMock = {
      get: () => 'data',
      getMethodName: () => 'GET',
      isAsyncRestMethod: () => false,
    };

    const requestConfig = {
      path: '/behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.get,
      config: {},
    };

    const context = new RestApiRequestContext('fpsak', requestConfig);
    const runner = new RequestRunner(httpClientMock, context);

    expect(runner.httpClientApi).to.eql(httpClientMock);
    expect(runner.context.config).to.eql(requestConfig);
    expect(runner.getName()).to.eql(requestConfig.name);
    expect(runner.getRestMethod()).to.eql(requestConfig.restMethod);
    expect(runner.getPath()).to.eql(`/fpsak${requestConfig.path}`);
    expect(runner.getRestMethodName()).to.eql('GET');
    expect(runner.isAsyncRestMethod()).is.false;
  });

  it('skal utføre get-request og sende status-eventer', async () => {
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

    const context = new RestApiRequestContext('fpsak', requestConfig);
    const runner = new RequestRunner(httpClientMock, context);
    const mapper = new NotificationMapper();
    const requestStartedCallback = sinon.spy();
    const requestFinishedCallback = sinon.spy();
    mapper.addRequestStartedEventHandler(requestStartedCallback);
    mapper.addRequestFinishedEventHandler(requestFinishedCallback);

    const result = await runner.startProcess(params, mapper);

    expect(result.payload).to.eql('data');
    expect(requestStartedCallback.called).is.true;
    expect(requestFinishedCallback.called).is.true;
  });

  it('skal utføre long-polling request som en så avbryter manuelt', async () => {
    const HTTP_ACCEPTED = 202;

    const httpClientMock = {
      getAsync: () => ({
        status: HTTP_ACCEPTED,
        headers: {
          location: 'test',
        },
      }),
      get: () => ({
        data: {
          status: asyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
      }),
    };

    const requestConfig = {
      path: 'behandling',
      name: 'BEHANDLING',
      restMethod: httpClientMock.getAsync,
      config: {
        fetchLinkDataAutomatically: true,
      },
    };
    const params = {
      behandlingId: 1,
    };

    const context = new RestApiRequestContext('fpsak', requestConfig);
    const runner = new RequestRunner(httpClientMock, context);
    const mapper = new NotificationMapper();
    // Etter en runde med polling vil en stoppe prosessen via event
    mapper.addUpdatePollingMessageEventHandler(() => runner.stopProcess());

    const response = await runner.startProcess(params, mapper);

    expect(response).to.eql('CANCELLED');
  });
});
