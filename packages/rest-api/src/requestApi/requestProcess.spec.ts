import { expect } from 'chai';
import sinon from 'sinon';

import asyncPollingStatus from './asyncPollingStatus';
import RequestProcess from './RequestProcess';
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
    mapper.addRequestErrorEventHandler(this.requestErrorCallback);
    mapper.addStatusRequestStartedEventHandler(this.statusRequestStartedCallback);
    mapper.addStatusRequestFinishedEventHandler(this.statusRequestFinishedCallback);
    mapper.addUpdatePollingMessageEventHandler(this.updatePollingMessageCallback);
    mapper.addPollingTimeoutEventHandler(this.addPollingTimeoutEventHandler);
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
    fetchLinkDataAutomatically: true,
    addLinkDataToArray: false,
    linksToFetchAutomatically: [],
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

  it('skal utføre links-kall automatisk og aggregere resultatet i et objekt', async () => {
    const params = {
      behandlingId: 1,
    };

    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const allResponses = [{
      ...response,
      data: {
        links: [{
          href: 'www.test1.com',
          type: 'GET',
          requestPayload: params,
          rel: 'test1',
        }, {
          href: 'www.test2.com',
          type: 'GET',
          requestPayload: params,
          rel: 'test2',
        }],
      },
    }, {
      ...response,
      data: 'test1data',
    }, {
      ...response,
      data: 'test2data',
    }];

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(allResponses.shift()),
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    const result = await process.run(params);

    const resultObject = {
      payload: {
        links: [{
          href: 'www.test1.com',
          type: 'GET',
          requestPayload: params,
          rel: 'test1',
        }, {
          href: 'www.test2.com',
          type: 'GET',
          requestPayload: params,
          rel: 'test2',
        }],
        test1: 'test1data',
        test2: 'test2data',
      },
    };
    expect(result).to.eql(resultObject);
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql(resultObject.payload);
  });

  it('skal utføre links-kall automatisk og aggregere resultatet i et array når flagget addLinkDataToArray er satt til false', async () => {
    const params = {
      behandlingId: 1,
    };

    const response = {
      data: 'data',
      status: 200,
      headers: {
        location: '',
      },
    };

    const allResponses = [{
      ...response,
      data: {
        links: [{
          href: 'www.test1.com',
          type: 'GET',
          requestPayload: params,
          rel: 'test1',
        }, {
          href: 'www.test2.com',
          type: 'GET',
          requestPayload: params,
          rel: 'test2',
        }],
      },
    }, {
      ...response,
      data: 'test1data',
    }, {
      ...response,
      data: 'test2data',
    }];

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(allResponses.shift()),
    };

    const config = {
      ...defaultConfig,
      addLinkDataToArray: true,
    };
    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', config);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    const result = await process.run(params);

    const resultObject = {
      payload: ['test1data', 'test2data'],
    };
    expect(result).to.eql(resultObject);
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql(resultObject.payload);
  });

  it('skal ikke utføre links-kall automatisk når en har satt flagget fetchLinkDataAutomatically til false', async () => {
    const params = {
      behandlingId: 1,
    };

    const responseData = {
      links: [{
        href: 'www.test1.com',
        type: 'GET',
        requestPayload: params,
        rel: 'test1',
      }],
    };

    const response = {
      data: responseData,
      status: 200,
      headers: {
        location: '',
      },
    };

    const httpClientMock = {
      ...httpClientGeneralMock,
      get: () => Promise.resolve(response),
    };

    const config = {
      ...defaultConfig,
      fetchLinkDataAutomatically: false,
    };
    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', config);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    const result = await process.run(params);

    expect(result).to.eql({ payload: responseData });
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql(responseData);
  });

  it('skal utføre long-polling request der polling nr 2 gir resultatet', async () => {
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
      data: 'resultatdata',
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

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    const resResponse = await process.run(params);

    expect(resResponse).to.eql({ payload: 'resultatdata' });
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.statusRequestStartedCallback.calledTwice).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.statusRequestFinishedCallback.calledTwice).to.true;
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.updatePollingMessageCallback.calledOnce).to.true;
    expect(notificationHelper.updatePollingMessageCallback.getCalls()[0].args[0]).is.eql('Polling continues');
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql('resultatdata');
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
      // eslint-disable-next-line no-unused-expressions
      expect(notificationHelper.addPollingTimeoutEventHandler.calledOnce).to.true;
      expect(notificationHelper.addPollingTimeoutEventHandler.getCalls()[0].args[0]).is.eql({ location: 'http://polling.url' });
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

    expect(resResponse).to.eql({ payload: 'INTERNAL_CANCELLATION' });
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

    expect(result).is.eql({ payload: [] });
    // eslint-disable-next-line no-unused-expressions
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.null;
  });
});
