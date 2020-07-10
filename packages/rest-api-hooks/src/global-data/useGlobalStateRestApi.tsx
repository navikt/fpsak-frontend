import {
  useState, useEffect, useContext, DependencyList,
} from 'react';

import { NotificationMapper, RequestApi } from '@fpsak-frontend/rest-api-new';

import useRestApiErrorDispatcher from '../error/useRestApiErrorDispatcher';
import { RestApiDispatchContext } from '../RestApiContext';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

interface Options {
  updateTriggers?: DependencyList;
  suspendRequest?: boolean;
}

const defaultOptions = {
  updateTriggers: [],
  suspendRequest: false,
};

/**
 * Hook som henter data fra backend (ved mount) og deretter lagrer i @see RestApiContext
 */
const getUseGlobalStateRestApi = (requestApi: RequestApi) => function useGlobalStateRestApi<T>(
  key: string, params: any = {}, options: Options = defaultOptions,
):RestApiData<T> {
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

  const dispatch = useContext(RestApiDispatchContext);

  useEffect(() => {
    if (requestApi.hasPath(key) && !options.suspendRequest) {
      dispatch({ type: 'remove', key });

      setData({
        state: RestApiState.LOADING,
        error: undefined,
        data: undefined,
      });

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
    }
  }, options.updateTriggers);

  return data;
};

export default getUseGlobalStateRestApi;
