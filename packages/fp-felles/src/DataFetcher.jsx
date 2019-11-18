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
    behandlingId: PropTypes.number,
    behandlingVersjon: PropTypes.number,
    showComponent: PropTypes.bool,
    showComponentDuringFetch: PropTypes.bool,
    showLoadingIcon: PropTypes.bool,
    isFetchFinished: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    render: PropTypes.func.isRequired,
    forceRefreshWhenPropChanged: PropTypes.number,
    behandlingNotRequired: PropTypes.bool,
    keepDataWhenRefetching: PropTypes.bool,
    dataParams: PropTypes.shape(),
  };

  static defaultProps = {
    behandlingId: undefined,
    behandlingVersjon: undefined,
    showComponent: true,
    showComponentDuringFetch: false,
    showLoadingIcon: false,
    forceRefreshWhenPropChanged: undefined,
    behandlingNotRequired: true,
    keepDataWhenRefetching: false,
    dataParams: {},
  }

  fetchData = (dataParams, keepDataWhenRefetching) => {
    const { data } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    data.forEach((d) => this.props[`${FETCH_PREFIX}${d.name}`](dataParams, { keepData: keepDataWhenRefetching }));
  }

  componentDidMount = () => {
    const {
      showComponent, behandlingId, behandlingVersjon, behandlingNotRequired, dataParams, keepDataWhenRefetching,
    } = this.props;
    const shouldFetch = behandlingNotRequired || (behandlingId && behandlingVersjon);
    if (showComponent && shouldFetch) {
      this.fetchData(dataParams, keepDataWhenRefetching);
    }
  }

  componentDidUpdate = (prevProps) => {
    const {
      showComponent, behandlingId, behandlingVersjon, forceRefreshWhenPropChanged, dataParams, keepDataWhenRefetching,
    } = this.props;
    if (showComponent && behandlingId && behandlingVersjon
      && (behandlingId !== prevProps.behandlingId
        || behandlingVersjon !== prevProps.behandlingVersjon
        || forceRefreshWhenPropChanged !== prevProps.forceRefreshWhenPropChanged)) {
      this.fetchData(dataParams, keepDataWhenRefetching);
    }
  }

  render() {
    const {
      showComponent, showComponentDuringFetch, isFetchFinished, render, data, behandlingId, behandlingVersjon, showLoadingIcon, behandlingNotRequired,
    } = this.props;

    const shouldShow = behandlingNotRequired || (behandlingId && behandlingVersjon);
    if (showComponentDuringFetch || (showComponent && shouldShow && isFetchFinished)) {
      const dataProps = data.reduce((acc, d) => {
        const propName = format(d.name);
        return {
          ...acc,
          // eslint-disable-next-line react/destructuring-assignment
          [propName]: this.props[propName],
        };
      }, {});
      return render(dataProps);
    }

    return showLoadingIcon ? <LoadingPanel /> : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const data = ownProps.data.reduce((acc, dataApi) => ({
    ...acc,
    [format(dataApi.name)]: dataApi.getRestApiData()(state),
  }), {});

  return {
    ...data,
    isFetchFinished: ownProps.data.every((dataApi) => dataApi.getRestApiFinished()(state)),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  ownProps.data.reduce((acc, dataApi) => ({
    ...acc,
    [`${FETCH_PREFIX}${dataApi.name}`]: dataApi.makeRestApiRequest(),
  }), {}), dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(DataFetcher);
