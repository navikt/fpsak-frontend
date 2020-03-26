import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';

import { Kodeverk } from '@fpsak-frontend/types';
import MessageBehandlingPaVentModal from './MessageBehandlingPaVentModal';
import DataFetcher from '../../app/DataFetcher';
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
import BehandlingIdentifier from '../../behandling/BehandlingIdentifier';
import {
  resetSubmitMessageActionCreator, submitMessageActionCreator,
} from './duck';

const revurderingData = [fpsakApi.HAR_APENT_KONTROLLER_REVURDERING_AP, fpsakApi.BREVMALER];
const meldingData = [fpsakApi.BREVMALER];

interface OwnProps {
  submitFinished?: boolean;
  behandlingIdentifier?: BehandlingIdentifier;
  behandlingUuid: string;
  fagsakYtelseType: Kodeverk;
  selectedBehandlingVersjon?: number;
  selectedBehandlingSprak?: Kodeverk;
  recipients?: string[];
  ventearsaker?: Kodeverk[];
  behandlingTypeKode: string;
  revurderingVarslingArsak: Kodeverk[];
}

interface DispatchProps {
  fetchPreview: (erTilbakekreving: boolean, erHenleggelse: boolean, data: {}) => void;
  submitMessage: (data: {}) => Promise<any>;
  setBehandlingOnHold: (params: {}) => void;
  push: (param: string) => void;
  resetSubmitMessage: () => void;
}

interface StateProps {
  showSettPaVentModal: boolean;
  showMessagesModal: boolean;
  submitCounter: number;
}

/**
 * MessagesIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
export class MessagesIndex extends Component<OwnProps & DispatchProps, StateProps> {
  static defaultProps = {
    submitFinished: false,
    ventearsaker: [],
    recipients: ['Søker'],
  };

  constructor(props) {
    super(props);
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
    setOnHold(values);
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
    fetchPreview(erTilbakekreving, false, data);
  }

  afterSubmit() {
    this.setState({
      showMessagesModal: false,
    });
    return this.resetMessage();
  }

  resetMessage() {
    const { resetSubmitMessage: resetMessage } = this.props;
    resetMessage();

    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
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
          <MessageBehandlingPaVentModal
            showModal={submitFinished && showSettPaVentModal}
            cancelEvent={this.hideSettPaVentModal}
            onSubmit={this.handleSubmitFromModal}
            ventearsak={venteArsakType.AVV_DOK}
            ventearsaker={ventearsaker}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state: any): OwnProps => ({
  submitFinished: fpsakApi.SUBMIT_MESSAGE.getRestApiFinished()(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  selectedBehandlingSprak: getBehandlingSprak(state),
  ventearsaker: getKodeverk(kodeverkTyper.VENT_AARSAK)(state),
  revurderingVarslingArsak: getKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK)(state),
  behandlingUuid: getBehandlingerUuidsMappedById(state)[getBehandlingIdentifier(state).behandlingId],
  behandlingTypeKode: getBehandlingerTypesMappedById(state)[getBehandlingIdentifier(state).behandlingId].kode,
  fagsakYtelseType: getFagsakYtelseType(state),
});

// @ts-ignore (Korleis fikse denne?)
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    push,
    setBehandlingOnHold,
    fetchPreview: previewMessage,
    submitMessage: submitMessageActionCreator,
    resetSubmitMessage: resetSubmitMessageActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesIndex);
