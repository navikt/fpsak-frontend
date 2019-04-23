import React, { Component, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { parseQueryString } from 'utils/urlUtils';

const defaultConfig = {
  paramName: '',
  parse: a => a,
  paramPropType: PropTypes.any,
  storeParam: () => undefined,
  getParamFromStore: () => undefined,
  isQueryParam: false,
  paramsAreEqual: (paramFromUrl, paramFromStore) => paramFromUrl === paramFromStore,
};

type ConfigTsProps = Readonly<{
  paramName: string;
  parse?: (param: any) => any;
  paramPropType: any;
  storeParam: (param: any) => any;
  getParamFromStore: (store?: any) => any;
  isQueryParam: boolean;
  paramsAreEqual?: (paramFromUrl: any, paramFromStore: any) => boolean;
}>

type TsProps = Readonly<{
  paramFromUrl: any[];
  paramFromStore: any[];
  storeParam: (param?: any) => any;
  paramsAreEqual: (param1: any, param2: any) => boolean;
}>

/**
 * trackRouteParam
 *
 * Higher order component that tracks a route parameter and stores in the application
 * state whenever it changes.
 * @param config
 */
const trackRouteParam = (config: ConfigTsProps) => (WrappedComponent: ReactElement<any>) => {
  const trackingConfig = { ...defaultConfig, ...config };

  class RouteParamTrackerImpl extends Component<TsProps> {
    static propTypes = {
      paramFromUrl: trackingConfig.paramPropType,
      paramFromStore: trackingConfig.paramPropType,
      storeParam: PropTypes.func.isRequired,
      paramsAreEqual: PropTypes.func.isRequired,
    };

    static defaultProps = {
      paramFromUrl: undefined,
      paramFromStore: undefined,
    };

    componentDidMount = () => {
      this.updateParam();
    }

    componentDidUpdate = (prevProps) => {
      this.updateParam(prevProps.paramFromUrl);
    }

    componentWillUnmount = () => {
      const { storeParam } = this.props;
      storeParam(undefined);
    }

    updateParam = (prevParamFromUrl?: any) => {
      const { paramFromUrl, storeParam, paramsAreEqual } = this.props;
      if (!paramsAreEqual(paramFromUrl, prevParamFromUrl)) {
        storeParam(paramFromUrl);
      }
    }

    render = () => {
      const {
        paramFromUrl, paramFromStore, storeParam, paramsAreEqual, // eslint-disable-line @typescript-eslint/no-unused-vars
        ...otherProps
      } = this.props;
      return <WrappedComponent {...otherProps} />;
    }
  }

  const mapStateToProps = state => ({ paramFromStore: trackingConfig.getParamFromStore(state) });
  const mapDispatchToProps = dispatch => bindActionCreators({ storeParam: trackingConfig.storeParam }, dispatch);
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
