/* @flow */
import moment from 'moment';
import type { Dispatch } from 'redux';
import { RequestRunner, NotificationMapper } from '@fpsak-frontend/rest-api';

import type { ActionTypes } from './ActionTypesFlowType';

type Options = {
  keepData?: boolean,
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
});

const createSetDataActionCreator = actionCreators => (data: any, params: any, options: Options = {}) => (dispatch: Dispatch<any>) => {
  dispatch(actionCreators.copyDataStarted(params, options));
  return dispatch(actionCreators.copyDataFinished(data));
};

const createRequestThunk = (requestRunner, actionCreators) => (params: any, options: Options = {}) => (dispatch: Dispatch<any>) => {
  const notificationMapper = new NotificationMapper();

  notificationMapper.addRequestStartedEventHandler(() => dispatch(actionCreators.requestStarted(params, options)));
  notificationMapper.addRequestFinishedEventHandler(data => dispatch(actionCreators.requestFinished(data)));
  notificationMapper.addRequestErrorEventHandler(data => dispatch(actionCreators.requestError(data)));
  if (actionCreators.statusRequestStarted) {
    notificationMapper.addStatusRequestStartedEventHandler(() => dispatch(actionCreators.statusRequestStarted()));
    notificationMapper.addStatusRequestFinishedEventHandler(() => dispatch(actionCreators.statusRequestFinished()));
    notificationMapper.addUpdatePollingMessageEventHandler(data => dispatch(actionCreators.updatePollingMessage(data)));
  }

  return requestRunner.startProcess(params, notificationMapper);
};

const createRequestActionCreators = (requestRunner: RequestRunner, actionTypes: ActionTypes) => {
  const actionCreators = requestRunner.isAsyncRestMethod()
    ? { ...getDefaultActionCreators(actionTypes), ...getAsyncActionCreators(actionTypes) }
    : getDefaultActionCreators(actionTypes);

  return {
    ...actionCreators,
    execRequest: createRequestThunk(requestRunner, actionCreators),
    execSetData: createSetDataActionCreator(actionCreators),
  };
};

export default createRequestActionCreators;
