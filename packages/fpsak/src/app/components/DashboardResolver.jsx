import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getFeatureToggles } from 'app/duck';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import Dashboard from './Dashboard';
import featureToggle from '../featureToggle';
import { getPathToFplos } from '../paths';

const notDevelopment = () => process.env.NODE_ENV !== 'development';

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak
 */
export class DashboardResolver extends Component {
  static propTypes = {
    shouldOpenFplos: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { shouldOpenFplos } = this.props;
    if (shouldOpenFplos) {
      window.location.assign(getPathToFplos(window.location.href));
    }
  }

  render() {
    const { shouldOpenFplos } = this.props;
    return shouldOpenFplos ? <LoadingPanel /> : <Dashboard />;
  }
}

const mapStateToProps = state => ({
  shouldOpenFplos: getFeatureToggles(state)[featureToggle.LINK_TIL_FPLOS_AKTIVERT]
    && notDevelopment(),
});

export default connect(mapStateToProps)(DashboardResolver);
