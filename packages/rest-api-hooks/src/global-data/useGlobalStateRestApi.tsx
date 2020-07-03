import { useState, useEffect, useContext } from 'react';

import { NotificationMapper, RequestApi } from '@fpsak-frontend/rest-api-new';

import useRestApiErrorDispatcher from '../error/useRestApiErrorDispatcher';
import { RestApiDispatchContext } from '../RestApiContext';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

/**
 * Hook som henter data fra backend (ved mount) og deretter lagrer i @see RestApiContext
 */
const getUseGlobalStateRestApi = (requestApi: RequestApi) => function useGlobalStateRestApi<T>(key: string, params: any = {}):RestApiData<T> {
  const [data, setData] = useState({
    state: RestApiState.LOADING,
    error: undefined,
    data: undefined,
  });

  const { addErrorMessage } = useRestApiErrorDispatcher();
  const notif = new NotificationMapper();
  notif.addRequestErrorEventHandlers((errorData, type) => {
    addErrorMessage({ ...errorData, type });
  });

  const dispatch = useContext(RestApiDispatchContext);

  useEffect(() => {
    dispatch({ type: 'remove', key });

    requestApi.startRequest(key, params, notif)
      .then((dataRes) => {
        dispatch({ type: 'success', key, data: dataRes.payload });
        setData({
          state: RestApiState.SUCCESS,
          data: dataRes.payload,
          error: undefined,
        });
      })
      .catch((error) => {
        setData({
          state: RestApiState.ERROR,
          data: undefined,
          error,
        });
      });
  }, []);

  return data;
};

export default getUseGlobalStateRestApi;
