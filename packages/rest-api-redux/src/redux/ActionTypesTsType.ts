// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export interface ActionTypes {
  requestStarted: () => string;
  requestFinished: () => string;
  requestError: () => string;
  reset: () => string;
  statusRequestStarted: () => string;
  statusRequestFinished?: () => string;
  updatePollingMessage: () => string;
  pollingTimeout: () => string;
}
