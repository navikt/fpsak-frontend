import { useState, useCallback } from 'react';

import {
  REQUEST_POLLING_CANCELLED, NotificationMapper, ErrorType, AbstractRequestApi,
} from '@fpsak-frontend/rest-api-new';
import useRestApiErrorDispatcher from '../error/useRestApiErrorDispatcher';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  startRequest: (params?: any, keepData?: boolean) => Promise<T>;
  resetRequestData: () => void;
  state: RestApiState;
  error?: ErrorType;
  data?: T;
  cancelRequest: () => void;
}

/**
 * For mocking i unit-test
 */
export const getUseRestApiRunnerMock = (requestApi: AbstractRequestApi) => function useRestApiRunner<T>(key: string):RestApiData<T> {
  const [data, setData] = useState({
    state: RestApiState.NOT_STARTED,
    data: undefined,
    error: undefined,
  });

  const startRequest = ():Promise<T> => {
    setData({
      state: RestApiState.SUCCESS,
      data: requestApi.startRequest(key, {}),
      error: undefined,
    });
    return Promise.resolve(data);
  };

  return {
    startRequest,
    resetRequestData: () => undefined,
    cancelRequest: () => undefined,
    ...data,
  };
};

/**
 * Hook som gir deg ein funksjon til å starte restkall, i tillegg til kallets status/resultat/feil
 */
const getUseRestApiRunner = (requestApi: AbstractRequestApi) => function useRestApiRunner<T>(key: string):RestApiData<T> {
  const [data, setData] = useState({
    state: RestApiState.NOT_STARTED,
    data: undefined,
    error: undefined,
  });

  const { addErrorMessage } = useRestApiErrorDispatcher();
  const notif = new NotificationMapper();
  notif.addRequestErrorEventHandlers((errorData, type) => {
    addErrorMessage({ ...errorData, type });
  });

  const startRequest = useCallback((params: any = {}, keepData = false):Promise<T> => {
    if (requestApi.hasPath(key)) {
      setData((oldState) => ({
        state: RestApiState.LOADING,
        data: keepData ? oldState.data : undefined,
        error: undefined,
      }));

      return requestApi.startRequest(key, params, notif)
        .then((dataRes) => {
          if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
            setData({
              state: RestApiState.SUCCESS,
              data: dataRes.payload,
              error: undefined,
            });
          }
          return Promise.resolve(dataRes.payload);
        })
        .catch((error) => {
          setData({
            state: RestApiState.ERROR,
            data: undefined,
            error,
          });
          throw error;
        });
    }
    setData({
      state: RestApiState.NOT_STARTED,
      error: undefined,
      data: undefined,
    });
    return undefined;
  }, []);

  const resetRequestData = useCallback(() => {
    setData({
      state: RestApiState.NOT_STARTED,
      data: undefined,
      error: undefined,
    });
  }, []);

  return {
    startRequest,
    resetRequestData,
    cancelRequest: () => requestApi.cancelRequest(key),
    ...data,
  };
};

export default getUseRestApiRunner;
