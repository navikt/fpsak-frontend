import moment from 'moment';
import { Dispatch } from 'redux';

import { RequestRunner, NotificationMapper } from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import { ActionTypes } from './ActionTypesTsType';

interface Options {
  keepData?: boolean;
}

const getCopyDataActionTypes = actionTypes => ({
  copyDataStarted: (params: any, options: Options = {}) => ({
    type: actionTypes.copyDataStarted,
    payload: { params, timestamp: moment().valueOf() },
    meta: { options },
  }),
  copyDataFinished: (data: any) => ({ type: actionTypes.copyDataFinished, payload: data }),
});

const getDefaultActionCreators = actionTypes => ({
  ...getCopyDataActionTypes(actionTypes),
  reset: () => ({ type: actionTypes.reset }),
  requestStarted: (params: any, options: Options = {}) => ({
    type: actionTypes.requestStarted,
    payload: { params, timestamp: moment().valueOf() },
    meta: { options },
  }),
  requestFinished: (data: any) => ({ type: actionTypes.requestFinished, payload: data }),
  requestError: (error: any) => ({ type: actionTypes.requestError, payload: error }),
});

const getAsyncActionCreators = actionTypes => ({
  statusRequestStarted: (data: any) => ({ type: actionTypes.statusRequestStarted, payload: data }),
  statusRequestFinished: (data: any) => ({ type: actionTypes.statusRequestFinished, payload: data }),
  updatePollingMessage: (data: any) => ({ type: actionTypes.updatePollingMessage, payload: data }),
  pollingTimeout: () => ({ type: actionTypes.pollingTimeout }),
});

const createSetDataActionCreator = actionCreators => (data: any, params: any, options: Options = {}) => (dispatch: Dispatch) => {
  dispatch(actionCreators.copyDataStarted(params, options));
  return dispatch(actionCreators.copyDataFinished(data));
};

const createRequestThunk = (requestRunner, actionCreators, reduxEvents) => (params: any, options: Options = {}) => (dispatch: Dispatch) => {
  const notificationMapper = new NotificationMapper();
  // TODO (TOR) Refaktorer dette
  notificationMapper.addRequestStartedEventHandler(() => dispatch(actionCreators.requestStarted(params, options)));
  notificationMapper.addRequestFinishedEventHandler(data => dispatch(actionCreators.requestFinished(data)));
  notificationMapper.addRequestErrorEventHandler(data => dispatch(actionCreators.requestError(data)));
  notificationMapper.addHaltedOrDelayedEventHandler(data => dispatch(actionCreators.requestError(data)));
  if (reduxEvents.getErrorMessageActionCreator()) {
    notificationMapper.addRequestErrorEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
    notificationMapper.addHaltedOrDelayedEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
  }
  if (actionCreators.statusRequestStarted) {
    notificationMapper.addStatusRequestStartedEventHandler(() => dispatch(actionCreators.statusRequestStarted()));
    notificationMapper.addStatusRequestFinishedEventHandler(() => dispatch(actionCreators.statusRequestFinished()));
    notificationMapper.addUpdatePollingMessageEventHandler(data => dispatch(actionCreators.updatePollingMessage(data)));
    notificationMapper.addPollingTimeoutEventHandler(() => dispatch(actionCreators.pollingTimeout()));
    if (reduxEvents.getPollingMessageActionCreator()) {
      notificationMapper.addUpdatePollingMessageEventHandler(data => dispatch(reduxEvents.getPollingMessageActionCreator()(data)));
      notificationMapper.addRequestFinishedEventHandler(() => dispatch(reduxEvents.getPollingMessageActionCreator()()));
      notificationMapper.addRequestErrorEventHandler(() => dispatch(reduxEvents.getPollingMessageActionCreator()()));
    }
    if (reduxEvents.getErrorMessageActionCreator()) {
      notificationMapper.addPollingTimeoutEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
    }
  }

  return requestRunner.startProcess(params, notificationMapper);
};

const createRequestActionCreators = (requestRunner: RequestRunner, actionTypes: ActionTypes, reduxEvents: ReduxEvents) => {
  const actionCreators = requestRunner.isAsyncRestMethod()
    ? { ...getDefaultActionCreators(actionTypes), ...getAsyncActionCreators(actionTypes) }
    : getDefaultActionCreators(actionTypes);

  return {
    ...actionCreators,
    execRequest: createRequestThunk(requestRunner, actionCreators, reduxEvents),
    execSetData: createSetDataActionCreator(actionCreators),
  };
};

export default createRequestActionCreators;
