import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fpsakApi from 'data/fpsakApi';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { fetchAllFeatureToggles } from 'app/duck';

class AppConfigResolver extends Component {
  static propTypes = {
    finishedLoadingBlockers: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    fetchNavAnsatt: PropTypes.func.isRequired,
    fetchLanguageFile: PropTypes.func.isRequired,
    fetchBehandlendeEnheter: PropTypes.func.isRequired,
    fetchKodeverk: PropTypes.func.isRequired,
    fetchShowDetailedErrorMessages: PropTypes.func.isRequired,
    fetchFeatureToggles: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.resolveAppConfig();
  }

  resolveAppConfig = () => {
    const {
      fetchNavAnsatt,
      fetchLanguageFile,
      fetchBehandlendeEnheter,
      fetchKodeverk,
      fetchShowDetailedErrorMessages,
      fetchFeatureToggles,
    } = this.props;

    fetchNavAnsatt();
    fetchLanguageFile();
    fetchBehandlendeEnheter();
    fetchKodeverk();
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

const mapStateToProps = (state) => {
  const blockers = [
    fpsakApi.NAV_ANSATT.getRestApiFinished()(state),
    fpsakApi.LANGUAGE_FILE.getRestApiFinished()(state),
    fpsakApi.KODEVERK.getRestApiFinished()(state),
    fpsakApi.FEATURE_TOGGLE.getRestApiFinished()(state),
    fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiFinished()(state),
  ];
  return {
    finishedLoadingBlockers: blockers.every((finished) => finished),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchNavAnsatt: fpsakApi.NAV_ANSATT.makeRestApiRequest(),
  fetchLanguageFile: fpsakApi.LANGUAGE_FILE.makeRestApiRequest(),
  fetchBehandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.makeRestApiRequest(),
  fetchKodeverk: fpsakApi.KODEVERK.makeRestApiRequest(),
  fetchFeatureToggles: fetchAllFeatureToggles,
  fetchShowDetailedErrorMessages: fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
