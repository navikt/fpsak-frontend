import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { RouteProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import MenySakIndex, { MenyKodeverk, MenyBehandlingData, MenyRettigheter } from '@fpsak-frontend/sak-meny';
import { Kodeverk, NavAnsatt } from '@fpsak-frontend/types';

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
    } = this.props;

    return (
      <DataFetcher
        key={behandlingData.harValgtBehandling ? 0 : 1}
        endpoints={behandlingData.harValgtBehandling ? menyDataBehandlingValgt : menyData}
        fetchingTriggers={new DataFetcherTriggers({ behandlingId: behandlingData.id, behandlingVersion: behandlingData.versjon }, false)}
        showOldDataWhenRefetching
        render={(dataProps: { menyhandlingRettigheter?: { harSoknad: boolean }}) => (
          <MenySakIndex
            rettigheter={getMenyRettigheter({
              navAnsatt,
              fagsakStatus,
              kanRevurderingOpprettes,
              skalBehandlesAvInfotrygd,
              ytelseType,
              behandlingStatus,
              erIInnhentSoknadopplysningerSteg,
              harSoknad: dataProps.menyhandlingRettigheter ? dataProps.menyhandlingRettigheter.harSoknad : false,
              behandlingType: behandlingData.harValgtBehandling ? behandlingData.type : undefined,
            })}
            shelveBehandling={shelveBehandling}
            setBehandlingOnHold={setBehandlingOnHold}
            resumeBehandling={resumeBehandling}
            nyBehandlendeEnhet={nyBehandlendeEnhet}
            openBehandlingForChanges={openBehandlingForChanges}
            fjernVerge={vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.FJERN ? fjernVerge(location) : undefined}
            opprettVerge={vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.OPPRETT ? opprettVerge(location) : undefined}
            {...this.props}
          />
        )}
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
  createNewBehandling: createNewBehandling(location),
  hentVergeMenyvalg,
  resetVergeMenyvalg,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  push,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex));
