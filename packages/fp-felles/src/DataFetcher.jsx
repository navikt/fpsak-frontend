import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

const FETCH_PREFIX = 'FETCH_';

/**
 * DataFetcher
 *
 * Henter data fra valgte restendepunkter. Ved endring i behandlingId eller behandlingVersjon blir data hentet på nytt
 */
export class DataFetcher extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    endpoints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    isFetchFinished: PropTypes.bool.isRequired,
    behandlingNotRequired: PropTypes.bool,
    behandlingId: PropTypes.number,
    behandlingVersjon: PropTypes.number,
    showComponent: PropTypes.bool,
    showComponentDuringFetch: PropTypes.bool,
    showLoadingIcon: PropTypes.bool,
    valueThatWillTriggerRefetchWhenChanged: PropTypes.number,
    keepDataWhenRefetching: PropTypes.bool,
    endpointParams: PropTypes.shape(),
    allowErrors: PropTypes.bool,
    cacheParams: PropTypes.shape(),
  };

  static defaultProps = {
    behandlingNotRequired: false,
    behandlingId: undefined,
    behandlingVersjon: undefined,
    showComponent: true,
    showComponentDuringFetch: false,
    showLoadingIcon: false,
    valueThatWillTriggerRefetchWhenChanged: undefined,
    keepDataWhenRefetching: false,
    endpointParams: {},
    allowErrors: false,
    cacheParams: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      nrOfErrors: 0,
    };
  }

  hasFetchedLatestData = () => {
    const { behandlingId, behandlingVersjon, cacheParams } = this.props;
    return cacheParams && cacheParams.behandlingId === behandlingId && cacheParams.behandlingVersjon === behandlingVersjon;
  }

  fetchData = (endpointParams, keepDataWhenRefetching) => {
    const {
      endpoints, behandlingId, behandlingVersjon, allowErrors,
    } = this.props;
    if (endpoints.length === 0) {
      return;
    }
    const meta = {
      keepData: keepDataWhenRefetching,
      cacheParams: { behandlingId, behandlingVersjon },
    };

    const requests = endpoints.map((d) => {
      // eslint-disable-next-line react/destructuring-assignment
      const request = this.props[`${FETCH_PREFIX}${d.name}`];
      return () => request(endpointParams, meta);
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
      showComponent, behandlingNotRequired, behandlingId, behandlingVersjon, endpointParams, keepDataWhenRefetching,
    } = this.props;

    const hasRequiredInput = behandlingNotRequired || (!!behandlingId && !!behandlingVersjon);
    if (showComponent && hasRequiredInput && !this.hasFetchedLatestData()) {
      this.fetchData(endpointParams, keepDataWhenRefetching);
    }
  }

  shouldRefetchData = (prevProps) => {
    const {
      behandlingNotRequired,
    } = this.props;
    const shouldRefetchOnlyWhenBehandlingChanges = behandlingNotRequired ? !!prevProps.behandlingId && !!prevProps.behandlingVersjon : true;
    return shouldRefetchOnlyWhenBehandlingChanges && !this.hasFetchedLatestData();
  }

  componentDidUpdate = (prevProps) => {
    const {
      showComponent, endpointParams, keepDataWhenRefetching, valueThatWillTriggerRefetchWhenChanged,
    } = this.props;

    const forcedRefresh = valueThatWillTriggerRefetchWhenChanged !== prevProps.valueThatWillTriggerRefetchWhenChanged;

    if (showComponent && (forcedRefresh || this.shouldRefetchData(prevProps))) {
      this.fetchData(endpointParams, keepDataWhenRefetching);
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
  const cacheParams = ownProps.endpoints.map((dataApi) => dataApi.getRestApiCacheParams()(state));

  return {
    ...dataMappedByApi,
    cacheParams: cacheParams.length > 0 ? cacheParams[0] : undefined,
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
