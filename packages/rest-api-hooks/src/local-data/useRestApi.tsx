import {
  useState, useEffect, DependencyList,
} from 'react';

import { REQUEST_POLLING_CANCELLED, NotificationMapper, AbstractRequestApi } from '@fpsak-frontend/rest-api-new';

import RequestApiMock from '@fpsak-frontend/rest-api-new/src/requestApi/RequestApiMock';
import useRestApiErrorDispatcher from '../error/useRestApiErrorDispatcher';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

interface Options {
  updateTriggers?: DependencyList;
  keepData?: boolean;
  suspendRequest?: boolean;
}

const defaultOptions = {
  updateTriggers: [],
  keepData: false,
  suspendRequest: false,
};

/**
  * Hook som utfører et restkall ved mount. En kan i tillegg legge ved en dependencies-liste som kan trigge ny henting når data
  * blir oppdatert. Hook returnerer rest-kallets status/resultat/feil
  */
const getUseRestApi = (requestApi: AbstractRequestApi) => function useRestApi<T>(
  key: string, params: any = {}, options: Options = defaultOptions,
):RestApiData<T> {
  if (requestApi instanceof RequestApiMock) {
    return {
      state: RestApiState.SUCCESS,
      error: undefined,
      data: requestApi.startRequest(key),
    };
  }

  const [data, setData] = useState({
    state: RestApiState.NOT_STARTED,
    error: undefined,
    data: undefined,
  });

  const { addErrorMessage } = useRestApiErrorDispatcher();
  const notif = new NotificationMapper();
  notif.addRequestErrorEventHandlers((errorData, type) => {
    addErrorMessage({ ...errorData, type });
  });

  useEffect(() => {
    if (requestApi.hasPath(key) && !options.suspendRequest) {
      setData((oldState) => ({
        state: RestApiState.LOADING,
        error: undefined,
        data: options.keepData ? oldState.data : undefined,
      }));

      requestApi.startRequest(key, params, notif)
        .then((dataRes) => {
          if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
            setData({
              state: RestApiState.SUCCESS,
              data: dataRes.payload,
              error: undefined,
            });
          }
        })
        .catch((error) => {
          setData({
            state: RestApiState.ERROR,
            data: undefined,
            error,
          });
        });
    } else if (!requestApi.hasPath(key)) {
      setData({
        state: RestApiState.NOT_STARTED,
        error: undefined,
        data: undefined,
      });
    }
  }, [...options.updateTriggers]);

  return data;
};

export default getUseRestApi;
