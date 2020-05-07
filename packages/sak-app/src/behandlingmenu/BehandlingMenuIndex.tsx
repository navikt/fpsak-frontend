import React, { FunctionComponent, useCallback } from 'react';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyData } from '@fpsak-frontend/sak-meny';
import { Kodeverk, NavAnsatt } from '@fpsak-frontend/types';
import EndreBehandlendeEnhetIndex, { skalViseIMeny, getMenytekst } from '@fpsak-frontend/sak-meny-endre-enhet';
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
import MenyRettigheter from './MenyRettigheter';
import Rettigheter from './rettigheterTsType';

interface OwnProps {
  saksnummer: number;
  behandlingId?: number;
  behandlingVersion?: number;
  uuid?: string;
  erKoet: boolean;
  erPaVent: boolean;
  behandlingType: Kodeverk;
  kanHenlegge: boolean;
  navAnsatt: NavAnsatt;
  ytelseType: Kodeverk;
  pushLocation: (location: string) => void;
  behandlendeEnheter: {
    enhetId: string;
    enhetNavn: string;
  }[];
  fjernVerge: () => void;
  opprettVerge: () => void;
  behandlendeEnhetId: string;
  behandlendeEnhetNavn: string;
  menyKodeverk: MenyKodeverk;
  previewHenleggBehandling: () => void;
  lagNyBehandling: () => void;
  kanTilbakekrevingOpprettes: boolean;
  uuidForSistLukkede?: string;
  erTilbakekrevingAktivert: boolean;
  sjekkTilbakeKanOpprettes: (params: {
    saksnummer: number;
    uuid: string;
  }) => void;
  sjekkTilbakeRevurdKanOpprettes: (params: {
    behandlingId: number;
  }) => void;
  rettigheter: Rettigheter;
}

const BehandlingMenuIndex: FunctionComponent<OwnProps> = ({
  saksnummer,
  behandlingId,
  behandlingVersion,
  uuid,
  erKoet,
  erPaVent,
  behandlingType,
  kanHenlegge,
  navAnsatt,
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
    && !rettigheter.gjenopptaBehandlingAccess.employeeHasAccess) || navAnsatt.kanVeilede) {
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
              resumeBehandling={resumeBehandling}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(skalViseSettPaVentIMeny(behandlingId, erPaVent, erKoet, rettigheter.settBehandlingPaVentAccess), getSettPaVentMenytekst())
          .medModal((lukkModal) => (
            <MenySettPaVentIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              setBehandlingOnHold={setBehandlingOnHold}
              ventearsaker={menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.VENT_AARSAK)}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(skalViseHenleggIMeny(behandlingId, behandlingType, kanHenlegge, rettigheter.henleggBehandlingAccess), getHenleggMenytekst())
          .medModal((lukkModal) => (
            <MenyHenleggIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              previewHenleggBehandling={previewHenleggBehandling}
              henleggBehandling={shelveBehandling}
              ytelseType={ytelseType}
              behandlingType={behandlingType}
              behandlingUuid={uuid}
              menyKodeverk={menyKodeverk}
              lukkModal={lukkModal}
              gaaTilSokeside={gaaTilSokeside}
            />
          )),
        new MenyData(skalViseIMeny(behandlingId, behandlendeEnheter, erKoet, rettigheter.byttBehandlendeEnhetAccess), getMenytekst())
          .medModal((lukkModal) => (
            <EndreBehandlendeEnhetIndex
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
              openBehandlingForChanges={openBehandlingForChanges}
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
              push={pushLocation}
              menyKodeverk={menyKodeverk}
              ytelseType={ytelseType}
              lagNyBehandling={lagNyBehandling}
              sjekkOmTilbakekrevingKanOpprettes={sjekkTilbakeKanOpprettes}
              sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkTilbakeRevurdKanOpprettes}
              lukkModal={lukkModal}
            />
          )),
        new MenyData(opprettVerge || fjernVerge, getVergeMenytekst(!!opprettVerge))
          .medModal((lukkModal) => (
            <MenyVergeIndex
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersion}
              fjernVerge={fjernVerge}
              opprettVerge={opprettVerge}
              push={pushLocation}
              saksnummer={saksnummer}
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
], (navAnsatt,
  fagsakStatus,
  kanRevurderingOpprettes,
  skalBehandlesAvInfotrygd,
  sakstype,
  behandlingStatus,
  erIInnhentSoknadopplysningerSteg,
  behandlingType,
  menyhandlingRettigheter) => new MenyRettigheter(allMenuAccessRights(navAnsatt, fagsakStatus,
  kanRevurderingOpprettes, skalBehandlesAvInfotrygd,
  sakstype, behandlingStatus, menyhandlingRettigheter ? menyhandlingRettigheter.harSoknad : false, erIInnhentSoknadopplysningerSteg, behandlingType)));

const mapStateToProps = (state, ownProps) => ({
  behandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.getRestApiData()(state),
  navAnsatt: getNavAnsatt(state),
  kanTilbakekrevingOpprettes: getTilbakekrevingOpprettes(state),
  erTilbakekrevingAktivert: getEnabledApplicationContexts(state).includes(ApplicationContextPath.FPTILBAKE),
  uuid: ownProps.behandlingId ? getBehandlingerUuidsMappedById(state)[ownProps.behandlingId] : undefined,
  uuidForSistLukkede: getUuidForSisteLukkedeForsteEllerRevurd(state),
  menyKodeverk: getMenyKodeverk(state),
  erKoet: erBehandlingPaVent(state),
  erPaVent: erBehandlingKoet(state),
  behandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  kanHenlegge: getKanHenleggeBehandling(state),
  rettigheter: getMenyRettigheter(state, ownProps),
});

const mapDispatchToProps = (dispatch, { location }) => bindActionCreators({
  previewHenleggBehandling: previewMessage,
  lagNyBehandling: createNewBehandling(location),
  sjekkTilbakeKanOpprettes: sjekkOmTilbakekrevingKanOpprettes,
  sjekkTilbakeRevurdKanOpprettes: sjekkOmTilbakekrevingRevurderingKanOpprettes,
  pushLocation: push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex);
