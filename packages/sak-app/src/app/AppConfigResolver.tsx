import React, { Component, ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import fpsakApi from '../data/fpsakApi';
import {
  fetchAlleKodeverk as fetchAlleKodeverkAC, getFeatureToggles, isFinishedLoadingData, fetchAllFeatureToggles,
} from './duck';

interface OwnProps {
  finishedLoadingBlockers: boolean;
  children: ReactNode;
  fetchNavAnsatt: () => void;
  fetchLanguageFile: () => void;
  fetchBehandlendeEnheter: () => void;
  fetchAlleKodeverk: (featureToggles: {}) => void;
  fetchShowDetailedErrorMessages: () => void;
  fetchFeatureToggles: () => void;
  featureToggles: {};
}

class AppConfigResolver extends Component<OwnProps> {
  static defaultProps = {
    featureToggles: undefined,
  };

  constructor(props) {
    super(props);
    this.resolveAppConfig();
  }

  componentDidUpdate(prevProps) {
    const {
      fetchAlleKodeverk,
      featureToggles,
    } = this.props;

    if (featureToggles !== prevProps.featureToggles) {
      fetchAlleKodeverk(featureToggles);
    }
  }

  resolveAppConfig = () => {
    const {
      fetchNavAnsatt,
      fetchLanguageFile,
      fetchBehandlendeEnheter,
      fetchShowDetailedErrorMessages,
      fetchFeatureToggles,
    } = this.props;

    fetchNavAnsatt();
    fetchLanguageFile();
    fetchBehandlendeEnheter();
    fetchShowDetailedErrorMessages();
    fetchFeatureToggles();
  }

  render = () => {
    const { finishedLoadingBlockers, children } = this.props;
    if (!finishedLoadingBlockers) {
      return <LoadingPanel />;
    }
    return children;
  }
}

const mapStateToProps = (state) => ({
  finishedLoadingBlockers: isFinishedLoadingData(state),
  featureToggles: getFeatureToggles(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchNavAnsatt: fpsakApi.NAV_ANSATT.makeRestApiRequest(),
  fetchLanguageFile: fpsakApi.LANGUAGE_FILE.makeRestApiRequest(),
  fetchBehandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.makeRestApiRequest(),
  fetchShowDetailedErrorMessages: fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.makeRestApiRequest(),
  fetchAlleKodeverk: fetchAlleKodeverkAC,
  fetchFeatureToggles: fetchAllFeatureToggles,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
