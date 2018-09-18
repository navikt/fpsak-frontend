import moment from 'moment';

import { isAsyncRestMethod } from 'data/rest/restMethods';
import createRequestThunk from './restThunk';

const getCopyDataActionTypes = actionTypes => ({
  copyDataStarted: (params, options = {}) => ({ type: actionTypes.copyDataStarted, payload: { params, timestamp: moment.now() }, meta: { options } }),
  copyDataFinished: data => ({ type: actionTypes.copyDataFinished, payload: data }),
});

const getDefaultActionCreators = actionTypes => ({
  ...getCopyDataActionTypes(actionTypes),
  reset: () => ({ type: actionTypes.reset }),
  requestStarted: (params, options = {}) => ({ type: actionTypes.requestStarted, payload: { params, timestamp: moment.now() }, meta: { options } }),
  requestFinished: data => ({ type: actionTypes.requestFinished, payload: data }),
  requestError: error => ({ type: actionTypes.requestError, payload: error }),
});

const getAsyncActionCreators = actionTypes => ({
  statusRequestStarted: data => ({ type: actionTypes.statusRequestStarted, payload: data }),
  statusRequestFinished: data => ({ type: actionTypes.statusRequestFinished, payload: data }),
  updatePollingMessage: data => ({ type: actionTypes.updatePollingMessage, payload: data }),
});

const createSetDataActionCreator = actionCreators => (data, params, options = {}) => (dispatch) => {
  dispatch(actionCreators.copyDataStarted(params, options));
  return dispatch(actionCreators.copyDataFinished(data));
};

const createRequestActionCreators = (restMethod, restEndpoint, actionTypes) => {
  const actionCreators = isAsyncRestMethod(restMethod)
    ? { ...getDefaultActionCreators(actionTypes), ...getAsyncActionCreators(actionTypes) }
    : getDefaultActionCreators(actionTypes);

  return {
    ...actionCreators,
    execRequest: createRequestThunk(restMethod, restEndpoint, actionCreators),
    execSetData: createSetDataActionCreator(actionCreators),
  };
};

export default createRequestActionCreators;
