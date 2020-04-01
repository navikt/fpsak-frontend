import React, {
  FunctionComponent, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useStore } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { isObjectEmpty } from '@fpsak-frontend/utils';

const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

interface OwnProps {
  behandlingId?: number;
  behandlingVersion?: number;
  behandlingNotRequired?: boolean;
  render: (data: {}, isFinished: boolean) => any;
  endpoints: EndpointOperations[];
  endpointParams?: {};
  showOldDataWhenRefetching?: boolean;
  showComponent?: boolean;
  valueThatWillTriggerRefetchWhenChanged?: number;
}

const DataFetcher: FunctionComponent<OwnProps> = ({
  render,
  endpoints,
  endpointParams,
  showOldDataWhenRefetching = false,
  showComponent = true,
  behandlingVersion,
  behandlingId,
  behandlingNotRequired,
  valueThatWillTriggerRefetchWhenChanged = 0,
}) => {
  if (!showComponent) {
    return null;
  }

  const [fetchingData, setFetchingData] = useState({
    hasFinishedFetching: false,
    data: {},
  });

  const store = useStore();

  const endpointData = endpoints.reduce((acc, e) => ({
    ...acc,
    [e.name]: {
      formattedName: format(e.name),
      data: e.getRestApiData()(store.getState()),
      isFinished: e.getRestApiFinished()(store.getState()),
    },
  }), {});

  const activeEndpointsData = endpoints.filter((e) => e.isEndpointEnabled()).map((e) => ({
    endpoint: e,
    ...endpointData[e.name],
  }));

  const dispatch = useDispatch();
  const ref = useRef<{ behandlingId: number; behandlingVersion: number; valueThatWillTriggerRefetchWhenChanged: number }>();
  useEffect(() => {
    setFetchingData((oldState) => ({
      hasFinishedFetching: false,
      data: oldState.data,
    }));

    const state = store.getState();

    const endpointsToFetchFrom = activeEndpointsData.filter((e) => {
      const cacheParams = e.endpoint.getRestApiCacheParams()(state);
      if (ref.current.valueThatWillTriggerRefetchWhenChanged !== valueThatWillTriggerRefetchWhenChanged) {
        return true;
      }
      if (behandlingNotRequired && cacheParams && !cacheParams.behandlingId && !cacheParams.behandlingVersion) {
        return false;
      }
      return !cacheParams
        || cacheParams.behandlingId !== behandlingId
        || cacheParams.behandlingVersion !== behandlingVersion;
    });

    ref.current = { behandlingId, behandlingVersion, valueThatWillTriggerRefetchWhenChanged };

    const meta = {
      keepData: showOldDataWhenRefetching,
      cacheParams: { behandlingId, behandlingVersion },
    };

    Promise.all(endpointsToFetchFrom.map((e) => {
      const params = endpointParams ? endpointParams[e.endpoint.name] : undefined;
      return dispatch(e.endpoint.makeRestApiRequest()(params, meta));
    })).then((data) => {
      setFetchingData({
        hasFinishedFetching: true,
        data: endpointsToFetchFrom.reduce((acc, endpoint, index) => ({
          ...acc,
          [endpoint.formattedName]: data[index].payload,
        }), {}),
      });
    });
  }, [behandlingId, behandlingVersion]);

  const hasChanged = ref.current && (ref.current.behandlingId !== behandlingId || ref.current.behandlingVersion !== behandlingVersion);
  const hasFinishedFetching = fetchingData.hasFinishedFetching && activeEndpointsData.every((e) => e.isFinished);

  if (hasFinishedFetching && !hasChanged) {
    return render(activeEndpointsData.reduce((acc, endpoint) => ({
      ...acc,
      [endpoint.formattedName]: endpoint.data,
    }), fetchingData.data), true);
  }


  if ((!hasFinishedFetching || hasChanged) && showOldDataWhenRefetching && !isObjectEmpty(fetchingData.data)) {
    return render(fetchingData.data, false);
  }

  return <LoadingPanel />;
};

export default DataFetcher;
