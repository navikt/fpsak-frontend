/* @flow */
import EventType from './eventType';

type EventCallback = (data?: any) => Promise<string>

/**
 * NotificationMapper
 *
 * Denne klassen brukes for å koble interne hendelser til eksterne hendelser.
 * For eksempel kan en koble REQUEST_STARTED mot en Redux actionCreator.
 */
class NotificationMapper {
  eventTypes = {
    [EventType.REQUEST_STARTED]: undefined,
    [EventType.REQUEST_FINISHED]: undefined,
    [EventType.REQUEST_ERROR]: undefined,
    [EventType.STATUS_REQUEST_STARTED]: undefined,
    [EventType.STATUS_REQUEST_FINISHED]: undefined,
    [EventType.UPDATE_POLLING_MESSAGE]: undefined,
  };

  addEventHandler = (eventType: string, callback: EventCallback) => {
    this.eventTypes = {
      ...this.eventTypes,
      [eventType]: callback,
    };
  }

  addRequestStartedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.REQUEST_STARTED, callback);

  addRequestFinishedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.REQUEST_FINISHED, callback);

  addRequestErrorEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.REQUEST_ERROR, callback);

  addStatusRequestStartedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.STATUS_REQUEST_STARTED, callback);

  addStatusRequestFinishedEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.STATUS_REQUEST_FINISHED, callback);

  addUpdatePollingMessageEventHandler = (callback: EventCallback) => this.addEventHandler(EventType.UPDATE_POLLING_MESSAGE, callback);

  getNotificationEmitter = () => (eventType: $Keys<typeof EventType>, data?: any) => {
    const event = this.eventTypes[eventType];
    if (event) {
      event(data);
    }
  }
}

export default NotificationMapper;
