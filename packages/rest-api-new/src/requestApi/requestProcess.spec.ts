import { expect } from 'chai';
import sinon from 'sinon';

import asyncPollingStatus from './asyncPollingStatus';
import RequestProcess, { REQUEST_POLLING_CANCELLED } from './RequestProcess';
import NotificationMapper from './NotificationMapper';

class NotificationHelper {
  mapper: NotificationMapper;

  requestStartedCallback = sinon.spy();

  requestFinishedCallback = sinon.spy();

  requestErrorCallback = sinon.spy();

  statusRequestStartedCallback = sinon.spy();

  statusRequestFinishedCallback = sinon.spy();

  updatePollingMessageCallback = sinon.spy();

  addPollingTimeoutEventHandler = sinon.spy();

  constructor() {
    const mapper = new NotificationMapper();
    mapper.addRequestStartedEventHandler(this.requestStartedCallback);
    mapper.addRequestFinishedEventHandler(this.requestFinishedCallback);
    mapper.addRequestErrorEventHandlers(this.requestErrorCallback);
    mapper.addStatusRequestStartedEventHandler(this.statusRequestStartedCallback);
    mapper.addStatusRequestFinishedEventHandler(this.statusRequestFinishedCallback);
    mapper.addUpdatePollingMessageEventHandler(this.updatePollingMessageCallback);
    this.mapper = mapper;
  }
}

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

describe('RequestProcess', () => {
  const HTTP_ACCEPTED = 202;
  const defaultConfig = {
    maxPollingLimit: undefined,
  };

  it('skal hente data via get-kall', async () => {
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

    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.run(params);

    expect(result).to.eql({ payload: 'data' });
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql('data');
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestErrorCallback.called).to.false;
  });

  it('skal utføre long-polling request som når maks polling-forsøk', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const allGetResults = [{
      ...response,
      data: {
        status: asyncPollingStatus.PENDING,
        message: 'Polling continues',
        pollIntervalMillis: 0,
      },
    }, {
      ...response,
      data: {
        status: asyncPollingStatus.PENDING,
        message: 'Polling continues',
        pollIntervalMillis: 0,
      },
    }];

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () => Promise.resolve({
        ...response,
        status: HTTP_ACCEPTED,
        headers: {
          location: 'http://polling.url',
        },
      }),
      get: () => Promise.resolve(allGetResults.shift()),
    };

    const params = {
      behandlingId: 1,
    };

    const config = {
      ...defaultConfig,
      maxPollingLimit: 1, // Vil nå taket etter første førsøk
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', config);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    try {
      await process.run(params);
    } catch (error) {
      expect(error.message).to.eql('Maximum polling attempts exceeded');
      // eslint-disable-next-line no-unused-expressions
      expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
      // eslint-disable-next-line no-unused-expressions
      expect(notificationHelper.statusRequestStartedCallback.calledOnce).to.true;
      // eslint-disable-next-line no-unused-expressions
      expect(notificationHelper.statusRequestFinishedCallback.calledOnce).to.true;
      // eslint-disable-next-line no-unused-expressions
      expect(notificationHelper.updatePollingMessageCallback.calledOnce).to.true;
      expect(notificationHelper.updatePollingMessageCallback.getCalls()[0].args[0]).is.eql('Polling continues');
    }
  });

  it('skal utføre long-polling request som en så avbryter manuelt', async () => {
    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      getAsync: () => Promise.resolve({
        ...response,
        status: HTTP_ACCEPTED,
        headers: {
          location: 'test',
        },
      }),
      get: () => Promise.resolve({
        ...response,
        data: {
          status: asyncPollingStatus.PENDING,
          message: 'Polling continues',
          pollIntervalMillis: 0,
        },
      }),
    };

    const params = {
      behandlingId: 1,
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', defaultConfig);
    const mapper = new NotificationMapper();
    // Etter en runde med polling vil en stoppe prosessen via event
    mapper.addUpdatePollingMessageEventHandler(() => { process.cancel(); return Promise.resolve(''); });
    process.setNotificationEmitter(mapper.getNotificationEmitter());

    const resResponse = await process.run(params);

    expect(resResponse).to.eql({ payload: REQUEST_POLLING_CANCELLED });
  });

  it('skal hente data med nullverdi', async () => {
    const response = {
      data: null,
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.run(params);

    expect(result).is.eql({ payload: undefined });
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.null;
  });
});
