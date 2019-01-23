/* @flow */
export type ErrorFlowType = {
  +response?: {
    data?: {
      type?: string,
    },
    statusText?: string,
    +status?: number,
  },
  message?: string,
  +type?: string,
  +config?: {
    responseType: string,
  }
};
