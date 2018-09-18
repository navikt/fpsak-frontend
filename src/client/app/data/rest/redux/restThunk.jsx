import { get, getRestMethod } from 'data/rest/restMethods';
import asyncPollingStatus from './asyncPollingStatus';

const HTTP_ACCEPTED = 202;
const MAX_POLLING_ATTEMPTS = 150;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const getMaxPollingAttemptsMessage = (location, pollingMessage) => `Maximum polling attempts exceeded. URL: ${location}. Message: ${pollingMessage}`;

// TODO (TOR) Bryt opp og refaktorer!!

const getExceptionHandler = (dispatch, requestError) => (error) => {
  if (!error.response) { // Håndter feil som er kastet manuelt
    dispatch(requestError(error.message));
    return error;
  }

  const data = error.response.data ? error.response.data : error;
  dispatch(requestError(data));
  return Promise.reject(error);
};

const execPolling = (dispatch, actionCreators, location, pollingInterval, pollingCounter) => wait(pollingInterval)
  .then(() => {
    dispatch(actionCreators.statusRequestStarted());
    return get(location)
      .then((statusOrResultResponse) => {
        dispatch(actionCreators.statusRequestFinished());
        const responseData = statusOrResultResponse.data;
        if (responseData && responseData.status === asyncPollingStatus.PENDING) {
          if (pollingCounter === MAX_POLLING_ATTEMPTS) {
            dispatch(actionCreators.requestError(getMaxPollingAttemptsMessage(location, responseData.message)));
            return get(statusOrResultResponse.data.location);
          }
          dispatch(actionCreators.updatePollingMessage(responseData.message));
          const { pollIntervalMillis } = responseData;
          return execPolling(dispatch, actionCreators, location, pollIntervalMillis, pollingCounter + 1);
        }
        return Promise.resolve(statusOrResultResponse);
      });
  });

const execLinkRequestsIfPresent = (dispatch, actionCreators, response) => {
  const responseData = response.data;
  const responsePromise = Promise.resolve(responseData);
  if (responseData && responseData.links && responseData.links.length > 0) {
    const requestList = responseData.links
      .map(link => () => execRequest(// eslint-disable-line no-use-before-define
        dispatch, actionCreators, link.href, getRestMethod(link.type), link.requestPayload,
      )
        .then(data => Promise.resolve({ [link.rel]: data[0] })));
    return Promise.all([responsePromise, ...requestList.map(request => request())]);
  }

  return Promise.all([responsePromise]);
};

const execRequest = (dispatch, actionCreators, restEndpoint, restMethod, params) => restMethod(restEndpoint, params)
  .then(response => (response.status === HTTP_ACCEPTED
    ? execPolling(dispatch, actionCreators, response.headers.location, 0, 0)
    : response))
  .catch((error) => {
    const responseData = error.response ? error.response.data : undefined;
    if (responseData && (responseData.status === asyncPollingStatus.DELAYED || responseData.status === asyncPollingStatus.HALTED)) {
      return get(responseData.location);
    }
    return Promise.reject(error);
  })
  .then(response => execLinkRequestsIfPresent(dispatch, actionCreators, response));

const createRequestThunk = (restMethod, restEndpoint, actionCreators) => (params, options = {}) => (dispatch) => {
  dispatch(actionCreators.requestStarted(params, options));
  return execRequest(dispatch, actionCreators, restEndpoint, restMethod, params)
    .catch(getExceptionHandler(dispatch, actionCreators.requestError))
    .then(responseDataList => (responseDataList.length > 1
      ? dispatch(actionCreators.requestFinished(responseDataList.reduce((acc, data) => ({ ...acc, ...data }), {})))
      : dispatch(actionCreators.requestFinished(responseDataList[0]))));
};

export default createRequestThunk;
