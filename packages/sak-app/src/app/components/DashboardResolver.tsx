import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import errorHandler from '@fpsak-frontend/error-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { getPathToFplos } from '../paths';
import Dashboard from './Dashboard';

const isDevelopment = () => process.env.NODE_ENV === 'development';

interface OwnProps {
  addErrorMessage: (message: string) => void;
}

/**
 * DashboardResolver
 *
 * Komponent som redirecter til Fplos eller går til fremsiden til Fpsak. Går alltid til Fpsak på utviklingsmiljø eller når Fplos ikke kan nåes
 */
export class DashboardResolver extends Component<OwnProps & WrappedComponentProps> {
  state = { isLoading: true };

  componentDidMount = async () => {
    if (isDevelopment()) {
      return;
    }
    try {
      const url = getPathToFplos(window.location.href);
      await axios.get(url); // Sjekk om LOS er oppe
      window.location.assign(url);
    } catch (e) {
      const { addErrorMessage, intl } = this.props;
      this.setState((prevState) => ({ ...prevState, isLoading: false }));
      addErrorMessage(intl.formatMessage({ id: 'DashboardResolver.FpLosErNede' }));
    }
  }

  render() {
    const { isLoading } = this.state;
    return !isDevelopment() && isLoading ? <LoadingPanel /> : <Dashboard />;
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addErrorMessage: errorHandler.getErrorActionCreator(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DashboardResolver));
