import React, {
  FunctionComponent, useEffect, useRef, useState, useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';

import { DispatchContext, StateContext } from './BehandlingDataProvider';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

interface OwnProps {
  behandlingVersion: number;
  render: (data: {}) => any;
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

  const dispatchContext = useContext(DispatchContext);
  const stateContext = useContext(StateContext);

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

  const dispatch = useDispatch();
  const ref = useRef<number>();
  useEffect(() => {
    ref.current = behandlingVersion;
    const endpointsToFetchFrom = activeEndpoints.filter((e) => !(endpointData[e.name].formattedName in stateContext.data));

    const meta = {
      keepData: showOldDataWhenRefetching,
    };

    Promise.all(endpointsToFetchFrom.map((e) => {
      const params = endpointParams ? endpointParams[e.name] : {};
      return dispatch(e.makeRestApiRequest()(params, meta));
    })).then((responses) => {
      dispatchContext({
        type: 'add-all',
        data: responses.reduce((acc, response, index) => ({
          ...acc,
          [endpointData[endpointsToFetchFrom[index].name].formattedName]: response.payload,
        }), {}),
      });
    }).catch(() => setFailed(true));
  }, [behandlingVersion]);

  if (!hasFailed && isFetchFinished
      && activeEndpoints.every((e) => endpointData[e.name].formattedName in stateContext.data)) {
    return render(stateContext.data);
  }

  if (!hasFailed && showOldDataWhenRefetching && stateContext.previousData) {
    return render(stateContext.previousData);
  }

  return <LoadingPanel />;
};

export default DataFetcherBehandlingData;
