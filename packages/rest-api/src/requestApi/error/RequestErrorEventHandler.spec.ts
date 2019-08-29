import { expect } from 'chai';
import sinon from 'sinon';

import TimeoutError from './TimeoutError';
import { ErrorTypes } from './ErrorTypes';
import RequestErrorEventHandler from './RequestErrorEventHandler';
import NotificationMapper from '../NotificationMapper';

describe('RequestErrorEventHandler', () => {
  const isPollingRequest = false;

  it('skal håndtere timeout-error', async () => {
    const eventHandler = sinon.spy();
    const notificationMapper = new NotificationMapper();
    notificationMapper.addPollingTimeoutEventHandler(eventHandler);
    const errorEventHandler = new RequestErrorEventHandler(notificationMapper.getNotificationEmitter(), isPollingRequest);

    errorEventHandler.handleError(new TimeoutError('test-location'));

    // eslint-disable-next-line no-unused-expressions
    expect(eventHandler.calledOnce).to.true;
    expect(eventHandler.getCalls()[0].args[0]).is.eql({ location: 'test-location' });
  });

  it('skal håndtere POLLING-error', async () => {
    const eventHandler = sinon.spy();
    const notificationMapper = new NotificationMapper();
    notificationMapper.addHaltedOrDelayedEventHandler(eventHandler);
    const errorEventHandler = new RequestErrorEventHandler(notificationMapper.getNotificationEmitter(), isPollingRequest);

    const error = {
      response: {
        status: 418,
        data: {
          message: 'test',
          status: 'HALTED',
          eta: '2019-01-01',
        },
      },
    };
    errorEventHandler.handleError(error);

    // eslint-disable-next-line no-unused-expressions
    expect(eventHandler.calledOnce).to.true;
    expect(eventHandler.getCalls()[0].args[0]).is.eql(error.response.data);
  });

  it('skal håndtere feilmelding uten response-objekt', async () => {
    const eventHandler = sinon.spy();
    const notificationMapper = new NotificationMapper();
    notificationMapper.addRequestErrorEventHandler(eventHandler);
    const errorEventHandler = new RequestErrorEventHandler(notificationMapper.getNotificationEmitter(), isPollingRequest);

    const error = {
      message: 'Dette er en feil',
    };
    errorEventHandler.handleError(error);

    // eslint-disable-next-line no-unused-expressions
    expect(eventHandler.calledOnce).to.true;
    expect(eventHandler.getCalls()[0].args[0]).is.eql(error);
  });

  it('skal håndtere feil som er markert som uhåndtert', async () => {
    const eventHandler = sinon.spy();
    const notificationMapper = new NotificationMapper();
    notificationMapper.addRequestErrorEventHandler(eventHandler);
    const errorEventHandler = new RequestErrorEventHandler(notificationMapper.getNotificationEmitter(), isPollingRequest);

    const error = {
      response: {
        data: {
          type: ErrorTypes.TOMT_RESULTAT_FEIL,
        },
        status: 400,
      },
    };
    errorEventHandler.handleError(error);

    // eslint-disable-next-line no-unused-expressions
    expect(eventHandler.calledOnce).to.true;
    expect(eventHandler.getCalls()[0].args[0]).is.eql(error.response.data);
  });

  it('skal håndtere feil som ikke har responsedata men statusText', async () => {
    const eventHandler = sinon.spy();
    const notificationMapper = new NotificationMapper();
    notificationMapper.addRequestErrorEventHandler(eventHandler);
    const errorEventHandler = new RequestErrorEventHandler(notificationMapper.getNotificationEmitter(), isPollingRequest);

    const error = {
      response: {
        statusText: 'Dette er en feil',
        status: 400,
      },
    };
    errorEventHandler.handleError(error);

    // eslint-disable-next-line no-unused-expressions
    expect(eventHandler.calledOnce).to.true;
    expect(eventHandler.getCalls()[0].args[0]).is.eql({ message: error.response.statusText });
  });

  it('skal ikke utføre event for MANGLER_TILGANG_FEIL fordi denne er markert som håndtert', async () => {
    const eventHandler = sinon.spy();
    const notificationMapper = new NotificationMapper();
    notificationMapper.addRequestErrorEventHandler(eventHandler);
    const errorEventHandler = new RequestErrorEventHandler(notificationMapper.getNotificationEmitter(), isPollingRequest);

    const error = {
      response: {
        data: {
          type: ErrorTypes.MANGLER_TILGANG_FEIL,
        },
      },
    };
    errorEventHandler.handleError(error);

    // eslint-disable-next-line no-unused-expressions
    expect(eventHandler.calledOnce).to.false;
  });
});
