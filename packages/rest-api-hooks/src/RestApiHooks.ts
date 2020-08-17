import { AbstractRequestApi } from '@fpsak-frontend/rest-api-new';

import getUseRestApi, { getUseRestApiMock } from './local-data/useRestApi';
import getUseRestApiRunner, { getUseRestApiRunnerMock } from './local-data/useRestApiRunner';
import getUseGlobalStateRestApi, { getUseGlobalStateRestApiMock } from './global-data/useGlobalStateRestApi';
import useGlobalStateRestApiData, { useGlobalStateRestApiDataMock } from './global-data/useGlobalStateRestApiData';

const initHooks = (requestApi: AbstractRequestApi) => {
  if (requestApi.isMock()) {
    return {
      useRestApi: getUseRestApiMock(requestApi),
      useRestApiRunner: getUseRestApiRunnerMock(requestApi),
      useGlobalStateRestApi: getUseGlobalStateRestApiMock(requestApi),
      useGlobalStateRestApiData: useGlobalStateRestApiDataMock(requestApi),
    };
  }

  return {
    useRestApi: getUseRestApi(requestApi),
    useRestApiRunner: getUseRestApiRunner(requestApi),
    useGlobalStateRestApi: getUseGlobalStateRestApi(requestApi),
    useGlobalStateRestApiData,
  };
};

export default { initHooks };
