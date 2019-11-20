import EventType from './eventType';

type EventCallback = (data?: any, type?: string) => Promise<string>

/**
 * NotificationMapper
 *
 * Denne klassen brukes for å koble interne rest-api hendelser til eksterne hendelser.
 * For eksempel kan en koble REQUEST_STARTED mot en Redux actionCreator.
 */
class NotificationMapper {
  eventTypes = {
    [EventType.POLLING_HALTED_OR_DELAYED]: [],
    [EventType.POLLING_TIMEOUT]: [],
    [EventType.REQUEST_ERROR]: [],
    [EventType.REQUEST_FINISHED]: [],
    [EventType.REQUEST_FORBIDDEN]: [],
    [EventType.REQUEST_STARTED]: [],
    [EventType.REQUEST_UNAUTHORIZED]: [],
    [EventType.STATUS_REQUEST_FINISHED]: [],
    [EventType.STATUS_REQUEST_STARTED]: [],
    [EventType.UPDATE_POLLING_MESSAGE]: [],
    [EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND]: [],
  };

  addEventHandler = (eventType: string, callback: EventCallback) => {
    this.eventTypes = {
      ...this.eventTypes,
      [eventType]: this.eventTypes[eventType].concat(callback),
    };
  }

  addRequestStartedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.REQUEST_STARTED, callback);

  addRequestFinishedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.REQUEST_FINISHED, callback);

  addRequestErrorEventHandler = (callback: EventCallback) => {
    this.addEventHandler(EventType.REQUEST_ERROR, callback);
    this.addEventHandler(EventType.REQUEST_FORBIDDEN, callback);
    this.addEventHandler(EventType.REQUEST_UNAUTHORIZED, callback);
    this.addEventHandler(EventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND, callback);
  };

  addStatusRequestStartedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.STATUS_REQUEST_STARTED, callback);

  addStatusRequestFinishedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.STATUS_REQUEST_FINISHED, callback);

  addUpdatePollingMessageEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.UPDATE_POLLING_MESSAGE, callback);

  addPollingTimeoutEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.POLLING_TIMEOUT, callback);

  addHaltedOrDelayedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.POLLING_HALTED_OR_DELAYED, callback);

  getNotificationEmitter = () => (eventType: keyof typeof EventType, data?: any, isAsync?: boolean) => {
    const eventHandlers = this.eventTypes[eventType];
    eventHandlers.forEach((handler) => handler(data, eventType, isAsync));
  }
}

export default NotificationMapper;
