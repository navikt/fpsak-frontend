// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type ErrorType = Readonly<{
  response?: {
    data?: any;
    statusText?: string;
    status?: number;
    config?: any;
  };
  message?: string;
  type?: string;
  config?: {
    responseType: string;
  };
}>
