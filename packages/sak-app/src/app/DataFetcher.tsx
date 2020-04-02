import React, {
  FunctionComponent, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useStore } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { isObjectEmpty } from '@fpsak-frontend/utils';

const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

export class DataFetcherTriggers {
  triggers = {}

  isRequiredForInitiallFetching = false

  constructor(triggers, isRequiredForInitiallFetching) {
    this.triggers = triggers;
    this.isRequiredForInitiallFetching = isRequiredForInitiallFetching;
  }

  getTriggers = () => this.triggers;

  getTriggerValues = () => Object.values(this.triggers);

  shouldFetch = (previousTriggerValues, cacheParams) => {
    // Skal rehente når triggerverdi har endret seg fra en verdi(ulik undefined) til en annen
    if (previousTriggerValues && Object.keys(this.triggers).some((key) => previousTriggerValues[key] !== undefined
      && previousTriggerValues[key] !== this.triggers[key])) {
      return true;
    }
    // Skal ikke rehente når siste henting er gjort med udefinerte triggere.
    if (!this.isRequiredForInitiallFetching && cacheParams && Object.keys(this.triggers).every((key) => !cacheParams[key] && !cacheParams[key])) {
      return false;
    }
    // Skal hente data om dette er første forsøk eller rehente om triggere har endret seg
    return !cacheParams || Object.keys(this.triggers).some((key) => cacheParams[key] !== this.triggers[key]);
  }

  hasChanged = (previousTriggerValues) => previousTriggerValues && Object.keys(this.triggers).some((key) => previousTriggerValues[key] !== this.triggers[key])
}

interface OwnProps {
  fetchingTriggers: DataFetcherTriggers;
  render: (data: {}, isFinished: boolean) => any;
  endpoints: EndpointOperations[];
  endpointParams?: {};
  showOldDataWhenRefetching?: boolean;
  showComponent?: boolean;
}

const DataFetcher: FunctionComponent<OwnProps> = ({
  fetchingTriggers,
  render,
  endpoints,
  endpointParams,
  showOldDataWhenRefetching = false,
  showComponent = true,
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
  const ref = useRef<any>();
  useEffect(() => {
    setFetchingData((oldState) => ({
      hasFinishedFetching: false,
      data: oldState.data,
    }));

    const state = store.getState();

    const endpointsToFetchFrom = activeEndpointsData.filter((e) => fetchingTriggers
      .shouldFetch(ref.current, e.endpoint.getRestApiCacheParams()(state)));

    ref.current = fetchingTriggers.getTriggers();

    const meta = {
      keepData: showOldDataWhenRefetching,
      cacheParams: ref.current,
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
  }, fetchingTriggers.getTriggerValues());

  const hasChanged = fetchingTriggers.hasChanged(ref.current);
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
