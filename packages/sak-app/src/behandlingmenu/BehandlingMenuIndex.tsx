import React, { FunctionComponent, useCallback } from 'react';
import { createSelector } from 'reselect';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import { Kodeverk, NavAnsatt } from '@fpsak-frontend/types';
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
}
  from '@fpsak-frontend/sak-meny-ny-behandling';

import { getBehandlingerUuidsMappedById, getUuidForSisteLukkedeForsteEllerRevurd } from '../behandling/selectors/behandlingerSelectors';
import {
  getSkalBehandlesAvInfotrygd, getKanRevurderingOpprettes, getSelectedFagsakStatus, getFagsakYtelseType,
} from '../fagsak/fagsakSelectors';
import {
  previewMessage, erBehandlingPaVent, erBehandlingKoet, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getBehandlingType,
  getBehandlingStatus, getBehandlingErPapirsoknad, getKanHenleggeBehandling,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getNavAnsatt, getEnabledApplicationContexts } from '../app/duck';
import { getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk } from '../kodeverk/duck';
import ApplicationContextPath from '../behandling/ApplicationContextPath';
import { allMenuAccessRights } from './accessMenu';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling, setBehandlingOnHold, openBehandlingForChanges,
  sjekkOmTilbakekrevingKanOpprettes, sjekkOmTilbakekrevingRevurderingKanOpprettes,
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

interface OwnProps {
  saksnummer: number;
  behandlingId?: number;
  behandlingVersion?: number;
  behandlingType: Kodeverk;
  ytelseType: Kodeverk;
  fjernVerge: () => void;
  opprettVerge: () => void;
  erTilbakekrevingAktivert: boolean;
  pushLocation: (location: string) => void;
}

interface StateProps {
  behandlendeEnheter: {
    enhetId: string;
    enhetNavn: string;
  }[];
  kanVeilede: boolean;
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  erTilbakekrevingAktivert: boolean;
  uuid?: string;
  uuidForSistLukkede?: string;
  menyKodeverk: MenyKodeverk;
  erKoet: boolean;
  erPaVent: boolean;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  kanHenlegge: boolean;
  rettigheter: Rettigheter;
}

interface DispatchProps {
  previewHenleggBehandling: (erTilbakekreving: boolean, erHenleggelse: boolean, data: {}) => void;
  lagNyBehandling: (saksnummer: string, behandlingId: number, behandlingVersion: number, isTilbakekreving: boolean, params: {}) => void;
  sjekkTilbakeKanOpprettes: (params: {
    saksnummer: number;
    uuid: string;
  }) => void;
  sjekkTilbakeRevurdKanOpprettes: (params: {
    behandlingId: number;
  }) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

export const BehandlingMenuIndex: FunctionComponent<Props> = ({
  saksnummer,
  behandlingId,
  behandlingVersion,
  uuid,
  erKoet,
  erPaVent,
  behandlingType,
  kanHenlegge,
  kanVeilede,
  ytelseType,
  fjernVerge,
  opprettVerge,
  behandlendeEnheter,
  behandlendeEnhetId,
  behandlendeEnhetNavn,
  menyKodeverk,
  previewHenleggBehandling,
  lagNyBehandling,
  kanTilbakekrevingOpprettes,
  uuidForSistLukkede,
  erTilbakekrevingAktivert,
  sjekkTilbakeKanOpprettes,
  sjekkTilbakeRevurdKanOpprettes,
  pushLocation,
  rettigheter,
}) => {
  if ((!rettigheter.settBehandlingPaVentAccess.employeeHasAccess
    && !rettigheter.henleggBehandlingAccess.employeeHasAccess
    && !rettigheter.byttBehandlendeEnhetAccess.employeeHasAccess
    && !rettigheter.opprettRevurderingAccess.employeeHasAccess
    && !rettigheter.opprettNyForstegangsBehandlingAccess.employeeHasAccess
    && !rettigheter.gjenopptaBehandlingAccess.employeeHasAccess) || kanVeilede) {
    return null;
  }

  const gaaTilSokeside = useCallback(() => pushLocation('/'), [pushLocation]);

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
              ytelseType={ytelseType}
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
              kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
              erTilbakekrevingAktivert={erTilbakekrevingAktivert}
              behandlingstyper={menyKodeverk
                .getKodeverkForBehandlingstyper(BEHANDLINGSTYPER_SOM_SKAL_KUNNE_OPPRETTES, kodeverkTyper.BEHANDLING_TYPE)}
              tilbakekrevingRevurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(bType.TILBAKEKREVING_REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
              revurderingArsaker={menyKodeverk.getKodeverkForBehandlingstype(bType.REVURDERING, kodeverkTyper.BEHANDLING_AARSAK)}
              ytelseType={ytelseType}
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

const getMenyKodeverk = createSelector([getBehandlingType, getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk],
  (behandlingType, alleFpSakKodeverk, alleFpTilbakeKodeverk) => new MenyKodeverk(behandlingType)
    .medFpSakKodeverk(alleFpSakKodeverk)
    .medFpTilbakeKodeverk(alleFpTilbakeKodeverk));

const getTilbakekrevingOpprettes = createSelector([
  (state) => fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.getRestApiData()(state),
  (state) => fpsakApi.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES.getRestApiData()(state),
], (kanBehandlingOpprettes = false, kanRevurderingOpprettes = false) => ({
  kanBehandlingOpprettes,
  kanRevurderingOpprettes,
}));

// TODO (TOR) Flytt rettigheter til server
const getMenyRettigheter = createSelector([
  getNavAnsatt,
  getSelectedFagsakStatus,
  getKanRevurderingOpprettes,
  getSkalBehandlesAvInfotrygd,
  getFagsakYtelseType,
  getBehandlingStatus,
  getBehandlingErPapirsoknad,
  getBehandlingType,
  (_state, ownProps) => ownProps.menyhandlingRettigheter,
], (navAnsatt: NavAnsatt,
  fagsakStatus,
  kanRevurderingOpprettes,
  skalBehandlesAvInfotrygd,
  sakstype,
  behandlingStatus,
  erIInnhentSoknadopplysningerSteg,
  behandlingType,
  menyhandlingRettigheter) => allMenuAccessRights(navAnsatt, fagsakStatus,
  kanRevurderingOpprettes, skalBehandlesAvInfotrygd,
  sakstype, behandlingStatus, menyhandlingRettigheter ? menyhandlingRettigheter.harSoknad : false, erIInnhentSoknadopplysningerSteg, behandlingType));

const mapStateToProps = (state, ownProps): StateProps => ({
  behandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.getRestApiData()(state),
  kanVeilede: getNavAnsatt(state).kanVeilede,
  kanTilbakekrevingOpprettes: getTilbakekrevingOpprettes(state),
  erTilbakekrevingAktivert: getEnabledApplicationContexts(state).includes(ApplicationContextPath.FPTILBAKE),
  uuid: ownProps.behandlingId ? getBehandlingerUuidsMappedById(state)[ownProps.behandlingId] : undefined,
  uuidForSistLukkede: getUuidForSisteLukkedeForsteEllerRevurd(state),
  menyKodeverk: getMenyKodeverk(state),
  erKoet: erBehandlingKoet(state),
  erPaVent: erBehandlingPaVent(state),
  behandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  kanHenlegge: getKanHenleggeBehandling(state),
  rettigheter: getMenyRettigheter(state, ownProps),
});

const mapDispatchToProps = (dispatch: Dispatch, { location, pushLocation }): DispatchProps => bindActionCreators({
  previewHenleggBehandling: previewMessage,
  lagNyBehandling: createNewBehandling(location, pushLocation),
  sjekkTilbakeKanOpprettes: sjekkOmTilbakekrevingKanOpprettes,
  sjekkTilbakeRevurdKanOpprettes: sjekkOmTilbakekrevingRevurderingKanOpprettes,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex);
