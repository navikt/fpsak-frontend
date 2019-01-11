/* @flow */
class ReduxEvents {
  errorActionCreator: (data: any) => any

  timeoutActionCreator: () => void

  pollingMessageActionCreator: () => void

  withErrorActionCreator = (errorActionCreator: (data: any) => any) => {
    this.errorActionCreator = errorActionCreator;
    return this;
  }

  withPollingMessageActionCreator = (pollingMessageActionCreator: () => void) => {
    this.pollingMessageActionCreator = pollingMessageActionCreator;
    return this;
  }

  getErrorMessageActionCreator = () => this.errorActionCreator;

  getPollingMessageActionCreator = () => this.pollingMessageActionCreator;
}

export default ReduxEvents;
