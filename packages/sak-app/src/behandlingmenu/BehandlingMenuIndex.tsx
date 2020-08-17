import React, {
  FunctionComponent, useCallback, useMemo, useEffect, useRef,
} from 'react';
import { Location } from 'history';
import moment from 'moment';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import { NavAnsatt, Fagsak } from '@fpsak-frontend/types';
import MenyEndreBehandlendeEnhetIndex, { skalViseIMeny, getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
import MenyVergeIndex, { getMenytekst as getVergeMenytekst } from '@fpsak-frontend/sak-meny-verge';
import MenyTaAvVentIndex, { skalViseIMeny as skalViseTaAvVentIMeny, getMenytekst as getTaAvVentMenytekst } from '@fpsak-frontend/sak-meny-ta-av-vent';
import MenySettPaVentIndex, { skalViseIMeny as skalViseSettPaVentIMeny, getMenytekst as getSettPaVentMenytekst } from '@fpsak-frontend/sak-meny-sett-pa-vent';
import MenyHenleggIndex, { skalViseIMeny as skalViseHenleggIMeny, getMenytekst as getHenleggMenytekst } from '@fpsak-frontend/sak-meny-henlegg';
import MenyApneForEndringerIndex, {
  skalViseIMeny as skalViseApneForEndringerIMeny,
  getMenytekst as getApneForEndringerMenytekst,
} from '@fpsak-frontend/sak-meny-apne-for-endringer';
import MenyNyBehandlingIndex, {
  skalViseIMeny as skalViseNyBehandlingIMeny,
  getMenytekst as getNyBehandlingMenytekst,
} from '@fpsak-frontend/sak-meny-ny-behandling';

import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';
import { getLocationWithDefaultProsessStegAndFakta, pathToBehandling } from '../app/paths';
import useVisForhandsvisningAvMelding from '../data/useVisForhandsvisningAvMelding';
import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';
import useGetEnabledApplikasjonContext from '../app/useGetEnabledApplikasjonContext';
import ApplicationContextPath from '../app/ApplicationContextPath';
import { allMenuAccessRights } from './accessMenu';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, setBehandlingOnHold, openBehandlingForChanges,
} from './behandlingMenuOperations';
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

const findNewBehandlingId = (alleBehandlinger) => {
  const sortedBehandlinger = alleBehandlinger
    .sort((b1, b2) => moment(b2.opprettet).diff(moment(b1.opprettet)));
  return sortedBehandlinger[0].id;
};

const getUuidForSisteLukkedeForsteEllerRevurd = (behandlinger = []) => {
  const behandling = behandlinger.find((b) => b.gjeldendeVedtak && b.status.kode === BehandlingStatus.AVSLUTTET
    && (b.type.kode === BehandlingType.FORSTEGANGSSOKNAD || b.type.kode === BehandlingType.REVURDERING));
  return behandling ? behandling.uuid : undefined;
};

const EMPTY_ARRAY = [];

type BehandlendeEnheter = {
  enhetId: string;
  enhetNavn: string;
}[];

interface OwnProps {
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  saksnummer: number;
  behandlingId?: number;
  behandlingVersion?: number;
  fjernVerge: () => void;
  opprettVerge: () => void;
  pushLocation: (location: Location | string) => void;
  location: Location;
  menyhandlingRettigheter?: { harSoknad: boolean }
  oppfriskBehandlinger: () => void;
}

export const BehandlingMenuIndex: FunctionComponent<OwnProps> = ({
  fagsak,
  alleBehandlinger = EMPTY_ARRAY,
  saksnummer,
  behandlingId,
  behandlingVersion,
  fjernVerge,
  opprettVerge,
  pushLocation,
  location,
  menyhandlingRettigheter,
  oppfriskBehandlinger,
}) => {
  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);

  const ref = useRef<number>();
  useEffect(() => {
    // Når antallet har endret seg er det laget en ny behandling og denne må da velges
    if (ref.current > 0) {
      const pathname = pathToBehandling(saksnummer, findNewBehandlingId(alleBehandlinger));
      pushLocation(getLocationWithDefaultProsessStegAndFakta({ ...location, pathname }));
    }

    ref.current = alleBehandlinger.length;
  }, [alleBehandlinger.length]);

  const {
    startRequest: sjekkTilbakeKanOpprettes, data: kanBehandlingOpprettes = false,
  } = restApiHooks.useRestApiRunner<boolean>(FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES);
  const {
    startRequest: sjekkTilbakeRevurdKanOpprettes, data: kanRevurderingOpprettes = false,
  } = restApiHooks.useRestApiRunner<boolean>(FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES);

  const navAnsatt = restApiHooks.useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo<Rettigheter>(() => allMenuAccessRights(
    navAnsatt,
    fagsak.status,
    kanRevurderingOpprettes,
    fagsak.skalBehandlesAvInfotrygd,
    fagsak.sakstype,
    behandling?.status,
    menyhandlingRettigheter ? menyhandlingRettigheter.harSoknad : false,
    behandling?.erAktivPapirsoknad,
    behandling?.type,
  ), [behandlingId, behandlingVersion]);

  const behandlendeEnheter = useGlobalStateRestApiData<BehandlendeEnheter>(FpsakApiKeys.BEHANDLENDE_ENHETER);

  const erTilbakekrevingAktivert = useGetEnabledApplikasjonContext()[ApplicationContextPath.FPTILBAKE];

  const alleFpSakKodeverk = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.KODEVERK);
  const alleFpTilbakeKodeverk = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.KODEVERK_FPTILBAKE);
  const menyKodeverk = new MenyKodeverk(behandling?.type)
    .medFpSakKodeverk(alleFpSakKodeverk)
    .medFpTilbakeKodeverk(alleFpTilbakeKodeverk);

  const gaaTilSokeside = useCallback(() => pushLocation('/'), [pushLocation]);

  const { startRequest: lagNyBehandlingFpSak } = useRestApiRunner<boolean>(FpsakApiKeys.NEW_BEHANDLING_FPSAK);
  const { startRequest: lagNyBehandlingFpTilbake } = useRestApiRunner<boolean>(FpsakApiKeys.NEW_BEHANDLING_FPTILBAKE);
  const lagNyBehandling = useCallback((isTilbakekreving, params) => {
    const lagNy = isTilbakekreving ? lagNyBehandlingFpTilbake : lagNyBehandlingFpSak;
    lagNy(params).then(() => oppfriskBehandlinger());
  }, []);

  const uuidForSistLukkede = useMemo(() => getUuidForSisteLukkedeForsteEllerRevurd(alleBehandlinger), [alleBehandlinger]);
  const previewHenleggBehandling = useVisForhandsvisningAvMelding();

  if ((!rettigheter.settBehandlingPaVentAccess.employeeHasAccess
    && !rettigheter.henleggBehandlingAccess.employeeHasAccess
    && !rettigheter.byttBehandlendeEnhetAccess.employeeHasAccess
    && !rettigheter.opprettRevurderingAccess.employeeHasAccess
    && !rettigheter.opprettNyForstegangsBehandlingAccess.employeeHasAccess
    && !rettigheter.gjenopptaBehandlingAccess.employeeHasAccess) || navAnsatt.kanVeilede) {
    return null;
  }

  const kanHenlegge = behandling ? behandling.kanHenleggeBehandling : false;
  const erKoet = behandling ? behandling.behandlingKoet : false;
  const erPaVent = behandling ? behandling.behandlingPaaVent : false;

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
        new MenyData(skalViseHenleggIMeny(behandlingId, behandling?.type, kanHenlegge, rettigheter.henleggBehandlingAccess), getHenleggMenytekst())
          .medModal((lukkModal) => (
            <MenyHenleggIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              forhandsvisHenleggBehandling={previewHenleggBehandling}
              henleggBehandling={shelveBehandling}
              ytelseType={fagsak.sakstype}
              behandlingType={behandling?.type}
              behandlingUuid={behandling?.uuid}
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
              behandlingType={behandling?.ype}
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
              tilbakekrevingRevurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(BehandlingType
                .TILBAKEKREVING_REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
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

export default BehandlingMenuIndex;
