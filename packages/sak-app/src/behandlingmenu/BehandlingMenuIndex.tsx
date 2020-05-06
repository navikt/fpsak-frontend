import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { RouteProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
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
  getSelectedSaksnummer, getFagsakYtelseType, getSkalBehandlesAvInfotrygd, getKanRevurderingOpprettes, getSelectedFagsakStatus,
} from '../fagsak/fagsakSelectors';
import {
  previewMessage, erBehandlingPaVent, getBehandlingVersjon, erBehandlingKoet, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getBehandlingType, getSelectedBehandlingId,
  getBehandlingStatus, getBehandlingErPapirsoknad, getKanHenleggeBehandling,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import BehandlingIdentifier from '../behandling/BehandlingIdentifier';
import { getNavAnsatt, getEnabledApplicationContexts } from '../app/duck';
import DataFetcher, { DataFetcherTriggers } from '../app/DataFetcher';
import { getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk } from '../kodeverk/duck';
import ApplicationContextPath from '../behandling/ApplicationContextPath';
import { allMenuAccessRights } from './accessMenu';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling, setBehandlingOnHold, openBehandlingForChanges,
  hentVergeMenyvalg, resetVergeMenyvalg, fjernVerge, opprettVerge, sjekkOmTilbakekrevingKanOpprettes, sjekkOmTilbakekrevingRevurderingKanOpprettes,
} from './duck';
import MenyKodeverk from './MenyKodeverk';
import MenyBehandlingData from './MenyBehandlingData';
import MenyRettigheter from './MenyRettigheter';

const YTELSE_BEHANDLINGTYPER = [BehandlingType.FORSTEGANGSSOKNAD, BehandlingType.REVURDERING];
const menyDataBehandlingValgt = [fpsakApi.MENYHANDLING_RETTIGHETER];
const menyData = [];

const VERGE_MENYVALG = {
  FJERN: 'FJERN',
  OPPRETT: 'OPPRETT',
};

interface MenyRettigheterProps {
  navAnsatt: NavAnsatt;
  fagsakStatus: Kodeverk;
  kanRevurderingOpprettes: boolean;
  skalBehandlesAvInfotrygd: boolean;
  ytelseType: Kodeverk;
  behandlingStatus: Kodeverk;
  harSoknad: boolean;
  erIInnhentSoknadopplysningerSteg: boolean;
  behandlingType: Kodeverk;
}

// TODO (TOR) Flytt rettigheter til server
const getMenyRettigheter = createSelector([
  (ownProps: MenyRettigheterProps) => ownProps.navAnsatt,
  (ownProps) => ownProps.fagsakStatus,
  (ownProps) => ownProps.kanRevurderingOpprettes,
  (ownProps) => ownProps.skalBehandlesAvInfotrygd,
  (ownProps) => ownProps.ytelseType,
  (ownProps) => ownProps.behandlingStatus,
  (ownProps) => ownProps.harSoknad,
  (ownProps) => ownProps.erIInnhentSoknadopplysningerSteg,
  (ownProps) => ownProps.behandlingType,
], (navAnsatt, fagsakStatus, kanRevurderingOpprettes, skalBehandlesAvInfotrygd, sakstype, behandlingStatus, harSoknad,
  erIInnhentSoknadopplysningerSteg, behandlingType) => new MenyRettigheter(allMenuAccessRights(navAnsatt, fagsakStatus,
  kanRevurderingOpprettes, skalBehandlesAvInfotrygd,
  sakstype, behandlingStatus, harSoknad, erIInnhentSoknadopplysningerSteg, behandlingType)));

interface OwnProps {
  saksnummer: number;
  behandlingId?: number;
  behandlingData?: MenyBehandlingData;
  hentVergeMenyvalg: (params: { behandlingId: number; saksnummer: string }) => void;
  resetVergeMenyvalg: () => void;
  navAnsatt: NavAnsatt;
  fagsakStatus: Kodeverk;
  kanRevurderingOpprettes: boolean;
  skalBehandlesAvInfotrygd: boolean;
  ytelseType: Kodeverk;
  behandlingStatus?: Kodeverk;
  erIInnhentSoknadopplysningerSteg: boolean;
  vergeMenyvalg?: string;
  location: RouteProps['location'];
  pushLocation: (location: string) => void;
}

class BehandlingMenuIndex extends Component<OwnProps> {
  static defaultProps = {
    behandlingData: MenyBehandlingData.lagIngenValgtBehandling(),
  }

  componentDidMount = () => {
    const {
      saksnummer,
      behandlingData,
      hentVergeMenyvalg: hentMenyvalg,
    } = this.props;

    if (behandlingData.harValgtBehandling && YTELSE_BEHANDLINGTYPER.includes(behandlingData.type.kode)) {
      const params = new BehandlingIdentifier(saksnummer, behandlingData.id).toJson();
      hentMenyvalg(params);
    }
  }

  componentWillUnmount = () => {
    const {
      resetVergeMenyvalg: resetMenyvalg,
    } = this.props;
    resetMenyvalg();
  }

  componentDidUpdate = (prevProps) => {
    const {
      saksnummer, behandlingData, behandlingId, hentVergeMenyvalg: hentMenyvalg,
    } = this.props;

    if (behandlingData.harValgtBehandling) {
      const erBehandlingEndret = behandlingId !== prevProps.behandlingId || behandlingData.versjon !== prevProps.behandlingData.versjon;
      const erYtelseBehandlingstype = YTELSE_BEHANDLINGTYPER.includes(behandlingData.type.kode);
      if (erBehandlingEndret && erYtelseBehandlingstype) {
        const params = new BehandlingIdentifier(saksnummer, behandlingData.id).toJson();
        hentMenyvalg(params);
      }
    }
  }

  goToSearchPage = () => {
    const { pushLocation } = this.props;
    pushLocation('/');
  }

  render() {
    const {
      behandlingData,
      navAnsatt,
      fagsakStatus,
      kanRevurderingOpprettes,
      skalBehandlesAvInfotrygd,
      ytelseType,
      behandlingStatus,
      erIInnhentSoknadopplysningerSteg,
      vergeMenyvalg,
      location,
      behandlendeEnheter,
      saksnummer,
      menyKodeverk,
      previewHenleggBehandling,
      lagNyBehandling,
      kanTilbakekrevingOpprettes,
      uuidForSistLukkede,
      erTilbakekrevingAktivert,
      sjekkTilbakeKanOpprettes,
      sjekkTilbakeRevurdKanOpprettes,
      pushLocation,
    } = this.props;

    const fjernVergeFn = vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.FJERN ? fjernVerge(location) : undefined;
    const opprettVergeFn = vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.OPPRETT ? opprettVerge(location) : undefined;

    return (
      <DataFetcher
        key={behandlingData.harValgtBehandling ? 0 : 1}
        endpoints={behandlingData.harValgtBehandling ? menyDataBehandlingValgt : menyData}
        fetchingTriggers={new DataFetcherTriggers({ behandlingId: behandlingData.id, behandlingVersion: behandlingData.versjon }, false)}
        showOldDataWhenRefetching
        render={(dataProps: { menyhandlingRettigheter?: { harSoknad: boolean }}) => {
          const rettigheter = getMenyRettigheter({
            navAnsatt,
            fagsakStatus,
            kanRevurderingOpprettes,
            skalBehandlesAvInfotrygd,
            ytelseType,
            behandlingStatus,
            erIInnhentSoknadopplysningerSteg,
            harSoknad: dataProps.menyhandlingRettigheter ? dataProps.menyhandlingRettigheter.harSoknad : false,
            behandlingType: behandlingData.harValgtBehandling ? behandlingData.type : undefined,
          });
          const skalViseEndreBehandlendeEnhet = skalViseIMeny(behandlingData.id,
            behandlendeEnheter, behandlingData.erKoet, rettigheter.byttBehandlendeEnhetAccess);
          const skalViseTaAvVent = skalViseTaAvVentIMeny(behandlingData.id, behandlingData.erPaVent, behandlingData.erKoet,
            rettigheter.gjenopptaBehandlingAccess);
          const skalViseSettPaVent = skalViseSettPaVentIMeny(behandlingData.id,
            behandlingData.erPaVent, behandlingData.erKoet, rettigheter.settBehandlingPaVentAccess);
          const skalViseHenlegg = skalViseHenleggIMeny(behandlingData.id, behandlingData.type, behandlingData.kanHenlegge,
            rettigheter.henleggBehandlingAccess);
          const skalViseApneForEndringer = skalViseApneForEndringerIMeny(behandlingData.id, behandlingData.erPaVent, behandlingData.erKoet,
            rettigheter.opneBehandlingForEndringerAccess);
          const skalViseNyBehandling = skalViseNyBehandlingIMeny(behandlingData.erKoet, rettigheter.ikkeVisOpprettNyBehandling);

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
                new MenyData(skalViseTaAvVent, getTaAvVentMenytekst())
                  .medModal((lukkModal) => (
                    <MenyTaAvVentIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      resumeBehandling={resumeBehandling}
                      lukkModal={lukkModal}
                    />
                  )),
                new MenyData(skalViseSettPaVent, getSettPaVentMenytekst())
                  .medModal((lukkModal) => (
                    <MenySettPaVentIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      setBehandlingOnHold={setBehandlingOnHold}
                      ventearsaker={menyKodeverk.getKodeverkForValgtBehandling(kodeverkTyper.VENT_AARSAK)}
                      lukkModal={lukkModal}
                    />
                  )),
                new MenyData(skalViseHenlegg, getHenleggMenytekst())
                  .medModal((lukkModal) => (
                    <MenyHenleggIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      previewHenleggBehandling={previewHenleggBehandling}
                      henleggBehandling={shelveBehandling}
                      ytelseType={ytelseType}
                      behandlingType={behandlingData.type}
                      behandlingUuid={behandlingData.uuid}
                      menyKodeverk={menyKodeverk}
                      lukkModal={lukkModal}
                      gaaTilSokeside={this.goToSearchPage}
                    />
                  )),
                new MenyData(skalViseEndreBehandlendeEnhet, getMenytekst())
                  .medModal((lukkModal) => (
                    <EndreBehandlendeEnhetIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      behandlendeEnhetId={behandlingData.behandlendeEnhetId}
                      behandlendeEnhetNavn={behandlingData.behandlendeEnhetNavn}
                      nyBehandlendeEnhet={nyBehandlendeEnhet}
                      behandlendeEnheter={behandlendeEnheter}
                      lukkModal={lukkModal}
                    />
                  )),
                new MenyData(skalViseApneForEndringer, getApneForEndringerMenytekst())
                  .medModal((lukkModal) => (
                    <MenyApneForEndringerIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      openBehandlingForChanges={openBehandlingForChanges}
                      lukkModal={lukkModal}
                    />
                  )),
                new MenyData(skalViseNyBehandling, getNyBehandlingMenytekst())
                  .medModal((lukkModal) => (
                    <MenyNyBehandlingIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      behandlingType={behandlingData.type}
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
                new MenyData(opprettVergeFn || fjernVergeFn, getVergeMenytekst(!!opprettVergeFn))
                  .medModal((lukkModal) => (
                    <MenyVergeIndex
                      behandlingId={behandlingData.id}
                      behandlingVersjon={behandlingData.versjon}
                      fjernVerge={fjernVergeFn}
                      opprettVerge={opprettVergeFn}
                      push={pushLocation}
                      saksnummer={saksnummer}
                      lukkModal={lukkModal}
                    />
                  )),
              ]}
            />
          );
        }}
      />
    );
  }
}

const getMenyKodeverk = createSelector([getBehandlingType, getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk],
  (behandlingType, alleFpSakKodeverk, alleFpTilbakeKodeverk) => new MenyKodeverk(behandlingType)
    .medFpSakKodeverk(alleFpSakKodeverk)
    .medFpTilbakeKodeverk(alleFpTilbakeKodeverk));

const getMenyBehandlingData = createSelector([getSelectedBehandlingId, getBehandlingerUuidsMappedById, getBehandlingVersjon, getBehandlingType,
  erBehandlingPaVent, erBehandlingKoet, getBehandlingBehandlendeEnhetId, getBehandlingBehandlendeEnhetNavn,
  getBehandlingErPapirsoknad, getKanHenleggeBehandling],
(behandlingId, uuidsMappedById, versjon, type, isOnHold, isQueued, enhetId, enhetNavn, erPapirsoknad, kanHenleggeBehandling) => (versjon
  ? new MenyBehandlingData(behandlingId, uuidsMappedById[behandlingId], versjon, type, isOnHold, isQueued,
    enhetId, enhetNavn, erPapirsoknad, kanHenleggeBehandling)
  : undefined));

const getTilbakekrevingOpprettes = createSelector([
  (state) => fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.getRestApiData()(state),
  (state) => fpsakApi.KAN_TILBAKEKREVING_REVURDERING_OPPRETTES.getRestApiData()(state),
], (kanBehandlingOpprettes = false, kanRevurderingOpprettes = false) => ({
  kanBehandlingOpprettes,
  kanRevurderingOpprettes,
}));


const mapStateToProps = (state) => {
  const vergeMenyvalg = fpsakApi.VERGE_MENYVALG.getRestApiData()(state);
  const behandlingData = getMenyBehandlingData(state);
  return {
    behandlingData,
    saksnummer: getSelectedSaksnummer(state),
    behandlingId: getSelectedBehandlingId(state),
    ytelseType: getFagsakYtelseType(state),
    behandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.getRestApiData()(state),
    navAnsatt: getNavAnsatt(state),
    vergeMenyvalg: vergeMenyvalg && behandlingData
      && YTELSE_BEHANDLINGTYPER.includes(behandlingData.type.kode) ? vergeMenyvalg.vergeBehandlingsmeny : undefined,
    kanTilbakekrevingOpprettes: getTilbakekrevingOpprettes(state),
    erTilbakekrevingAktivert: getEnabledApplicationContexts(state).includes(ApplicationContextPath.FPTILBAKE),
    uuidForSistLukkede: getUuidForSisteLukkedeForsteEllerRevurd(state),
    menyKodeverk: getMenyKodeverk(state),
    fagsakStatus: getSelectedFagsakStatus(state),
    behandlingStatus: getBehandlingStatus(state),
    kanRevurderingOpprettes: getKanRevurderingOpprettes(state),
    skalBehandlesAvInfotrygd: getSkalBehandlesAvInfotrygd(state),
    erIInnhentSoknadopplysningerSteg: getBehandlingErPapirsoknad(state),
  };
};

const mapDispatchToProps = (dispatch, { location }) => bindActionCreators({
  previewHenleggBehandling: previewMessage,
  lagNyBehandling: createNewBehandling(location),
  hentVergeMenyvalg,
  resetVergeMenyvalg,
  sjekkTilbakeKanOpprettes: sjekkOmTilbakekrevingKanOpprettes,
  sjekkTilbakeRevurdKanOpprettes: sjekkOmTilbakekrevingRevurderingKanOpprettes,
  pushLocation: push,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex));
