/* @flow */
export type ErrorFlowType = {
  +response?: {
    data: {
      type?: string,
    },
    +status?: string,
  },
  message?: string,
  +type?: string,
  +config?: {
    responseType: string,
  }
};
