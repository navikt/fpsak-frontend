
import sinon from 'sinon';
import { expect } from 'chai';

import RestApiRequestContext from './RestApiRequestContext';
import NotificationMapper from './NotificationMapper';
import asyncPollingStatus from './asyncPollingStatus';
import RequestRunner from './RequestRunner';
import RequestConfig from '../RequestConfig';

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

describe('RequestRunner', () => {
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

    const context = new RestApiRequestContext('fpsak', requestConfig);
    const runner = new RequestRunner(httpClientMock, context);

    expect(runner.httpClientApi).to.eql(httpClientMock);
    expect(runner.context.config).to.eql(requestConfig);
    expect(runner.getName()).to.eql(requestConfig.name);
    expect(runner.getPath()).to.eql(`/fpsak${requestConfig.path}`);
    expect(runner.getRestMethodName()).to.eql('GET');
  });

  it('skal utføre get-request og sende status-eventer', async () => {
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

    const context = new RestApiRequestContext('fpsak', requestConfig);
    const runner = new RequestRunner(httpClientMock, context);
    const mapper = new NotificationMapper();
    const requestStartedCallback = sinon.spy();
    const requestFinishedCallback = sinon.spy();
    mapper.addRequestStartedEventHandler(requestStartedCallback);
    mapper.addRequestFinishedEventHandler(requestFinishedCallback);

    const result = await runner.startProcess(params, mapper);

    expect(result.payload).to.eql('data');
    // eslint-disable-next-line no-unused-expressions
    expect(requestStartedCallback.called).is.true;
    // eslint-disable-next-line no-unused-expressions
    expect(requestFinishedCallback.called).is.true;
  });

  it('skal utføre long-polling request som en så avbryter manuelt', async () => {
    const HTTP_ACCEPTED = 202;

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () => Promise.resolve({
        data: 'test',
        status: HTTP_ACCEPTED,
        headers: {
          location: 'test',
        },
      }),
      get: () => Promise.resolve({
        data: {
          status: asyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
        status: 200,
        headers: {
          location: '',
        },
      }),
    };

    const requestConfig = new RequestConfig('BEHANDLING', '/behandling', {
      fetchLinkDataAutomatically: true,
    }).withGetAsyncMethod();

    const params = {
      behandlingId: 1,
    };

    const context = new RestApiRequestContext('fpsak', requestConfig);
    const runner = new RequestRunner(httpClientMock, context);
    const mapper = new NotificationMapper();
    // Etter en runde med polling vil en stoppe prosessen via event
    mapper.addUpdatePollingMessageEventHandler(() => { runner.stopProcess(); return Promise.resolve(''); });

    const response = await runner.startProcess(params, mapper);

    expect(response).to.eql({ payload: 'INTERNAL_CANCELLATION' });
  });
});
