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
  getBehandlingStatus, getBehandlingErPapirsoknad, getKanHenleggeBehandling,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getNavAnsatt, getEnabledApplicationContexts } from '../app/duck';
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
  componentDidMount = () => {
    const {
      saksnummer, behandlingData, hentVergeMenyvalg: hentMenyvalg,
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
            shelveBehandling={shelveBehandling}
            setBehandlingOnHold={setBehandlingOnHold}
            resumeBehandling={resumeBehandling}
            nyBehandlendeEnhet={nyBehandlendeEnhet}
            openBehandlingForChanges={openBehandlingForChanges}
            fjernVerge={vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.FJERN ? fjernVerge : undefined}
            opprettVerge={vergeMenyvalg && vergeMenyvalg === VERGE_MENYVALG.OPPRETT ? opprettVerge : undefined}
            {...this.props}
          />
        )}
      />
    );
  }
}

BehandlingMenuIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number,
  behandlingData: PropTypes.instanceOf(MenyBehandlingData),
  hentVergeMenyvalg: PropTypes.func,
  resetVergeMenyvalg: PropTypes.func,
  navAnsatt: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  kanRevurderingOpprettes: PropTypes.bool.isRequired,
  skalBehandlesAvInfotrygd: PropTypes.bool.isRequired,
  ytelseType: PropTypes.shape().isRequired,
  behandlingStatus: PropTypes.shape(),
  erIInnhentSoknadopplysningerSteg: PropTypes.bool.isRequired,
  vergeMenyvalg: PropTypes.string,
};

BehandlingMenuIndex.defaultProps = {
  behandlingId: undefined,
  behandlingData: MenyBehandlingData.lagIngenValgtBehandling(),
  hentVergeMenyvalg: undefined,
  resetVergeMenyvalg: undefined,
  behandlingStatus: undefined,
  vergeMenyvalg: undefined,
};

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
  return {
    saksnummer: getSelectedSaksnummer(state),
    behandlingId: getSelectedBehandlingId(state),
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
  createNewBehandling,
  hentVergeMenyvalg,
  resetVergeMenyvalg,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  push,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingMenuIndex);
