import type { RequestAdditionalConfig } from './RequestAdditionalConfigFlowType';

export type RequestConfig = {
  path?: string,
  name: string,
  restMethod?: () => void,
  config?: RequestAdditionalConfig,
}
