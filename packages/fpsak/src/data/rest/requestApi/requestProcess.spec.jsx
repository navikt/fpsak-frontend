/* @flow */
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

  constructor() {
    const mapper = new NotificationMapper();
    mapper.addRequestStartedEventHandler(this.requestStartedCallback);
    mapper.addRequestFinishedEventHandler(this.requestFinishedCallback);
    mapper.addRequestErrorEventHandler(this.requestErrorCallback);
    mapper.addStatusRequestStartedEventHandler(this.statusRequestStartedCallback);
    mapper.addStatusRequestFinishedEventHandler(this.statusRequestFinishedCallback);
    mapper.addUpdatePollingMessageEventHandler(this.updatePollingMessageCallback);
    this.mapper = mapper;
  }
}

describe('RequestProcess', () => {
  const HTTP_ACCEPTED = 202;
  const defaultConfig = {
    maxPollingLimit: undefined,
    fetchLinkDataAutomatically: true,
    addLinkDataToArray: false,
  };

  it('skal hente data via get-kall', async () => {
    const httpClientMock = {
      get: () => ({ data: 'data' }),
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.get, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());
    const params = {
      behandlingId: 1,
    };

    const result = await process.run(params);

    expect(result).to.eql({ payload: 'data' });
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql('data');
    expect(notificationHelper.requestErrorCallback.called).to.false;
  });

  it('skal utføre links-kall automatisk og aggregere resultatet i et objekt', async () => {
    const params = {
      behandlingId: 1,
    };

    const allResponses = [{
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
      data: 'test1data',
    }, {
      data: 'test2data',
    }];

    const httpClientMock = {
      get: () => allResponses.shift(),
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
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql(resultObject.payload);
  });

  it('skal utføre links-kall automatisk og aggregere resultatet i et array når flagget addLinkDataToArray er satt til false', async () => {
    const params = {
      behandlingId: 1,
    };

    const allResponses = [{
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
      data: 'test1data',
    }, {
      data: 'test2data',
    }];

    const httpClientMock = {
      get: () => allResponses.shift(),
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
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
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
    const httpClientMock = {
      get: () => ({
        data: responseData,
      }),
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
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql(responseData);
  });

  it('skal utføre long-polling request der polling nr 2 gir resultatet', async () => {
    const allGetResults = [{
      data: {
        status: asyncPollingStatus.PENDING,
        message: 'Polling continues',
        pollIntervalMillis: 0,
      },
    }, {
      data: 'resultatdata',
    }];

    const httpClientMock = {
      getAsync: () => ({
        status: HTTP_ACCEPTED,
        headers: {
          location: 'http://polling.url',
        },
      }),
      get: () => allGetResults.shift(),
    };

    const params = {
      behandlingId: 1,
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', defaultConfig);
    const notificationHelper = new NotificationHelper();
    process.setNotificationEmitter(notificationHelper.mapper.getNotificationEmitter());

    const response = await process.run(params);

    expect(response).to.eql({ payload: 'resultatdata' });
    expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
    expect(notificationHelper.statusRequestStartedCallback.calledTwice).to.true;
    expect(notificationHelper.statusRequestFinishedCallback.calledTwice).to.true;
    expect(notificationHelper.updatePollingMessageCallback.calledOnce).to.true;
    expect(notificationHelper.updatePollingMessageCallback.getCalls()[0].args[0]).is.eql('Polling continues');
    expect(notificationHelper.requestFinishedCallback.calledOnce).to.true;
    expect(notificationHelper.requestFinishedCallback.getCalls()[0].args[0]).is.eql('resultatdata');
  });

  it('skal utføre long-polling request som når maks polling-forsøk', async () => {
    const allGetResults = [{
      data: {
        status: asyncPollingStatus.PENDING,
        message: 'Polling continues',
        pollIntervalMillis: 0,
      },
    }, {
      data: {
        status: asyncPollingStatus.PENDING,
        message: 'Polling continues',
        pollIntervalMillis: 0,
      },
    }];

    const httpClientMock = {
      getAsync: () => ({
        status: HTTP_ACCEPTED,
        headers: {
          location: 'http://polling.url',
        },
      }),
      get: () => allGetResults.shift(),
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
      expect(error.message).to.eql('Maximum polling attempts exceeded. URL: http://polling.url. Message: Polling continues');
      expect(notificationHelper.requestStartedCallback.calledOnce).to.true;
      expect(notificationHelper.statusRequestStartedCallback.calledOnce).to.true;
      expect(notificationHelper.statusRequestFinishedCallback.calledOnce).to.true;
      expect(notificationHelper.updatePollingMessageCallback.calledOnce).to.true;
      expect(notificationHelper.updatePollingMessageCallback.getCalls()[0].args[0]).is.eql('Polling continues');
      expect(notificationHelper.requestErrorCallback.calledOnce).to.true;
      expect(notificationHelper.requestErrorCallback.getCalls()[0].args[0])
        .is.eql('Maximum polling attempts exceeded. URL: http://polling.url. Message: Polling continues');
    }
  });

  it('skal utføre long-polling request som en så avbryter manuelt', async () => {
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

    const params = {
      behandlingId: 1,
    };

    const process = new RequestProcess(httpClientMock, httpClientMock.getAsync, 'behandling', defaultConfig);
    const mapper = new NotificationMapper();
    // Etter en runde med polling vil en stoppe prosessen via event
    mapper.addUpdatePollingMessageEventHandler(() => process.cancel());
    process.setNotificationEmitter(mapper.getNotificationEmitter());

    const response = await process.run(params);

    expect(response).to.eql('CANCELLED');
  });
});
