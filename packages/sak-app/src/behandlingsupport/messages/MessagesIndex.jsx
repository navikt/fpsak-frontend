import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';
import { DataFetcher, BehandlingIdentifier, SettBehandlingPaVentForm } from '@fpsak-frontend/fp-felles';

import { getFagsakYtelseType } from '../../fagsak/fagsakSelectors';
import { getBehandlingerUuidsMappedById, getBehandlingerTypesMappedById } from '../../behandling/selectors/behandlingerSelectors';
import { getKodeverk } from '../../kodeverk/duck';
import {
  getBehandlingSprak,
  getBehandlingVersjon,
  getBehandlingIdentifier,
  previewMessage,
} from '../../behandling/duck';
import { setBehandlingOnHold } from '../../behandlingmenu/duck';
import fpsakApi from '../../data/fpsakApi';
import {
  resetSubmitMessageActionCreator, submitMessageActionCreator,
} from './duck';

const revurderingData = [fpsakApi.HAR_APENT_KONTROLLER_REVURDERING_AP, fpsakApi.BREVMALER];
const meldingData = [fpsakApi.BREVMALER];

/**
 * MessagesIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
export class MessagesIndex extends Component {
  constructor() {
    super();
    this.submitCallback = this.submitCallback.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
    this.afterSubmit = this.afterSubmit.bind(this);
    this.hideSettPaVentModal = this.hideSettPaVentModal.bind(this);
    this.handleSubmitFromModal = this.handleSubmitFromModal.bind(this);
    this.state = { showSettPaVentModal: false, showMessagesModal: false, submitCounter: 0 };
  }

  submitCallback(values) {
    const { behandlingIdentifier, submitMessage } = this.props;
    const { submitCounter } = this.state;

    const isInnhentEllerForlenget = values.brevmalkode === dokumentMalType.INNHENT_DOK
      || values.brevmalkode === dokumentMalType.FORLENGET_DOK
      || values.brevmalkode === dokumentMalType.FORLENGET_MEDL_DOK;

    this.setState({ showMessagesModal: !isInnhentEllerForlenget });

    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      mottaker: values.mottaker,
      brevmalkode: values.brevmalkode,
      fritekst: values.fritekst,
      arsakskode: values.arsakskode,
    };

    return submitMessage(data)
      .then(() => this.resetMessage())
      .then(() => this.setState({
        showSettPaVentModal: isInnhentEllerForlenget,
        submitCounter: submitCounter + 1,
      }));
  }

  handleSubmitFromModal(formValues) {
    const { behandlingIdentifier, selectedBehandlingVersjon, setBehandlingOnHold: setOnHold } = this.props;
    const values = {
      behandlingId: behandlingIdentifier.behandlingId,
      behandlingVersjon: selectedBehandlingVersjon,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    setOnHold(values, behandlingIdentifier);
    this.hideSettPaVentModal();
    this.goToSearchPage();
  }

  hideSettPaVentModal() {
    this.setState({ showSettPaVentModal: false });
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  previewCallback(mottaker, dokumentMal, fritekst, aarsakskode) {
    const {
      behandlingUuid, fagsakYtelseType, fetchPreview, behandlingTypeKode, behandlingIdentifier,
    } = this.props;
    const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandlingTypeKode || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
    const data = erTilbakekreving ? {
      behandlingId: behandlingIdentifier.behandlingId,
      fritekst: fritekst || ' ',
      brevmalkode: dokumentMal,
    } : {
      behandlingUuid,
      ytelseType: fagsakYtelseType,
      fritekst: fritekst || ' ',
      arsakskode: aarsakskode || null,
      mottaker,
      dokumentMal,
    };
    fetchPreview(erTilbakekreving, data);
  }

  afterSubmit() {
    this.setState({
      showMessagesModal: false,
    });
    return this.resetMessage();
  }

  resetMessage() {
    const { resetSubmitMessage: resetMessage } = this.props;
    return resetMessage();
  }

  render() {
    const {
      recipients,
      submitFinished,
      selectedBehandlingSprak,
      ventearsaker,
      behandlingIdentifier,
      selectedBehandlingVersjon,
      revurderingVarslingArsak,
    } = this.props;
    const { showMessagesModal, showSettPaVentModal, submitCounter } = this.state;

    return (
      <>
        {showMessagesModal && (
          <MessagesModalSakIndex showModal={submitFinished && showMessagesModal} closeEvent={this.afterSubmit} />
        )}

        <DataFetcher
          behandlingId={behandlingIdentifier.behandlingId}
          behandlingVersjon={selectedBehandlingVersjon}
          valueThatWillTriggerRefetchWhenChanged={submitCounter}
          showLoadingIcon
          endpoints={fpsakApi.HAR_APENT_KONTROLLER_REVURDERING_AP.isEndpointEnabled() ? revurderingData : meldingData}
          render={(props) => (
            <MeldingerSakIndex
              submitCallback={this.submitCallback}
              recipients={recipients}
              sprakKode={selectedBehandlingSprak}
              previewCallback={this.previewCallback}
              behandlingId={behandlingIdentifier.behandlingId}
              behandlingVersjon={selectedBehandlingVersjon}
              revurderingVarslingArsak={revurderingVarslingArsak}
              templates={props.brevmaler}
              isKontrollerRevurderingApOpen={props.harApentKontrollerRevurderingAp}
            />
          )}
        />

        {submitFinished && showSettPaVentModal && (
          <SettBehandlingPaVentForm
            showModal={submitFinished && showSettPaVentModal}
            cancelEvent={this.hideSettPaVentModal}
            comment={<Normaltekst><FormattedMessage id="Messages.BrevErBestilt" /></Normaltekst>}
            onSubmit={this.handleSubmitFromModal}
            ventearsak={venteArsakType.AVV_DOK}
            hasManualPaVent
            ventearsaker={ventearsaker}
          />
        )}
      </>
    );
  }
}

MessagesIndex.propTypes = {
  submitFinished: PropTypes.bool,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingUuid: PropTypes.string.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  selectedBehandlingVersjon: PropTypes.number,
  selectedBehandlingSprak: PropTypes.shape(),
  recipients: PropTypes.arrayOf(PropTypes.string),
  fetchPreview: PropTypes.func.isRequired,
  submitMessage: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  resetSubmitMessage: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  ventearsaker: PropTypes.arrayOf(kodeverkObjektPropType),
  behandlingTypeKode: PropTypes.string.isRequired,
  revurderingVarslingArsak: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
};

MessagesIndex.defaultProps = {
  submitFinished: false,
  behandlingIdentifier: undefined,
  selectedBehandlingVersjon: undefined,
  selectedBehandlingSprak: undefined,
  ventearsaker: [],
  recipients: ['Søker'],
};

const mapStateToProps = (state) => ({
  submitFinished: fpsakApi.SUBMIT_MESSAGE.getRestApiFinished()(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  selectedBehandlingSprak: getBehandlingSprak(state),
  ventearsaker: getKodeverk(kodeverkTyper.VENT_AARSAK)(state),
  revurderingVarslingArsak: getKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK)(state),
  behandlingUuid: getBehandlingerUuidsMappedById(state)[getBehandlingIdentifier(state).behandlingId],
  behandlingTypeKode: getBehandlingerTypesMappedById(state)[getBehandlingIdentifier(state).behandlingId],
  fagsakYtelseType: getFagsakYtelseType(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    setBehandlingOnHold,
    fetchPreview: previewMessage,
    submitMessage: submitMessageActionCreator,
    resetSubmitMessage: resetSubmitMessageActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesIndex);
