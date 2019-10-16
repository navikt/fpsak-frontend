import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier, featureToggle } from '@fpsak-frontend/fp-felles';
import MenySakIndex, { MenyKodeverk, MenyBehandlingData, MenyRettigheter } from '@fpsak-frontend/sak-meny';

import { getBehandlingerUuidsMappedById, getUuidForSisteLukkedeForsteEllerRevurd } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedSaksnummer, getFagsakYtelseType } from '../fagsak/fagsakSelectors';
import {
  previewMessage, getBehandlingIsOnHold, getBehandlingVersjon, getBehandlingIsQueued, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getBehandlingType, getRettigheter, getSelectedBehandlingId,
} from '../behandling/duck';
import fpsakApi from '../data/fpsakApi';
import { getNavAnsatt, getFeatureToggles } from '../app/duck';
import { getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk } from '../kodeverk/duck';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling, setBehandlingOnHold, openBehandlingForChanges,
  resetBehandlingMenuData, hentVergeMenyvalg, fjernVerge, opprettVerge, sjekkOmTilbakekrevingKanOpprettes,
} from './duck';

const YTELSE_BEHANDLINGTYPER = [BehandlingType.FORSTEGANGSSOKNAD, BehandlingType.REVURDERING];

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
    return (<MenySakIndex {...this.props} />);
  }
}

BehandlingMenuIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  resetBehandlingMenuData: PropTypes.func.isRequired,
  behandlingData: PropTypes.instanceOf(MenyBehandlingData),
  hentVergeMenyvalg: PropTypes.func,
};

BehandlingMenuIndex.defaultProps = {
  behandlingData: MenyBehandlingData.lagIngenValgtBehandling(),
  hentVergeMenyvalg: undefined,
};

const getMenyRettigheter = createSelector([getRettigheter], (rettigheter) => new MenyRettigheter(rettigheter));
const getMenyKodeverk = createSelector([getBehandlingType, getAlleFpSakKodeverk, getAlleFpTilbakeKodeverk],
  (behandlingType, alleFpSakKodeverk, alleFpTilbakeKodeverk) => new MenyKodeverk(behandlingType)
    .medFpSakKodeverk(alleFpSakKodeverk)
    .medFpTilbakeKodeverk(alleFpTilbakeKodeverk));
const getMenyBehandlingData = createSelector([getSelectedBehandlingId, getBehandlingerUuidsMappedById, getBehandlingVersjon, getBehandlingType,
  getBehandlingIsOnHold, getBehandlingIsQueued, getBehandlingBehandlendeEnhetId, getBehandlingBehandlendeEnhetNavn],
(behandlingId, uuidsMappedById, versjon, type, isOnHold, isQueued, enhetId, enhetNavn) => (versjon
  ? new MenyBehandlingData(behandlingId, uuidsMappedById[behandlingId], versjon, type, isOnHold, isQueued, enhetId, enhetNavn)
  : undefined));


const mapStateToProps = (state) => {
  const vergeMenyvalg = fpsakApi.VERGE_MENYVALG.getRestApiData()(state);
  return {
    saksnummer: getSelectedSaksnummer(state),
    behandlingData: getMenyBehandlingData(state),
    ytelseType: getFagsakYtelseType(state),
    behandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.getRestApiData()(state),
    navAnsatt: getNavAnsatt(state),
    vergeMenyvalg: vergeMenyvalg ? vergeMenyvalg.vergeBehandlingsmeny : undefined,
    kanTilbakekrevingOpprettes: fpsakApi.KAN_TILBAKEKREVING_OPPRETTES.getRestApiData()(state),
    erTilbakekrevingAktivert: getFeatureToggles(state)[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING],
    uuidForSistLukkede: getUuidForSisteLukkedeForsteEllerRevurd(state),
    rettigheter: getMenyRettigheter(state),
    menyKodeverk: getMenyKodeverk(state),
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
