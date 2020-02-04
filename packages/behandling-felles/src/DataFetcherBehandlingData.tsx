import React, {
  FunctionComponent, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import BehandlingDataCache from './BehandlingDataCache';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

// TODO (TOR) Fjern denne når Klage, Innsyn og Tilbakekreving er skrive om

interface OwnProps {
  behandlingVersion: number;
  render: (data: {}) => any;
  endpoints: EndpointOperations[];
  endpointParams?: {};
  behandlingDataCache: BehandlingDataCache;
  showOldDataWhenRefetching?: boolean;
  showComponent?: boolean;
}

const DataFetcherBehandlingData: FunctionComponent<OwnProps> = ({
  behandlingVersion,
  render,
  endpoints,
  endpointParams,
  behandlingDataCache,
  showOldDataWhenRefetching = false,
  showComponent = true,
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
    },
  }), {});

  const activeEndpoints = endpoints.filter((e) => e.isEndpointEnabled());
  const isFetchFinished = activeEndpoints.every((e) => endpointData[e.name].isFinished);

  const data = activeEndpoints.reduce((acc, e) => ({
    ...acc,
    [endpointData[e.name].formattedName]: endpointData[e.name].data,
  }), {});

  const dispatch = useDispatch();
  const ref = useRef<number>();
  useEffect(() => {
    ref.current = behandlingVersion;

    const endpointsToFetchFrom = activeEndpoints.filter((e) => !behandlingDataCache.hasLatestDataFor(endpointData[e.name].formattedName));
    endpointsToFetchFrom.forEach((e) => { behandlingDataCache.startFetch(behandlingVersion, endpointData[e.name].formattedName); });

    const meta = {
      keepData: showOldDataWhenRefetching,
    };

    Promise.all(endpointsToFetchFrom.map((e) => {
      const params = endpointParams ? endpointParams[e.name] : {};
      return dispatch(e.makeRestApiRequest()(params, meta));
    })).then((responses) => {
      responses.forEach((r, index) => behandlingDataCache
        .setData(behandlingVersion, endpointData[endpointsToFetchFrom[index].name].formattedName, r.payload));
    }).catch(() => setFailed(true));
  }, [behandlingVersion]);

  if (!hasFailed && isFetchFinished
      && (behandlingVersion === ref.current || behandlingDataCache.hasLatestDataForAll(activeEndpoints.map((e) => endpointData[e.name].formattedName)))) {
    return render({
      ...behandlingDataCache.getCurrentData(),
      ...data,
    });
  }

  if (!hasFailed && showOldDataWhenRefetching && behandlingDataCache.hasPreviousData()) {
    return render(behandlingDataCache.getPreviousData());
  }

  return <LoadingPanel />;
};

export default DataFetcherBehandlingData;
