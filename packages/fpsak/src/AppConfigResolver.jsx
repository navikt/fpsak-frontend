import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeRestApiRequest, getRestApiFinished } from '@fpsak-frontend/data/duck';
import { FpsakApi } from '@fpsak-frontend/data/fpsakApi';
import LoadingPanel from '@fpsak-frontend/shared-components/LoadingPanel';
import { fetchFeatureToggleActionCreator } from '@fpsak-frontend/data/error/duck';
import featureToggle from '@fpsak-frontend/kodeverk/featureToggle';

const featureToggles = [
  { navn: featureToggle.SIMULER_OPPDRAG },
];

class AppConfigResolver extends Component {
  constructor(props) {
    super(props);
    this.resolveAppConfig = this.resolveAppConfig.bind(this);
    this.resolveAppConfig();
  }

  resolveAppConfig() {
    const {
      fetchNavAnsatt,
      fetchLanguageFile,
      fetchRettskilde,
      fetchSystemrutine,
      fetchBehandlendeEnheter,
      fetchKodeverk,
      fetchShowDetailedErrorMessages,
      fetchFeatureToggle,
    } = this.props;

    fetchNavAnsatt();
    fetchLanguageFile();
    fetchRettskilde();
    fetchSystemrutine();
    fetchBehandlendeEnheter();
    fetchKodeverk();
    fetchShowDetailedErrorMessages();
    fetchFeatureToggle(featureToggles);
  }

  render() {
    const { finishedLoadingBlockers, children } = this.props;
    if (!finishedLoadingBlockers) {
      return <LoadingPanel />;
    }
    return children;
  }
}

AppConfigResolver.propTypes = {
  finishedLoadingBlockers: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  fetchNavAnsatt: PropTypes.func.isRequired,
  fetchLanguageFile: PropTypes.func.isRequired,
  fetchRettskilde: PropTypes.func.isRequired,
  fetchSystemrutine: PropTypes.func.isRequired,
  fetchBehandlendeEnheter: PropTypes.func.isRequired,
  fetchKodeverk: PropTypes.func.isRequired,
  fetchShowDetailedErrorMessages: PropTypes.func.isRequired,
  fetchFeatureToggle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const blockers = [
    getRestApiFinished(FpsakApi.NAV_ANSATT)(state),
    getRestApiFinished(FpsakApi.LANGUAGE_FILE)(state),
    getRestApiFinished(FpsakApi.RETTSKILDE_URL)(state),
    getRestApiFinished(FpsakApi.SYSTEMRUTINE_URL)(state),
    getRestApiFinished(FpsakApi.KODEVERK)(state),
    getRestApiFinished(FpsakApi.FEATURE_TOGGLE)(state),
    getRestApiFinished(FpsakApi.SHOW_DETAILED_ERROR_MESSAGES)(state),
  ];
  return {
    finishedLoadingBlockers: blockers.every(finished => finished),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchNavAnsatt: makeRestApiRequest(FpsakApi.NAV_ANSATT),
  fetchLanguageFile: makeRestApiRequest(FpsakApi.LANGUAGE_FILE),
  fetchRettskilde: makeRestApiRequest(FpsakApi.RETTSKILDE_URL),
  fetchSystemrutine: makeRestApiRequest(FpsakApi.SYSTEMRUTINE_URL),
  fetchBehandlendeEnheter: makeRestApiRequest(FpsakApi.BEHANDLENDE_ENHETER),
  fetchKodeverk: makeRestApiRequest(FpsakApi.KODEVERK),
  fetchFeatureToggle: fetchFeatureToggleActionCreator,
  fetchShowDetailedErrorMessages: makeRestApiRequest(FpsakApi.SHOW_DETAILED_ERROR_MESSAGES),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
