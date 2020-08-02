import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import { Kodeverk, NavAnsatt, Fagsak } from '@fpsak-frontend/types';
import MenyEndreBehandlendeEnhetIndex, { skalViseIMeny, getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
import MenyVergeIndex, { getMenytekst as getVergeMenytekst } from '@fpsak-frontend/sak-meny-verge';
import MenyTaAvVentIndex, { skalViseIMeny as skalViseTaAvVentIMeny, getMenytekst as getTaAvVentMenytekst } from '@fpsak-frontend/sak-meny-ta-av-vent';
import MenySettPaVentIndex, { skalViseIMeny as skalViseSettPaVentIMeny, getMenytekst as getSettPaVentMenytekst } from '@fpsak-frontend/sak-meny-sett-pa-vent';
import MenyHenleggIndex, { skalViseIMeny as skalViseHenleggIMeny, getMenytekst as getHenleggMenytekst } from '@fpsak-frontend/sak-meny-henlegg';
import MenyApneForEndringerIndex, {
  skalViseIMeny as skalViseApneForEndringerIMeny,
  getMenytekst as getApneForEndringerMenytekst,
}
  from '@fpsak-frontend/sak-meny-apne-for-endringer';
import MenyNyBehandlingIndex, {
  skalViseIMeny as skalViseNyBehandlingIMeny,
  getMenytekst as getNyBehandlingMenytekst,
} from '@fpsak-frontend/sak-meny-ny-behandling';

import useVisForhandsvisningAvMelding from '../data/useVisForhandsvisningAvMelding';
import { FpsakApiKeys, useRestApiRunner } from '../data/fpsakApiNyUtenRedux';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import ApplicationContextPath from '../app/ApplicationContextPath';
import { allMenuAccessRights } from './accessMenu';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling, setBehandlingOnHold, openBehandlingForChanges,
} from './duck';
import MenyKodeverk from './MenyKodeverk';
import Rettigheter from './rettigheterTsType';

const BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES = [
  BehandlingType.FORSTEGANGSSOKNAD,
  BehandlingType.KLAGE,
  BehandlingType.REVURDERING,
  BehandlingType.DOKUMENTINNSYN,
  BehandlingType.ANKE,
  BehandlingType.TILBAKEKREVING,
  BehandlingType.TILBAKEKREVING_REVURDERING,
];

const getUuidForSisteLukkedeForsteEllerRevurd = (behandlinger = []) => {
  const behandling = behandlinger.find((b) => b.gjeldendeVedtak && b.status.kode === BehandlingStatus.AVSLUTTET
    && (b.type.kode === BehandlingType.FORSTEGANGSSOKNAD || b.type.kode === BehandlingType.REVURDERING));
  return behandling ? behandling.uuid : undefined;
};

type BehandlendeEnheter = {
  enhetId: string;
  enhetNavn: string;
}[];

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: {}[];
  saksnummer: number;
  behandlingId?: number;
  behandlingVersion?: number;
  behandlingType: Kodeverk;
  fjernVerge: () => void;
  opprettVerge: () => void;
  erTilbakekrevingAktivert: boolean;
  pushLocation: (location: string) => void;
  menyhandlingRettigheter?: { harSoknad: boolean }
}

interface DispatchProps {
  lagNyBehandling: (saksnummer: string, behandlingId: number, behandlingVersion: number, isTilbakekreving: boolean, params: any) => void;
}

type Props = OwnProps & DispatchProps;

export const BehandlingMenuIndex: FunctionComponent<Props> = ({
  fagsak,
  alleBehandlinger = [],
  saksnummer,
  behandlingId,
  behandlingVersion,
  behandlingType,
  fjernVerge,
  opprettVerge,
  lagNyBehandling,
  pushLocation,
  menyhandlingRettigheter,
}) => {
  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);
  const uuid = behandling?.uuid;
  const uuidForSistLukkede = getUuidForSisteLukkedeForsteEllerRevurd(alleBehandlinger);

  const erPapirsoknad = behandling?.erAktivPapirsoknad;
  const kanHenlegge = behandling ? behandling.kanHenleggeBehandling : false;
  const erKoet = behandling ? behandling.behandlingKoet : false;
  const erPaVent = behandling ? behandling.behandlingPaaVent : false;

  const {
    startRequest: sjekkTilbakeKanOpprettes, data: kanBehandlingOpprettes = false,
  } = useRestApiRunner<boolean>(FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES);
  const {
    startRequest: sjekkTilbakeRevurdKanOpprettes, data: kanRevurderingOpprettes = false,
  } = useRestApiRunner<boolean>(FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES);

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo<Rettigheter>(() => allMenuAccessRights(navAnsatt, fagsak.status, kanRevurderingOpprettes, fagsak.skalBehandlesAvInfotrygd,
    fagsak.sakstype, behandling?.status, menyhandlingRettigheter ? menyhandlingRettigheter.harSoknad : false, erPapirsoknad, behandlingType),
  [behandlingId, behandlingVersion]);

  const behandlendeEnheter = useGlobalStateRestApiData<BehandlendeEnheter>(FpsakApiKeys.BEHANDLENDE_ENHETER);

  const erTilbakekrevingAktivert = useGetEnabledApplikasjonContext()[ApplicationContextPath.FPTILBAKE];

  const alleFpSakKodeverk = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.KODEVERK);
  const alleFpTilbakeKodeverk = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.KODEVERK_FPTILBAKE);
  const menyKodeverk = new MenyKodeverk(behandlingType)
    .medFpSakKodeverk(alleFpSakKodeverk)
    .medFpTilbakeKodeverk(alleFpTilbakeKodeverk);

  const gaaTilSokeside = useCallback(() => pushLocation('/'), [pushLocation]);

  const previewHenleggBehandling = useVisForhandsvisningAvMelding();

  if ((!rettigheter.settBehandlingPaVentAccess.employeeHasAccess
    && !rettigheter.henleggBehandlingAccess.employeeHasAccess
    && !rettigheter.byttBehandlendeEnhetAccess.employeeHasAccess
    && !rettigheter.opprettRevurderingAccess.employeeHasAccess
    && !rettigheter.opprettNyForstegangsBehandlingAccess.employeeHasAccess
    && !rettigheter.gjenopptaBehandlingAccess.employeeHasAccess) || navAnsatt.kanVeilede) {
    return null;
  }

  return (
    <MenySakIndex
      data={[
        new MenyData(skalViseTaAvVentIMeny(behandlingId, erPaVent, erKoet, rettigheter.gjenopptaBehandlingAccess), getTaAvVentMenytekst())
          .medModal((lukkModal) => (
            <MenyTaAvVentIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              taBehandlingAvVent={resumeBehandling}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(skalViseSettPaVentIMeny(behandlingId, erPaVent, erKoet, rettigheter.settBehandlingPaVentAccess), getSettPaVentMenytekst())
          .medModal((lukkModal) => (
            <MenySettPaVentIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              settBehandlingPaVent={setBehandlingOnHold}
              ventearsaker={menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.VENT_AARSAK)}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(skalViseHenleggIMeny(behandlingId, behandlingType, kanHenlegge, rettigheter.henleggBehandlingAccess), getHenleggMenytekst())
          .medModal((lukkModal) => (
            <MenyHenleggIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              forhandsvisHenleggBehandling={previewHenleggBehandling}
              henleggBehandling={shelveBehandling}
              ytelseType={fagsak.sakstype}
              behandlingType={behandlingType}
              behandlingUuid={uuid}
              behandlingResultatTyper={menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.BEHANDLING_RESULTAT_TYPE)}
              lukkModal={lukkModal}
              gaaTilSokeside={gaaTilSokeside}
            />
          )),
        new MenyData(skalViseIMeny(behandlingId, behandlendeEnheter, erKoet, rettigheter.byttBehandlendeEnhetAccess), getMenytekst())
          .medModal((lukkModal) => (
            <MenyEndreBehandlendeEnhetIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              behandlendeEnhetId={behandling?.behandlendeEnhetId}
              behandlendeEnhetNavn={behandling?.behandlendeEnhetNavn}
              nyBehandlendeEnhet={nyBehandlendeEnhet}
              behandlendeEnheter={behandlendeEnheter}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(skalViseApneForEndringerIMeny(behandlingId, erPaVent, erKoet, rettigheter.opneBehandlingForEndringerAccess),
          getApneForEndringerMenytekst())
          .medModal((lukkModal) => (
            <MenyApneForEndringerIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              apneBehandlingForEndringer={openBehandlingForChanges}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(skalViseNyBehandlingIMeny(erKoet, rettigheter.ikkeVisOpprettNyBehandling), getNyBehandlingMenytekst())
          .medModal((lukkModal) => (
            <MenyNyBehandlingIndex
              saksnummer={saksnummer}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              behandlingType={behandlingType}
              uuidForSistLukkede={uuidForSistLukkede}
              opprettNyForstegangsBehandlingEnabled={rettigheter.opprettNyForstegangsBehandlingAccess.employeeHasAccess
                  && !!rettigheter.opprettNyForstegangsBehandlingAccess.isEnabled}
              opprettRevurderingEnabled={rettigheter.opprettRevurderingAccess.employeeHasAccess && rettigheter.opprettRevurderingAccess.isEnabled}
              kanTilbakekrevingOpprettes={{
                kanBehandlingOpprettes,
                kanRevurderingOpprettes,
              }}
              erTilbakekrevingAktivert={erTilbakekrevingAktivert}
              behandlingstyper={menyKodeverk
                .getKodeverkForBehandlingstyper(BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES, kodeverkTyper.BEHANDLING_TYPE)}
              tilbakekrevingRevurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(BehandlingType.TILBAKEKREVING_REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
              revurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(BehandlingType.REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
              ytelseType={fagsak.sakstype}
              lagNyBehandling={lagNyBehandling}
              sjekkOmTilbakekrevingKanOpprettes={sjekkTilbakeKanOpprettes}
              sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkTilbakeRevurdKanOpprettes}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(!!opprettVerge || !!fjernVerge, getVergeMenytekst(!!opprettVerge))
          .medModal((lukkModal) => (
            <MenyVergeIndex
              fjernVerge={fjernVerge}
              opprettVerge={opprettVerge}
              lukkModal={lukkModal}
            />
          )),
      ]}
    />
  );
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch, { location, pushLocation }): DispatchProps => bindActionCreators({
  lagNyBehandling: createNewBehandling(location, pushLocation),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex);
