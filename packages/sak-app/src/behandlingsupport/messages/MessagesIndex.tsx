import React, { FunctionComponent, useState, useCallback } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MeldingerSakIndex, { MessagesModalSakIndex } from '@fpsak-frontend/sak-meldinger';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';

import { Kodeverk } from '@fpsak-frontend/types';
import { useFpSakKodeverk } from '../../data/useKodeverk';
import MessageBehandlingPaVentModal from './MessageBehandlingPaVentModal';
import { getFagsakYtelseType } from '../../fagsak/fagsakSelectors';
import { getBehandlingerUuidsMappedById, getBehandlingerTypesMappedById } from '../../behandling/selectors/behandlingerSelectors';
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

const getSubmitCallback = (setShowMessageModal, behandlingIdentifier, submitMessage, resetMessage, setShowSettPaVentModal, setSubmitCounter) => (values) => {
  const isInnhentEllerForlenget = values.brevmalkode === dokumentMalType.INNHENT_DOK
    || values.brevmalkode === dokumentMalType.FORLENGET_DOK
    || values.brevmalkode === dokumentMalType.FORLENGET_MEDL_DOK;

  setShowMessageModal(!isInnhentEllerForlenget);

  const data = {
    behandlingId: behandlingIdentifier.behandlingId,
    mottaker: values.mottaker,
    brevmalkode: values.brevmalkode,
    fritekst: values.fritekst,
    arsakskode: values.arsakskode,
  };

  return submitMessage(data)
    .then(() => resetMessage())
    .then(() => {
      setShowSettPaVentModal(isInnhentEllerForlenget);
      setSubmitCounter((prevValue) => prevValue + 1);
    });
};

const getPreviewCallback = (behandlingTypeKode, behandlingIdentifier, behandlingUuid, fagsakYtelseType, fetchPreview) => (
  mottaker, dokumentMal, fritekst, aarsakskode,
) => {
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
};

interface OwnProps {
  submitFinished?: boolean;
  behandlingIdentifier?: BehandlingIdentifier;
  behandlingUuid: string;
  fagsakYtelseType: Kodeverk;
  selectedBehandlingVersjon?: number;
  selectedBehandlingSprak?: Kodeverk;
  recipients?: string[];
  behandlingTypeKode: string;
}

interface DispatchProps {
  fetchPreview: (erTilbakekreving: boolean, erHenleggelse: boolean, data: any) => void;
  submitMessage: (data: any) => Promise<any>;
  setBehandlingOnHold: (params: any) => void;
  push: (param: string) => void;
  resetSubmitMessage: () => void;
}

interface StateProps {
  showSettPaVentModal: boolean;
  showMessagesModal: boolean;
  submitCounter: number;
}

interface DataProps {
  brevmaler?: {
    kode: string;
    navn: string;
    tilgjengelig: boolean;
  }[];
  harApentKontrollerRevurderingAp?: boolean;
}

const EMPTY_ARRAY = [];

/**
 * MessagesIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
const MessagesIndex: FunctionComponent<OwnProps & DispatchProps> = ({
  submitFinished = false,
  recipients = ['Søker'],
  behandlingIdentifier,
  submitMessage,
  push: pushLocation,
  selectedBehandlingVersjon,
  setBehandlingOnHold: setOnHold,
  behandlingUuid,
  fagsakYtelseType,
  fetchPreview,
  behandlingTypeKode,
  resetSubmitMessage,
  selectedBehandlingSprak,
}) => {
  const [showSettPaVentModal, setShowSettPaVentModal] = useState(false);
  const [showMessagesModal, setShowMessageModal] = useState(false);
  const [submitCounter, setSubmitCounter] = useState(0);

  const ventearsaker = useFpSakKodeverk(kodeverkTyper.VENT_AARSAK) || EMPTY_ARRAY;
  const revurderingVarslingArsak = useFpSakKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK);

  const resetMessage = () => {
    resetSubmitMessage();

    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  const submitCallback = useCallback(getSubmitCallback(setShowMessageModal, behandlingIdentifier, submitMessage,
    resetMessage, setShowSettPaVentModal, setSubmitCounter),
  [behandlingIdentifier.behandlingId, selectedBehandlingVersjon]);

  const hideSettPaVentModal = useCallback(() => {
    setShowSettPaVentModal(false);
  }, []);

  const handleSubmitFromModal = useCallback((formValues) => {
    const values = {
      behandlingId: behandlingIdentifier.behandlingId,
      behandlingVersjon: selectedBehandlingVersjon,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    setOnHold(values);
    hideSettPaVentModal();
    pushLocation('/');
  }, [behandlingIdentifier.behandlingId, selectedBehandlingVersjon]);

  const previewCallback = useCallback(getPreviewCallback(behandlingTypeKode, behandlingIdentifier, behandlingUuid, fagsakYtelseType, fetchPreview),
    [behandlingIdentifier.behandlingId, selectedBehandlingVersjon]);

  const afterSubmit = useCallback(() => {
    setShowMessageModal(false);
    return resetMessage();
  }, []);

  return (
    <>
      {showMessagesModal && (
        <MessagesModalSakIndex showModal={submitFinished && showMessagesModal} closeEvent={afterSubmit} />
      )}

      <DataFetcher
        fetchingTriggers={new DataFetcherTriggers({
          behandlingId: behandlingIdentifier.behandlingId,
          behandlingVersion: selectedBehandlingVersjon,
          submitCounter,
        }, true)}
        key={fpsakApi.HAR_APENT_KONTROLLER_REVURDERING_AP.isEndpointEnabled() ? 0 : 1}
        endpoints={fpsakApi.HAR_APENT_KONTROLLER_REVURDERING_AP.isEndpointEnabled() ? revurderingData : meldingData}
        loadingPanel={<LoadingPanel />}
        render={(props: DataProps) => (
          <MeldingerSakIndex
            submitCallback={submitCallback}
            recipients={recipients}
            sprakKode={selectedBehandlingSprak}
            previewCallback={previewCallback}
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
          cancelEvent={hideSettPaVentModal}
          onSubmit={handleSubmitFromModal}
          ventearsak={venteArsakType.AVV_DOK}
          ventearsaker={ventearsaker}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any): OwnProps => ({
  submitFinished: fpsakApi.SUBMIT_MESSAGE.getRestApiFinished()(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  selectedBehandlingSprak: getBehandlingSprak(state),
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
