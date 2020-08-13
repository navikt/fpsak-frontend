import { useContext } from 'react';

import { RequestApi, AbstractRequestApi } from '@fpsak-frontend/rest-api-new';

import { RestApiStateContext } from '../RestApiContext';

/**
 * Hook som bruker respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
const getUseGlobalStateRestApiData = (requestApi: AbstractRequestApi) => {
  if (requestApi instanceof RequestApi) {
    return function useGlobalStateRestApiData<T>(key: string): T {
      const state = useContext(RestApiStateContext);
      return state[key];
    };
  }
  // For mocking testdata
  return function useGlobalStateRestApiData<T>(key: string): T {
    return requestApi.startRequest(key, {});
  };
};

export default getUseGlobalStateRestApiData;
