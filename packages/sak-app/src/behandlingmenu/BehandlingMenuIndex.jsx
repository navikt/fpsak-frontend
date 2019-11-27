import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { DataFetcher, BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import MenySakIndex, { MenyKodeverk, MenyBehandlingData, MenyRettigheter } from '@fpsak-frontend/sak-meny';

import { getBehandlingerUuidsMappedById, getUuidForSisteLukkedeForsteEllerRevurd } from '../behandling/selectors/behandlingerSelectors';
import {
  getSelectedSaksnummer, getFagsakYtelseType, getSkalBehandlesAvInfotrygd, getKanRevurderingOpprettes, getSelectedFagsakStatus,
} from '../fagsak/fagsakSelectors';
import {
  previewMessage, erBehandlingPaVent, getBehandlingVersjon, erBehandlingKoet, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getBehandlingType, getSelectedBehandlingId,
  getBehandlingStatus, getBehandlingErPapirsoknad,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getNavAnsatt, getEnabledApplicationContexts } from '../app/duck';
import { getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk } from '../kodeverk/duck';
import ApplicationContextPath from '../behandling/ApplicationContextPath';
import { allMenuAccessRights } from './accessMenu';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling, setBehandlingOnHold, openBehandlingForChanges,
  resetBehandlingMenuData, hentVergeMenyvalg, fjernVerge, opprettVerge, sjekkOmTilbakekrevingKanOpprettes, sjekkOmTilbakekrevingRevurderingKanOpprettes,
} from './duck';

const YTELSE_BEHANDLINGTYPER = [BehandlingType.FORSTEGANGSSOKNAD, BehandlingType.REVURDERING];
const menyDataBehandlingValgt = [fpsakApi.MENYHANDLING_RETTIGHETER];
const menyData = [];

// TODO (TOR) Flytt rettigheter til server
const getMenyRettigheter = createSelector([
  (ownProps) => ownProps.navAnsatt,
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

class BehandlingMenuIndex extends Component {
  componentDidUpdate = (prevProps) => {
    const {
      saksnummer, behandlingData, hentVergeMenyvalg: hentMenyvalg,
    } = this.props;

    if (behandlingData.harValgtBehandling) {
      const erBehandlingEndret = behandlingData.id !== prevProps.behandlingData.id || behandlingData.versjon !== prevProps.behandlingData.versjon;
      const erYtelseBehandlingstype = YTELSE_BEHANDLINGTYPER.includes(behandlingData.type.kode);
      if (erBehandlingEndret && erYtelseBehandlingstype) {
        const params = new BehandlingIdentifier(saksnummer, behandlingData.id).toJson();
        hentMenyvalg(params);
      }
    }
  }

  componentWillUnmount() {
    const { resetBehandlingMenuData: resetMenuData } = this.props;
    resetMenuData();
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
    } = this.props;

    return (
      <DataFetcher
        behandlingId={behandlingData.id}
        behandlingVersjon={behandlingData.versjon}
        behandlingNotRequired
        showComponentDuringFetch
        endpoints={behandlingData.harValgtBehandling ? menyDataBehandlingValgt : menyData}
        render={(dataProps) => (
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
            {...this.props}
          />
        )}
      />
    );
  }
}

BehandlingMenuIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  resetBehandlingMenuData: PropTypes.func.isRequired,
  behandlingData: PropTypes.instanceOf(MenyBehandlingData),
  hentVergeMenyvalg: PropTypes.func,
  navAnsatt: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  kanRevurderingOpprettes: PropTypes.bool.isRequired,
  skalBehandlesAvInfotrygd: PropTypes.bool.isRequired,
  ytelseType: PropTypes.shape().isRequired,
  behandlingStatus: PropTypes.shape(),
  erIInnhentSoknadopplysningerSteg: PropTypes.bool.isRequired,
};

BehandlingMenuIndex.defaultProps = {
  behandlingData: MenyBehandlingData.lagIngenValgtBehandling(),
  hentVergeMenyvalg: undefined,
  behandlingStatus: undefined,
};

const getMenyKodeverk = createSelector([getBehandlingType, getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk],
  (behandlingType, alleFpSakKodeverk, alleFpTilbakeKodeverk) => new MenyKodeverk(behandlingType)
    .medFpSakKodeverk(alleFpSakKodeverk)
    .medFpTilbakeKodeverk(alleFpTilbakeKodeverk));
const getMenyBehandlingData = createSelector([getSelectedBehandlingId, getBehandlingerUuidsMappedById, getBehandlingVersjon, getBehandlingType,
  erBehandlingPaVent, erBehandlingKoet, getBehandlingBehandlendeEnhetId, getBehandlingBehandlendeEnhetNavn],
(behandlingId, uuidsMappedById, versjon, type, isOnHold, isQueued, enhetId, enhetNavn) => (versjon
  ? new MenyBehandlingData(behandlingId, uuidsMappedById[behandlingId], versjon, type, isOnHold, isQueued, enhetId, enhetNavn)
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
  return {
    saksnummer: getSelectedSaksnummer(state),
    behandlingData: getMenyBehandlingData(state),
    ytelseType: getFagsakYtelseType(state),
    behandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.getRestApiData()(state),
    navAnsatt: getNavAnsatt(state),
    vergeMenyvalg: vergeMenyvalg ? vergeMenyvalg.vergeBehandlingsmeny : undefined,
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  previewHenleggBehandling: previewMessage,
  resumeBehandling,
  shelveBehandling,
  nyBehandlendeEnhet,
  createNewBehandling,
  setBehandlingOnHold,
  openBehandlingForChanges,
  resetBehandlingMenuData,
  hentVergeMenyvalg,
  fjernVerge,
  opprettVerge,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  push,
}, dispatch);


const VERGE_MENYVALG = {
  FJERN: 'FJERN',
  OPPRETT: 'OPPRETT',
};

// Ignore own props and children
const mergeProps = (stateProps, dispatchProps) => {
  const { vergeMenyvalg } = stateProps;
  const modifiserteDispatchProps = {
    ...dispatchProps,
    fjernVerge: vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.FJERN ? dispatchProps.fjernVerge : undefined,
    opprettVerge: vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.OPPRETT ? dispatchProps.opprettVerge : undefined,
  };

  return {
    ...stateProps,
    ...modifiserteDispatchProps,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingMenuIndex);
