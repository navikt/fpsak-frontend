import React, {
  FunctionComponent, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { isObjectEmpty } from '@fpsak-frontend/utils';

const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

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

  const [fetchingData, setFetchingData] = useState({
    hasFinishedFetching: false,
    data: {},
  });

  const endpointData = endpoints.reduce((acc, e) => ({
    ...acc,
    [e.name]: {
      formattedName: format(e.name),
      data: useSelector((state) => e.getRestApiData()(state)),
      isFinished: useSelector((state) => e.getRestApiFinished()(state)),
      cacheParams: useSelector((state) => e.getRestApiCacheParams()(state)),
    },
  }), {});

  const activeEndpointsData = endpoints.filter((e) => e.isEndpointEnabled()).map((e) => ({
    endpoint: e,
    ...endpointData[e.name],
  }));

  const dispatch = useDispatch();
  const ref = useRef<number>();
  useEffect(() => {
    setFetchingData((oldState) => ({
      hasFinishedFetching: false,
      data: oldState.data,
    }));

    ref.current = behandlingVersion;
    const endpointsToFetchFrom = activeEndpointsData.filter((e) => !e.cacheParams || e.cacheParams.behandlingVersion !== behandlingVersion);

    const meta = {
      keepData: showOldDataWhenRefetching,
      cacheParams: { behandlingVersion },
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
  }, [behandlingVersion]);

  const hasChanged = ref.current !== behandlingVersion;
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

export default DataFetcherBehandlingData;
