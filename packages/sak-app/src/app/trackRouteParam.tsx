import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { parseQueryString } from '@fpsak-frontend/utils';

const defaultConfig = {
  paramName: '',
  parse: (a) => a,
  storeParam: () => undefined,
  getParamFromStore: () => undefined,
  isQueryParam: false,
  paramsAreEqual: (paramFromUrl, paramFromStore) => paramFromUrl === paramFromStore,
};

interface RouteParamTrackerProps {
  paramFromUrl?: any;
  paramFromStore?: any;
  storeParam: (param: string) => void;
  paramsAreEqual: (paramFromUrl: string, paramFromStore: string) => boolean;
}

/**
 * trackRouteParam
 *
 * Higher order component that tracks a route parameter and stores in the application
 * state whenever it changes.
 * @param config
 */
const trackRouteParam = (config) => (WrappedComponent) => {
  class RouteParamTrackerImpl extends Component<RouteParamTrackerProps> {
    constructor(props) {
      super(props);
      this.updateParam = this.updateParam.bind(this);
    }

    componentDidMount() {
      this.updateParam(undefined);
    }

    componentDidUpdate(prevProps) {
      this.updateParam(prevProps.paramFromUrl);
    }

    componentWillUnmount() {
      const { storeParam } = this.props;
      storeParam(undefined);
    }

    updateParam(prevParamFromUrl) {
      const { paramFromUrl, storeParam, paramsAreEqual } = this.props;
      if (!paramsAreEqual(paramFromUrl, prevParamFromUrl)) {
        storeParam(paramFromUrl);
      }
    }

    render() {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        paramFromUrl, paramFromStore, storeParam, paramsAreEqual,
        ...otherProps
      } = this.props;
      return <WrappedComponent {...otherProps} />;
    }
  }

  const trackingConfig = { ...defaultConfig, ...config };

  const mapStateToProps = (state) => ({ paramFromStore: trackingConfig.getParamFromStore(state) });
  const mapDispatchToProps = (dispatch) => bindActionCreators({ storeParam: trackingConfig.storeParam }, dispatch);
  const mapMatchToParam = (match, location) => {
    const params = trackingConfig.isQueryParam ? parseQueryString(location.search) : match.params;
    return trackingConfig.parse(params[trackingConfig.paramName]);
  };
  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    paramFromUrl: mapMatchToParam(ownProps.match, ownProps.location),
    paramsAreEqual: trackingConfig.paramsAreEqual,
  });

  const RouteParamTracker = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(RouteParamTrackerImpl));

  RouteParamTracker.WrappedComponent = WrappedComponent;
  Object.keys(RouteParamTracker).forEach((ownPropKey) => {
    RouteParamTracker[ownPropKey] = WrappedComponent[ownPropKey];
  });

  return RouteParamTracker;
};

export default trackRouteParam;
