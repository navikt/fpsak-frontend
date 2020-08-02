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
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import { Fagsak } from '@fpsak-frontend/types';

import { useFpSakKodeverk } from '../../data/useKodeverk';
import useVisForhandsvisningAvMelding from '../../data/useVisForhandsvisningAvMelding';
import MessageBehandlingPaVentModal from './MessageBehandlingPaVentModal';
import {
  getBehandlingVersjon,
  getSelectedBehandlingId,
} from '../../behandling/duck';
import { setBehandlingOnHold } from '../../behandlingmenu/duck';
import {
  FpsakApiKeys, useRestApi, useRestApiRunner, requestApi,
} from '../../data/fpsakApiNyUtenRedux';

const NO_PARAM = {};

const getSubmitCallback = (setShowMessageModal, behandlingId, submitMessage, resetMessage, setShowSettPaVentModal, setSubmitCounter) => (values) => {
  const isInnhentEllerForlenget = values.brevmalkode === dokumentMalType.INNHENT_DOK
    || values.brevmalkode === dokumentMalType.FORLENGET_DOK
    || values.brevmalkode === dokumentMalType.FORLENGET_MEDL_DOK;

  setShowMessageModal(!isInnhentEllerForlenget);

  const data = {
    behandlingId,
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

const getPreviewCallback = (behandlingTypeKode, behandlingId, behandlingUuid, fagsakYtelseType, fetchPreview) => (
  mottaker, dokumentMal, fritekst, aarsakskode,
) => {
  const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandlingTypeKode || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;
  const data = erTilbakekreving ? {
    behandlingId,
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
  fagsak: Fagsak;
  alleBehandlinger: {}[];
}

interface StateProps {
  selectedBehandlingId: number;
  selectedBehandlingVersjon?: number;
}

interface DispatchProps {
  fetchPreview: (erTilbakekreving: boolean, erHenleggelse: boolean, data: any) => void;
  setBehandlingOnHold: (params: any) => void;
  push: (param: string) => void;
}

interface Brevmal {
  kode: string;
  navn: string;
  tilgjengelig: boolean;
}

const EMPTY_ARRAY = [];
const RECIPIENTS = ['Søker'];

/**
 * MessagesIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
const MessagesIndex: FunctionComponent<OwnProps & StateProps & DispatchProps> = ({
  fagsak,
  alleBehandlinger,
  selectedBehandlingId,
  push: pushLocation,
  selectedBehandlingVersjon,
  setBehandlingOnHold: setOnHold,
}) => {
  const [showSettPaVentModal, setShowSettPaVentModal] = useState(false);
  const [showMessagesModal, setShowMessageModal] = useState(false);
  const [submitCounter, setSubmitCounter] = useState(0);

  const behandling = alleBehandlinger.find((b) => b.id === selectedBehandlingId);
  const behandlingId = behandling.id;

  const ventearsaker = useFpSakKodeverk(kodeverkTyper.VENT_AARSAK) || EMPTY_ARRAY;
  const revurderingVarslingArsak = useFpSakKodeverk(kodeverkTyper.REVURDERING_VARSLING_ÅRSAK);

  const { startRequest: submitMessage, state: submitFinished, resetRequestData: resetMessageData } = useRestApiRunner(FpsakApiKeys.SUBMIT_MESSAGE);

  const resetMessage = () => {
    resetMessageData();

    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  const submitCallback = useCallback(getSubmitCallback(setShowMessageModal, behandlingId, submitMessage,
    resetMessage, setShowSettPaVentModal, setSubmitCounter),
  [behandlingId, selectedBehandlingVersjon]);

  const hideSettPaVentModal = useCallback(() => {
    setShowSettPaVentModal(false);
  }, []);

  const handleSubmitFromModal = useCallback((formValues) => {
    const values = {
      behandlingId,
      behandlingVersjon: selectedBehandlingVersjon,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    setOnHold(values);
    hideSettPaVentModal();
    pushLocation('/');
  }, [behandlingId, selectedBehandlingVersjon]);

  const fetchPreview = useVisForhandsvisningAvMelding();

  const previewCallback = useCallback(getPreviewCallback(behandling.type.kode, behandlingId, behandling.uuid, fagsak.sakstype, fetchPreview),
    [behandlingId, selectedBehandlingVersjon]);

  const afterSubmit = useCallback(() => {
    setShowMessageModal(false);
    return resetMessage();
  }, []);

  const skalHenteRevAp = requestApi.hasPath(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP);
  const { data: harApentKontrollerRevAp, state: stateRevAp } = useRestApi<boolean>(FpsakApiKeys.HAR_APENT_KONTROLLER_REVURDERING_AP, NO_PARAM, {
    updateTriggers: [behandlingId, selectedBehandlingVersjon, submitCounter],
    suspendRequest: !skalHenteRevAp,
  });

  const { data: brevmaler, state: stateBrevmaler } = useRestApi<Brevmal[]>(FpsakApiKeys.BREVMALER, NO_PARAM, {
    updateTriggers: [behandlingId, selectedBehandlingVersjon, submitCounter],
  });

  if (stateBrevmaler === RestApiState.LOADING || (skalHenteRevAp && stateRevAp === RestApiState.LOADING)) {
    return <LoadingPanel />;
  }

  return (
    <>
      {showMessagesModal && (
        <MessagesModalSakIndex showModal={submitFinished && showMessagesModal} closeEvent={afterSubmit} />
      )}

      <MeldingerSakIndex
        submitCallback={submitCallback}
        recipients={RECIPIENTS}
        sprakKode={behandling?.sprakkode}
        previewCallback={previewCallback}
        behandlingId={behandlingId}
        behandlingVersjon={selectedBehandlingVersjon}
        revurderingVarslingArsak={revurderingVarslingArsak}
        templates={brevmaler}
        isKontrollerRevurderingApOpen={harApentKontrollerRevAp}
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

const mapStateToProps = (state: any): StateProps => ({
  selectedBehandlingId: getSelectedBehandlingId(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
});

// @ts-ignore (Korleis fikse denne?)
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    push,
    setBehandlingOnHold,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesIndex);
