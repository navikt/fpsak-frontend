import React, {
  FunctionComponent, useState, useCallback, useMemo,
} from 'react';
import { withRouter } from 'react-router-dom';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Location } from 'history';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { featureToggle } from '@fpsak-frontend/konstanter';
import {
  NavAnsatt, Kodeverk, KodeverkMedNavn, Fagsak,
} from '@fpsak-frontend/types';
import { requireProps, LoadingPanel } from '@fpsak-frontend/shared-components';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';

import BehandlingAppKontekst from '../../behandling/behandlingAppKontekstTsType';
import useVisForhandsvisningAvMelding from '../../data/useVisForhandsvisningAvMelding';
import { createLocationForSkjermlenke } from '../../app/paths';
import {
  getBehandlingVersjon,
  getSelectedBehandlingId,
} from '../../behandling/duck';
import {
  FpsakApiKeys, useRestApi, requestApi, useRestApiRunner, useGlobalStateRestApiData,
} from '../../data/fpsakApi';
import { useFpSakKodeverk, useFpTilbakeKodeverk } from '../../data/useKodeverk';
import BeslutterModalIndex from './BeslutterModalIndex';

const getArsaker = (approval) => ([{
  code: vurderPaNyttArsakType.FEIL_FAKTA,
  isSet: approval.feilFakta,
}, {
  code: vurderPaNyttArsakType.FEIL_LOV,
  isSet: approval.feilLov,
}, {
  code: vurderPaNyttArsakType.FEIL_REGEL,
  isSet: approval.feilRegel,
}, {
  code: vurderPaNyttArsakType.ANNET,
  isSet: approval.annet,
}].filter((arsak) => arsak.isSet)
  .map((arsak) => arsak.code)
);

const getOnSubmit = (erTilbakekreving, behandlingId, saksnummer, selectedBehandlingVersjon, setAllAksjonspunktApproved,
  setShowBeslutterModal, approveAp) => (values) => {
  const aksjonspunkter = values.approvals
    .map((context) => context.aksjonspunkter)
    .reduce((a, b) => a.concat(b));

  const aksjonspunktGodkjenningDtos = aksjonspunkter
    .map((toTrinnsAksjonspunkt) => ({
      aksjonspunktKode: toTrinnsAksjonspunkt.aksjonspunktKode,
      godkjent: toTrinnsAksjonspunkt.totrinnskontrollGodkjent,
      begrunnelse: toTrinnsAksjonspunkt.besluttersBegrunnelse,
      arsaker: getArsaker(toTrinnsAksjonspunkt),
    }));

  // TODO (TOR) Fjern hardkodinga av 5005
  const fatterVedtakAksjonspunktDto = {
    '@type': erTilbakekreving ? '5005' : aksjonspunktCodes.FATTER_VEDTAK,
    begrunnelse: null,
    aksjonspunktGodkjenningDtos,
  };
  const params = {
    behandlingId,
    saksnummer,
    behandlingVersjon: selectedBehandlingVersjon,
    bekreftedeAksjonspunktDtoer: [fatterVedtakAksjonspunktDto],
  };
  setAllAksjonspunktApproved(aksjonspunkter.every((ap) => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true));
  setShowBeslutterModal(true);
  return approveAp(params);
};

const NO_PARAM = {};

interface TotrinnsKlageVurdering {
  klageVurdering?: string;
  klageVurderingOmgjoer?: string;
  klageVurderingResultatNFP?: any;
  klageVurderingResultatNK?: any;
}

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  totrinnskontrollSkjermlenkeContext?: any[];
  totrinnskontrollReadOnlySkjermlenkeContext?: any[];
  selectedBehandlingVersjon?: number;
  push: (location: string) => void;
  location: Location;
  behandlingId?: number;
}

/**
 * ApprovalIndex
 *
 * Containerklass ansvarlig for att rita opp vilkår og aksjonspunkter med toTrinnskontroll
 */
const ApprovalIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger,
  totrinnskontrollSkjermlenkeContext,
  totrinnskontrollReadOnlySkjermlenkeContext,
  selectedBehandlingVersjon,
  push: pushLocation,
  location,
  behandlingId,
}) => {
  const [showBeslutterModal, setShowBeslutterModal] = useState(false);
  const [allAksjonspunktApproved, setAllAksjonspunktApproved] = useState(false);

  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);

  const behandlingTypeKode = behandling ? behandling.type.kode : undefined;
  const erTilbakekreving = BehandlingType.TILBAKEKREVING === behandlingTypeKode || BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode;

  const erBehandlingEtterKlage = useMemo(() => (behandling ? behandling.behandlingArsaker
    .map(({ behandlingArsakType }) => behandlingArsakType)
    .some((bt: Kodeverk) => bt.kode === klageBehandlingArsakType.ETTER_KLAGE || bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK
    || bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK) : false), [behandling]);

  const skjermlenkeTyperFpsak = useFpSakKodeverk(kodeverkTyper.SKJERMLENKE_TYPE);
  const skjermlenkeTyperFptilbake = useFpTilbakeKodeverk(kodeverkTyper.SKJERMLENKE_TYPE);
  const skjemalenkeTyper = erTilbakekreving ? skjermlenkeTyperFptilbake : skjermlenkeTyperFpsak;

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const { brukernavn, kanVeilede } = navAnsatt;

  const alleFpSakKodeverk = useGlobalStateRestApiData<{[key: string]: KodeverkMedNavn[]}>(FpsakApiKeys.KODEVERK);
  const alleFpTilbakeKodeverk = useGlobalStateRestApiData<{[key: string]: KodeverkMedNavn[]}>(FpsakApiKeys.KODEVERK_FPTILBAKE);

  const featureToggles = useGlobalStateRestApiData<{[key: string]: boolean}>(FpsakApiKeys.FEATURE_TOGGLE);
  const disableGodkjennKnapp = erTilbakekreving ? !featureToggles[featureToggle.BESLUTT_TILBAKEKREVING] : false;

  const { data: totrinnsKlageVurdering, state: totrinnsKlageVurderingState } = useRestApi<TotrinnsKlageVurdering>(
    FpsakApiKeys.TOTRINNS_KLAGE_VURDERING, NO_PARAM, {
      keepData: true,
      updateTriggers: [behandlingId, selectedBehandlingVersjon],
      suspendRequest: !requestApi.hasPath(FpsakApiKeys.TOTRINNS_KLAGE_VURDERING),
    },
  );

  const { startRequest: godkjennBehandling, state: stateGodkjennBehandling } = useRestApiRunner(FpsakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);

  const fetchPreview = useVisForhandsvisningAvMelding();

  const forhandsvisVedtaksbrev = useCallback(() => {
    fetchPreview(erTilbakekreving, false, {
      behandlingUuid: behandling.uuid,
      ytelseType: fagsak.sakstype,
      gjelderVedtak: true,
    });
  }, []);
  const onSubmit = useCallback(getOnSubmit(erTilbakekreving, behandlingId, fagsak.saksnummer, selectedBehandlingVersjon,
    setAllAksjonspunktApproved, setShowBeslutterModal, godkjennBehandling),
  [behandlingId, selectedBehandlingVersjon]);

  if (!totrinnskontrollSkjermlenkeContext && !totrinnskontrollReadOnlySkjermlenkeContext) {
    return null;
  }

  if (totrinnsKlageVurderingState === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  return (
    <>
      <TotrinnskontrollSakIndex
        behandlingId={behandlingId}
        behandlingVersjon={selectedBehandlingVersjon}
        behandlingsresultat={behandling?.behandlingsresultat}
        behandlingStatus={behandling?.status}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollReadOnlySkjermlenkeContext}
        location={location}
        readOnly={brukernavn === behandling?.ansvarligSaksbehandler || kanVeilede}
        onSubmit={onSubmit}
        forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
        toTrinnsBehandling={behandling ? behandling.toTrinnsBehandling : false}
        skjemalenkeTyper={skjemalenkeTyper}
        isForeldrepengerFagsak={fagsak.sakstype.kode === fagsakYtelseType.FORELDREPENGER}
        alleKodeverk={erTilbakekreving ? alleFpSakKodeverk : alleFpTilbakeKodeverk}
        behandlingKlageVurdering={totrinnsKlageVurdering}
        erBehandlingEtterKlage={erBehandlingEtterKlage}
        disableGodkjennKnapp={disableGodkjennKnapp}
        erTilbakekreving={erTilbakekreving}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
      {showBeslutterModal && (
        <BeslutterModalIndex
          erGodkjenningFerdig={stateGodkjennBehandling === RestApiState.SUCCESS}
          selectedBehandlingVersjon={selectedBehandlingVersjon}
          fagsakYtelseType={fagsak.sakstype}
          behandlingsresultat={behandling?.behandlingsresultat}
          behandlingId={behandlingId}
          behandlingTypeKode={behandlingTypeKode}
          pushLocation={pushLocation}
          allAksjonspunktApproved={allAksjonspunktApproved}
          behandlingStatus={behandling?.status}
          totrinnsKlageVurdering={totrinnsKlageVurdering}
        />
      )}
    </>
  );
};

const mapStateToPropsFactory = () => (state) => ({
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  location: state.router.location,
  behandlingId: getSelectedBehandlingId(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
  }, dispatch),
});

const comp = requireProps(['behandlingId', 'selectedBehandlingVersjon'])(ApprovalIndex);
export default withRouter<any, FunctionComponent<OwnProps>>(connect(mapStateToPropsFactory, mapDispatchToProps)(comp));
