/* @flow */
import type { RequestAdditionalConfig } from './RequestAdditionalConfigFlowType';

export type RequestConfig = {
  path?: string,
  name: string,
  restMethod?: (url: string, params: any, responseType?: string) => Promise<Response>,
  config: RequestAdditionalConfig,
}
