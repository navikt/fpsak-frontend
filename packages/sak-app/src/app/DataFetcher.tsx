import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

const FETCH_PREFIX = 'FETCH_';
const CACHE_PREFIX = 'CACHE_';

interface OwnProps {
  render: () => void;
  endpoints: EndpointOperations[];
  isFetchFinished: boolean;
  behandlingNotRequired?: boolean;
  behandlingId?: number;
  behandlingVersjon?: number;
  showComponent?: boolean;
  showComponentDuringFetch?: boolean;
  showLoadingIcon?: boolean;
  valueThatWillTriggerRefetchWhenChanged?: number;
  keepDataWhenRefetching?: boolean;
  endpointParams?: {};
  allowErrors?: boolean;
}

interface StateProps {
  nrOfErrors: number;
  fakeCache: {};
}

/**
 * DataFetcher
 *
 * Henter data fra valgte restendepunkter. Ved endring i behandlingId eller behandlingVersjon blir data hentet på nytt
 */
export class DataFetcher extends Component<OwnProps, StateProps> {
  static defaultProps = {
    behandlingNotRequired: false,
    showComponent: true,
    showComponentDuringFetch: false,
    showLoadingIcon: false,
    keepDataWhenRefetching: false,
    allowErrors: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      nrOfErrors: 0,
      fakeCache: {},
    };
  }

  hasFetchedLatestData = (endpoint) => {
    const { behandlingId, behandlingVersjon } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    const cacheParams = this.props[CACHE_PREFIX + endpoint.name];
    return cacheParams && cacheParams.behandlingId === behandlingId && cacheParams.behandlingVersjon === behandlingVersjon;
  }

  fetchData = () => {
    const {
      endpoints, behandlingId, behandlingVersjon, allowErrors, endpointParams, keepDataWhenRefetching,
    } = this.props;
    if (endpoints.length === 0) {
      return;
    }
    const meta = {
      keepData: keepDataWhenRefetching,
      cacheParams: { behandlingId, behandlingVersjon },
    };

    const requests = endpoints.filter((endpoint) => !this.hasFetchedLatestData(endpoint)).map((endpoint) => {
      const params = endpointParams ? endpointParams[endpoint.name] : {};
      // eslint-disable-next-line react/destructuring-assignment
      const request = this.props[`${FETCH_PREFIX}${endpoint.name}`];
      return () => request(params, meta);
    });

    if (allowErrors) {
      requests.forEach((request) => {
        request().catch(() => this.setState((state) => ({ ...state, nrOfErrors: state.nrOfErrors + 1 })));
      });
    } else {
      Promise.all(requests.map((request) => request()))
        .catch(() => this.setState((state) => ({ ...state, nrOfErrors: endpoints.length })));
    }
  }

  componentDidMount = () => {
    const {
      showComponent, behandlingNotRequired, behandlingId, behandlingVersjon,
    } = this.props;

    const hasRequiredInput = behandlingNotRequired || (!!behandlingId && !!behandlingVersjon);
    if (showComponent && hasRequiredInput) {
      this.fetchData();
    }
  }

  hasBehandlingsdataChanged = (prevProps) => {
    const { behandlingId, behandlingVersjon } = this.props;
    const hasPreviousBehandlingdata = !!prevProps.behandlingId && !!prevProps.behandlingVersjon;
    const hasBehandlingdataChanged = prevProps.behandlingId !== behandlingId || prevProps.behandlingVersjon !== behandlingVersjon;
    return hasPreviousBehandlingdata || hasBehandlingdataChanged;
  }

  componentDidUpdate = (prevProps) => {
    const {
      showComponent, valueThatWillTriggerRefetchWhenChanged, behandlingNotRequired,
    } = this.props;

    const forcedRefresh = valueThatWillTriggerRefetchWhenChanged !== prevProps.valueThatWillTriggerRefetchWhenChanged;
    const shouldRefetchData = behandlingNotRequired ? this.hasBehandlingsdataChanged(prevProps) : true;

    if (showComponent && (forcedRefresh || shouldRefetchData)) {
      this.fetchData();
    }
  }

  render() {
    const {
      showComponent, showComponentDuringFetch, isFetchFinished, render, endpoints, behandlingId, behandlingVersjon,
      showLoadingIcon, behandlingNotRequired,
    } = this.props;
    const { nrOfErrors } = this.state;

    const hasRequiredInput = behandlingNotRequired || (!!behandlingId && !!behandlingVersjon);
    const showWhenFinished = showComponent && hasRequiredInput && isFetchFinished;
    const hasFailed = nrOfErrors > 0 && nrOfErrors === endpoints.length;

    if (!hasFailed && (showComponentDuringFetch || showWhenFinished)) {
      const dataProps = endpoints.reduce((acc, d) => {
        const propName = format(d.name);
        return {
          ...acc,
          // eslint-disable-next-line react/destructuring-assignment
          [propName]: this.props[propName],
        };
      }, {});
      // @ts-ignore (Blir fiksa ved refaktorering av denne komponenten)
      return render(dataProps);
    }

    return showComponent && showLoadingIcon && !hasFailed ? <LoadingPanel /> : null;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const dataMappedByApi = ownProps.endpoints.reduce((acc, dataApi) => ({
    ...acc,
    [format(dataApi.name)]: dataApi.getRestApiData()(state),
  }), {});
  const cacheParamsByApi = ownProps.endpoints.reduce((acc, dataApi) => ({
    ...acc,
    [CACHE_PREFIX + dataApi.name]: dataApi.getRestApiCacheParams()(state),
  }), {});

  return {
    ...dataMappedByApi,
    ...cacheParamsByApi,
    isFetchFinished: ownProps.endpoints.every((dataApi) => dataApi.getRestApiFinished()(state)),
  };
};

export const createFetchForEachEndpoint = (endpoints) => endpoints.reduce((acc, dataApi) => ({
  ...acc,
  [`${FETCH_PREFIX}${dataApi.name}`]: dataApi.makeRestApiRequest(),
}), {});

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  createFetchForEachEndpoint(ownProps.endpoints), dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(DataFetcher);
