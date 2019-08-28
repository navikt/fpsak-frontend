import moment from 'moment';
import { Dispatch } from 'redux';

import { RequestRunner, NotificationMapper } from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import { ActionTypes } from './ActionTypesTsType';

interface Options {
  keepData?: boolean;
}

const getActionCreators = (actionTypes) => ({
  copyDataStarted: (params: any, options: Options = {}) => ({
    type: actionTypes.copyDataStarted(),
    payload: { params, timestamp: moment().valueOf() },
    meta: { options },
  }),
  copyDataFinished: (data: any) => ({ type: actionTypes.copyDataFinished(), payload: data }),
  reset: () => ({ type: actionTypes.reset() }),
  requestStarted: (params: any, options: Options = {}) => ({
    type: actionTypes.requestStarted(),
    payload: { params, timestamp: moment().valueOf() },
    meta: { options },
  }),
  requestFinished: (data: any) => ({ type: actionTypes.requestFinished(), payload: data }),
  requestError: (error: any) => ({ type: actionTypes.requestError(), payload: error }),
  statusRequestStarted: (data: any) => ({ type: actionTypes.statusRequestStarted(), payload: data }),
  statusRequestFinished: (data: any) => ({ type: actionTypes.statusRequestFinished(), payload: data }),
  updatePollingMessage: (data: any) => ({ type: actionTypes.updatePollingMessage(), payload: data }),
  pollingTimeout: () => ({ type: actionTypes.pollingTimeout() }),
});

const createSetDataActionCreator = (actionCreators) => (data: any, params: any, options: Options = {}) => (dispatch: Dispatch) => {
  dispatch(actionCreators.copyDataStarted(params, options));
  return dispatch(actionCreators.copyDataFinished(data));
};

const createRequestThunk = (requestRunner, actionCreators, reduxEvents, resultKeyActionCreators) => (params: any,
  options: Options = {}) => (dispatch: Dispatch) => {
  const notificationMapper = new NotificationMapper();

  if (resultKeyActionCreators) {
    notificationMapper.addRequestStartedEventHandler(() => dispatch(resultKeyActionCreators.requestStarted(params, options)));
    notificationMapper.addRequestFinishedEventHandler((data) => dispatch(resultKeyActionCreators.requestFinished(data)));
    notificationMapper.addRequestErrorEventHandler((data) => dispatch(resultKeyActionCreators.requestError(data)));
  }

  notificationMapper.addRequestStartedEventHandler(() => dispatch(actionCreators.requestStarted(params, options)));
  notificationMapper.addRequestFinishedEventHandler((data) => dispatch(actionCreators.requestFinished(data)));
  notificationMapper.addRequestErrorEventHandler((data) => dispatch(actionCreators.requestError(data)));
  notificationMapper.addHaltedOrDelayedEventHandler((data) => dispatch(actionCreators.requestError(data)));

  notificationMapper.addStatusRequestStartedEventHandler(() => dispatch(actionCreators.statusRequestStarted()));
  notificationMapper.addStatusRequestFinishedEventHandler(() => dispatch(actionCreators.statusRequestFinished()));
  notificationMapper.addUpdatePollingMessageEventHandler((data) => dispatch(actionCreators.updatePollingMessage(data)));
  notificationMapper.addPollingTimeoutEventHandler(() => dispatch(actionCreators.pollingTimeout()));

  if (reduxEvents.getErrorMessageActionCreator()) {
    notificationMapper.addRequestErrorEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
    notificationMapper.addHaltedOrDelayedEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
    notificationMapper.addPollingTimeoutEventHandler((data, type) => dispatch(reduxEvents.getErrorMessageActionCreator()({ ...data, type })));
  }

  if (reduxEvents.getPollingMessageActionCreator()) {
    notificationMapper.addUpdatePollingMessageEventHandler((data) => dispatch(reduxEvents.getPollingMessageActionCreator()(data)));
    notificationMapper.addRequestFinishedEventHandler((data, type, isAsync: boolean) => isAsync && dispatch(reduxEvents.getPollingMessageActionCreator()()));
    notificationMapper.addRequestErrorEventHandler((data, type, isAsync: boolean) => isAsync && dispatch(reduxEvents.getPollingMessageActionCreator()()));
  }

  return requestRunner.startProcess(params, notificationMapper);
};

const createRequestActionCreators = (requestRunner: RequestRunner, actionTypes: ActionTypes, reduxEvents: ReduxEvents, resultKeyActionCreators) => {
  const actionCreators = getActionCreators(actionTypes);

  return {
    ...actionCreators,
    execRequest: createRequestThunk(requestRunner, actionCreators, reduxEvents, resultKeyActionCreators),
    execSetData: createSetDataActionCreator(actionCreators),
  };
};

export default createRequestActionCreators;
