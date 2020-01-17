import React, {
  FunctionComponent, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

const findPreviousData = (activeEndpointsData) => {
  if (activeEndpointsData.some((e) => !e.previousCacheParams)) {
    return undefined;
  }

  return activeEndpointsData.reduce((acc, a) => ({
    ...acc,
    [a.formattedName]: a.isFinished ? a.previousData : a.data,
  }), {});
};

interface OwnProps {
  behandlingVersion: number;
  render: (data: {}, isFinished: boolean) => any;
  endpoints: EndpointOperations[];
  endpointParams?: {};
  showOldDataWhenRefetching?: boolean;
  showComponent?: boolean;
}

const DataFetcherBehandlingData: FunctionComponent<OwnProps> = ({
  render,
  endpoints,
  endpointParams,
  showOldDataWhenRefetching = false,
  showComponent = true,
  behandlingVersion,
}) => {
  if (!showComponent) {
    return null;
  }

  const [hasFailed, setFailed] = useState(false);

  const endpointData = endpoints.reduce((acc, e) => ({
    ...acc,
    [e.name]: {
      formattedName: format(e.name),
      data: useSelector((state) => e.getRestApiData()(state)),
      isFinished: useSelector((state) => e.getRestApiFinished()(state)),
      cacheParams: useSelector((state) => e.getRestApiCacheParams()(state)),
      previousData: useSelector((state) => e.getRestApiPreviousData()(state)),
      previousCacheParams: useSelector((state) => e.getRestApiPreviousCacheParams()(state)),
    },
  }), {});

  const activeEndpointsData = endpoints.filter((e) => e.isEndpointEnabled()).map((e) => ({
    endpoint: e,
    ...endpointData[e.name],
  }));

  const dispatch = useDispatch();
  const ref = useRef<number>();
  useEffect(() => {
    ref.current = behandlingVersion;
    const endpointsToFetchFrom = activeEndpointsData.filter((e) => !e.cacheParams || e.cacheParams.behandlingVersion !== behandlingVersion);

    const meta = {
      keepData: showOldDataWhenRefetching,
      cacheParams: { behandlingVersion },
    };

    Promise.all(endpointsToFetchFrom.map((e) => {
      const params = endpointParams ? endpointParams[e.endpoint.name] : {};
      return dispatch(e.endpoint.makeRestApiRequest()(params, meta));
    })).catch(() => setFailed(true));
  }, [behandlingVersion]);

  const isFetchFinished = activeEndpointsData.every((e) => e.isFinished && e.cacheParams.behandlingVersion === behandlingVersion);

  if (!hasFailed && isFetchFinished) {
    return render(activeEndpointsData.reduce((acc, endpoint) => ({
      ...acc,
      [endpoint.formattedName]: endpoint.data,
    }), {}), true);
  }


  if (!hasFailed && showOldDataWhenRefetching) {
    const endpointPreviousData = findPreviousData(activeEndpointsData);
    if (endpointPreviousData) {
      return render(endpointPreviousData, false);
    }
  }

  return <LoadingPanel />;
};

export default DataFetcherBehandlingData;
