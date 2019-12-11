import React, {
  ReactNode, FunctionComponent, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import BehandlingDataCache from './BehandlingDataCache';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

interface OwnProps {
  behandlingVersjon: number;
  render: (data: {}) => ReactNode;
  endpoints: [{
    name: string;
    isEndpointEnabled: () => boolean;
    getRestApiData: () => (state: {}) => any;
    getRestApiFinished: () => (state: {}) => boolean;
    makeRestApiRequest: () => () => Promise<any>;
  }];
  behandlingDataCache: BehandlingDataCache;
  showOldDataWhenRefetching?: boolean;
  showComponent: boolean;
}

const DataFetcherBehandling: FunctionComponent<OwnProps> = ({
  behandlingVersjon,
  render,
  endpoints,
  behandlingDataCache,
  showOldDataWhenRefetching,
  showComponent,
}) => {
  if (!showComponent) {
    return null;
  }

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
    ref.current = behandlingVersjon;
    activeEndpoints.filter((e) => !behandlingDataCache.hasData(endpointData[e.name].formattedName))
      .forEach((e) => {
        behandlingDataCache.startFetch(behandlingVersjon, endpointData[e.name].formattedName);
        dispatch(e.makeRestApiRequest()())
          .then(({ payload }) => behandlingDataCache.setData(behandlingVersjon, endpointData[e.name].formattedName, payload));
      });
  }, [behandlingVersjon]);

  if (isFetchFinished && (behandlingVersjon === ref.current || behandlingDataCache.hasDataForAll(activeEndpoints.map((e) => format(e.name))))) {
    const d = {
      ...behandlingDataCache.getCurrentData(),
      ...data,
    };
    return render(d);
  }
  if (showOldDataWhenRefetching && behandlingDataCache.hasPreviousData()) {
    return render(behandlingDataCache.getPreviousData());
  }
  return <LoadingPanel />;
};

DataFetcherBehandling.propTypes = {
  behandlingVersjon: PropTypes.number.isRequired,
  render: PropTypes.func.isRequired,
  endpoints: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    isEndpointEnabled: PropTypes.func.isRequired,
    getRestApiData: PropTypes.func.isRequired,
    getRestApiFinished: PropTypes.func.isRequired,
    makeRestApiRequest: PropTypes.func.isRequired,
  })).isRequired,
  behandlingDataCache: PropTypes.instanceOf(BehandlingDataCache).isRequired,
  showOldDataWhenRefetching: PropTypes.bool,
  showComponent: PropTypes.bool,
};

DataFetcherBehandling.defaultProps = {
  showOldDataWhenRefetching: false,
  showComponent: true,
};

export default DataFetcherBehandling;
