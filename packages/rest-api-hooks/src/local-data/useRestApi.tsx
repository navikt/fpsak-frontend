import {
  useState, useEffect, DependencyList, useContext,
} from 'react';

import { REQUEST_POLLING_CANCELLED, NotificationMapper } from '@fpsak-frontend/rest-api-new';

import { RestApiRequestContext } from '../RestApiContext';
import useRestApiErrorDispatcher from '../error/useRestApiErrorDispatcher';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

/**
  * Hook som utfører et restkall ved mount. En kan i tillegg legge ved en dependencies-liste som kan trigge ny henting når data
  * blir oppdatert. Hook returnerer rest-kallets status/resultat/feil
  */
function useRestApi<T>(key: string, params: any = {}, keepData = false, dependencies: DependencyList = []):RestApiData<T> {
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

  const requestApi = useContext(RestApiRequestContext);

  useEffect(() => {
    if (requestApi.hasPath(key)) {
      setData((oldState) => ({
        state: RestApiState.LOADING,
        error: undefined,
        data: keepData ? oldState.data : undefined,
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
    } else {
      setData({
        state: RestApiState.NOT_STARTED,
        error: undefined,
        data: undefined,
      });
    }
  }, dependencies);

  return data;
}

export default useRestApi;
