class ReduxEvents {
  errorActionCreator: (data: any) => any

  timeoutActionCreator: () => void

  pollingMessageActionCreator: (data: any) => void

  withErrorActionCreator = (errorActionCreator: (data: any) => any) => {
    this.errorActionCreator = errorActionCreator;
    return this;
  }

  withPollingMessageActionCreator = (pollingMessageActionCreator: (data: any) => void) => {
    this.pollingMessageActionCreator = pollingMessageActionCreator;
    return this;
  }

  getErrorMessageActionCreator = (): (data: any) => void => this.errorActionCreator;

  getPollingMessageActionCreator = (): (data: any) => void => this.pollingMessageActionCreator;
}

export default ReduxEvents;
