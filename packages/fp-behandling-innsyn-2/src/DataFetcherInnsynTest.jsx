import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

const FETCH_PREFIX = 'FETCH_';
const CACHE_PREFIX = 'CACHE_';

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
    showOldDataWhenRefetching: PropTypes.bool,
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
    showOldDataWhenRefetching: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      nrOfErrors: 0,
      prevDataProps: undefined,
    };
  }

  fetchData = (endpointParams, showOldDataWhenRefetching) => {
    const {
      endpoints, allowErrors,
    } = this.props;
    if (endpoints.length === 0) {
      return;
    }
    const meta = {
      keepData: showOldDataWhenRefetching,
    };

    const requests = endpoints.map((endpoint) => {
      // eslint-disable-next-line react/destructuring-assignment
      const request = this.props[`${FETCH_PREFIX}${endpoint.name}`];
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
      showComponent, endpointParams, showOldDataWhenRefetching,
    } = this.props;

    if (showComponent) {
      this.fetchData(endpointParams, showOldDataWhenRefetching);
    }
  }

  componentDidUpdate = (prevProps) => {
    const {
      showComponent, endpointParams, keepDataWhenRefetching, fetchTrigger, isFetchFinished, endpoints,
    } = this.props;

    if (isFetchFinished && prevProps.isFetchFinished !== isFetchFinished) {
      const prevDataProps = endpoints.reduce((acc, d) => {
        const propName = format(d.name);
        return {
          ...acc,
          // eslint-disable-next-line react/destructuring-assignment
          [propName]: this.props[propName],
        };
      }, {});
      this.setState((state) => ({ ...state, prevDataProps }));
    }

    if (showComponent && prevProps.fetchTrigger !== fetchTrigger) {
      this.fetchData(endpointParams, keepDataWhenRefetching);
    }
  }

  render() {
    const {
      showComponent, isFetchFinished, render, endpoints,
      showLoadingIcon, showOldDataWhenRefetching, fetchTrigger,
    } = this.props;
    const { nrOfErrors, prevDataProps } = this.state;

    const showWhenFinished = showComponent && isFetchFinished;
    const hasFailed = nrOfErrors > 0 && nrOfErrors === endpoints.length;

    if (!hasFailed && ((showOldDataWhenRefetching && prevDataProps) || showWhenFinished)) {
      const dataProps = endpoints.reduce((acc, d) => {
        const propName = format(d.name);
        return {
          ...acc,
          // eslint-disable-next-line react/destructuring-assignment
          [propName]: this.props[propName],
        };
      }, {});

      return render(showOldDataWhenRefetching && !showWhenFinished ? prevDataProps : dataProps);
    }

    return showComponent && showLoadingIcon && !hasFailed ? <LoadingPanel /> : null;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const dataMappedByApi = ownProps.endpoints.reduce((acc, dataApi) => ({
    ...acc,
    [format(dataApi.name)]: dataApi.getRestApiData()(state),
  }), {});

  return {
    ...dataMappedByApi,
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
