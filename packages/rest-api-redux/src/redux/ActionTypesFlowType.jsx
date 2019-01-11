/* @flow */
export type ActionTypes = {
  requestStarted: string,
  copyDataStarted: string,
  requestFinished: string,
  copyDataFinished: string,
  requestError: string,
  reset: string,
  statusRequestStarted?: string,
  statusRequestFinished?: string,
  updatePollingMessage?: string,
  pollingTimeout?: string,
}
