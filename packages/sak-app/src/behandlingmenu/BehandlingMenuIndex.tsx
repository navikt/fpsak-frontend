import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
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
import { getBehandlingerUuidsMappedById, getUuidForSisteLukkedeForsteEllerRevurd } from '../behandling/selectors/behandlingerSelectors';
import {
  erBehandlingPaVent, erBehandlingKoet, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getBehandlingStatus, getBehandlingErPapirsoknad, getKanHenleggeBehandling,
} from '../behandling/duck';
import { allMenuAccessRights } from './accessMenu';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling, setBehandlingOnHold, openBehandlingForChanges,
} from './duck';
import MenyKodeverk from './MenyKodeverk';
import Rettigheter from './rettigheterTsType';

const BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES = [
  bType.FORSTEGANGSSOKNAD,
  bType.KLAGE,
  bType.REVURDERING,
  bType.DOKUMENTINNSYN,
  bType.ANKE,
  bType.TILBAKEKREVING,
  bType.TILBAKEKREVING_REVURDERING,
];

type BehandlendeEnheter = {
  enhetId: string;
  enhetNavn: string;
}[];

interface OwnProps {
  fagsak: Fagsak;
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

interface StateProps {
  uuid?: string;
  uuidForSistLukkede?: string;
  erKoet: boolean;
  erPaVent: boolean;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  kanHenlegge: boolean;
  behandlingStatus: Kodeverk;
  erPapirsoknad: boolean;
}

interface DispatchProps {
  lagNyBehandling: (saksnummer: string, behandlingId: number, behandlingVersion: number, isTilbakekreving: boolean, params: any) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

export const BehandlingMenuIndex: FunctionComponent<Props> = ({
  fagsak,
  saksnummer,
  behandlingId,
  behandlingVersion,
  uuid,
  erKoet,
  erPaVent,
  behandlingType,
  kanHenlegge,
  fjernVerge,
  opprettVerge,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  lagNyBehandling,
  uuidForSistLukkede,
  pushLocation,
  behandlingStatus,
  erPapirsoknad,
  menyhandlingRettigheter,
}) => {
  const {
    startRequest: sjekkTilbakeKanOpprettes, data: kanBehandlingOpprettes = false,
  } = useRestApiRunner<boolean>(FpsakApiKeys.KAN_TILBAKEKREVING_OPPRETTES);
  const {
    startRequest: sjekkTilbakeRevurdKanOpprettes, data: kanRevurderingOpprettes = false,
  } = useRestApiRunner<boolean>(FpsakApiKeys.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES);

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo<Rettigheter>(() => allMenuAccessRights(navAnsatt, fagsak.status, kanRevurderingOpprettes, fagsak.skalBehandlesAvInfotrygd,
    fagsak.sakstype, behandlingStatus, menyhandlingRettigheter ? menyhandlingRettigheter.harSoknad : false, erPapirsoknad, behandlingType),
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
              behandlendeEnhetId={behandlendeEnhetId}
              behandlendeEnhetNavn={behandlendeEnhetNavn}
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
              tilbakekrevingRevurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(bType.TILBAKEKREVING_REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
              revurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(bType.REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
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

const mapStateToProps = (state, ownProps): StateProps => ({
  uuid: ownProps.behandlingId ? getBehandlingerUuidsMappedById(state)[ownProps.behandlingId] : undefined,
  uuidForSistLukkede: getUuidForSisteLukkedeForsteEllerRevurd(state),
  erKoet: erBehandlingKoet(state),
  erPaVent: erBehandlingPaVent(state),
  behandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  kanHenlegge: getKanHenleggeBehandling(state),
  behandlingStatus: getBehandlingStatus(state),
  erPapirsoknad: getBehandlingErPapirsoknad(state),
});

const mapDispatchToProps = (dispatch: Dispatch, { location, pushLocation }): DispatchProps => bindActionCreators({
  lagNyBehandling: createNewBehandling(location, pushLocation),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex);
