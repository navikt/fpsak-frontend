import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { withBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import IverksetterVedtakStatusModal from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/IverksetterVedtakStatusModal';
import { getBehandlingIdentifier } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import {
 setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn, fetchVedtaksbrevPreview, fetchFptilbakePreviewBrev as fetchFptilbakePreview,
} from './duckBpForstegangOgRev';

import BehandlingspunktInfoPanel from './components/BehandlingspunktInfoPanel';

const hasRevurderingAp = apModels => (
  apModels.some(apValue => (
    (apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL || apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apValue.sendVarsel
  ))
);

/**
 * BehandlingsprosessForstegangOgRevIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Førstegangsbehandling eller Revurdering.
 */
export class BehandlingsprosessForstegangOgRevIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIverksetterVedtakModal: false,
    };
  }

  previewFptilbakeCallback = (mottaker, brevmalkode, fritekst, saksnummer) => {
    const { behandlingIdentifier, fetchFptilbakePreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      varseltekst: fritekst || '',
      mottaker,
      brevmalkode,
      saksnummer,
    };
    fetchBrevPreview(data);
  }

  previewVedtakCallback = (fritekst) => {
    const { behandlingIdentifier, fetchVedtaksbrevPreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      fritekst: fritekst || '',
      skalBrukeOverstyrendeFritekstBrev: false,
    };
    fetchBrevPreview(data);
  }

  previewManueltBrevCallback = (values) => {
    const { behandlingIdentifier, fetchVedtaksbrevPreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      ...values,
    };
    fetchBrevPreview(data);
  }

  submit = (aksjonspunktModels) => {
    const { submitCallback, goToDefaultPage, goToSearchPage } = this.props;

    const submitIsRevurdering = hasRevurderingAp(aksjonspunktModels);
    const shouldUpdateInfo = !submitIsRevurdering;

    const afterAksjonspunktSubmit = () => {
      const showModal = aksjonspunktModels[0].isVedtakSubmission && aksjonspunktModels[0].kode === aksjonspunktCodes.FATTER_VEDTAK;
      if (showModal) {
        this.setState(prevState => ({ ...prevState, showIverksetterVedtakModal: true }));
      } else if (submitIsRevurdering) {
        goToSearchPage();
      } else {
        goToDefaultPage();
      }
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, shouldUpdateInfo);
  }

  render = () => {
    const {
      previewCallback,
      selectedBehandlingspunkt,
      goToSearchPage,
      dispatchSubmitFailed: submitFailedDispatch,
    } = this.props;
    const {
      showIverksetterVedtakModal,
    } = this.state;

    return (
      <>
        <BehandlingspunktInfoPanel
          submitCallback={this.submit}
          previewCallback={previewCallback}
          previewVedtakCallback={this.previewVedtakCallback}
          previewManueltBrevCallback={this.previewManueltBrevCallback}
          previewFptilbakeCallback={this.previewFptilbakeCallback}
          dispatchSubmitFailed={submitFailedDispatch}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
        />
        <IverksetterVedtakStatusModal
          closeEvent={goToSearchPage}
          isVedtakSubmission={showIverksetterVedtakModal}
        />
      </>
    );
  }
}

BehandlingsprosessForstegangOgRevIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  goToDefaultPage: PropTypes.func.isRequired,
  goToSearchPage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  fetchFptilbakePreview: PropTypes.func.isRequired,
  fetchVedtaksbrevPreview: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    dispatchSubmitFailed,
    fetchVedtaksbrevPreview,
    fetchFptilbakePreview,
  }, dispatch),
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessForstegangOgRevIndex);
export default withBehandlingsprosessIndex(setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn)(connectedComponent);
