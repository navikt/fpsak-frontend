import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import fpLosApi from 'data/fpLosApi';
import LoadingPanel from 'sharedComponents/LoadingPanel';

type TsProps = Readonly<{
  finishedLoadingBlockers: boolean;
  children: ReactNode;
  fetchNavAnsatt: () => void;
  fetchLanguageFile: () => void;
  fetchKodeverk: () => void;
  fetchFpsakUrl: () => void;
  fetchFeatureToggles: () => void;
}>

class AppConfigResolver extends Component<TsProps> {
  static propTypes = {
    finishedLoadingBlockers: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    fetchNavAnsatt: PropTypes.func.isRequired,
    fetchLanguageFile: PropTypes.func.isRequired,
    fetchKodeverk: PropTypes.func.isRequired,
    fetchFpsakUrl: PropTypes.func.isRequired,
    fetchFeatureToggles: PropTypes.func.isRequired,
  };

  constructor(props: TsProps) {
    super(props);
    this.resolveAppConfig();
  }

  resolveAppConfig = () => {
    const {
      fetchNavAnsatt,
      fetchLanguageFile,
      fetchKodeverk,
      fetchFpsakUrl,
      fetchFeatureToggles,
    } = this.props;

    fetchNavAnsatt();
    fetchLanguageFile();
    fetchKodeverk();
    fetchFpsakUrl();
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

const mapStateToProps = (state: any) => {
  const blockers = [
    fpLosApi.NAV_ANSATT.getRestApiFinished()(state),
    fpLosApi.LANGUAGE_FILE.getRestApiFinished()(state),
    fpLosApi.KODEVERK.getRestApiFinished()(state),
    fpLosApi.FPSAK_URL.getRestApiFinished()(state),
    fpLosApi.FEATURE_TOGGLES.getRestApiFinished()(state),
  ];
  return {
    finishedLoadingBlockers: blockers.every(finished => finished),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchNavAnsatt: fpLosApi.NAV_ANSATT.makeRestApiRequest(),
  fetchLanguageFile: fpLosApi.LANGUAGE_FILE.makeRestApiRequest(),
  fetchKodeverk: fpLosApi.KODEVERK.makeRestApiRequest(),
  fetchFpsakUrl: fpLosApi.FPSAK_URL.makeRestApiRequest(),
  fetchFeatureToggles: fpLosApi.FEATURE_TOGGLES.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigResolver);
