import React, {
  ReactNode, FunctionComponent, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import BehandlingDataCache from './BehandlingDataCache';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

interface OwnProps {
  behandlingVersion: number;
  render: (data: {}) => ReactNode;
  endpoints: [{
    name: string;
    isEndpointEnabled: () => boolean;
    getRestApiData: () => (state: {}) => any;
    getRestApiFinished: () => (state: {}) => boolean;
    makeRestApiRequest: () => (param: any, meta: { keepData: boolean}) => Promise<any>;
  }];
  endpointParams?: {};
  behandlingDataCache: BehandlingDataCache;
  showOldDataWhenRefetching?: boolean;
  showComponent: boolean;
}

const DataFetcherBehandlingData: FunctionComponent<OwnProps> = ({
  behandlingVersion,
  render,
  endpoints,
  endpointParams,
  behandlingDataCache,
  showOldDataWhenRefetching,
  showComponent,
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

DataFetcherBehandlingData.propTypes = {
  behandlingVersion: PropTypes.number.isRequired,
  render: PropTypes.func.isRequired,
  endpoints: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    isEndpointEnabled: PropTypes.func.isRequired,
    getRestApiData: PropTypes.func.isRequired,
    getRestApiFinished: PropTypes.func.isRequired,
    makeRestApiRequest: PropTypes.func.isRequired,
  })).isRequired,
  endpointParams: PropTypes.shape(),
  behandlingDataCache: PropTypes.instanceOf(BehandlingDataCache).isRequired,
  showOldDataWhenRefetching: PropTypes.bool,
  showComponent: PropTypes.bool,
};

DataFetcherBehandlingData.defaultProps = {
  showOldDataWhenRefetching: false,
  showComponent: true,
  endpointParams: undefined,
};

export default DataFetcherBehandlingData;
