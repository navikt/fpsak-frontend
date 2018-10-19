import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';

import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import {
  getBehandlingIsOnHold,
  getBehandlingIsQueued,
  getSelectedBehandlingIdentifier,
  getBehandlingVersjon,
  getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn,
  getBehandlingHasSoknad,
  getBehandlingIsInnsyn,
} from 'behandling/behandlingSelectors';
import { getRestApiData } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import { getNavAnsatt, getRettigheter } from 'navAnsatt/duck';

import {
  previewHenleggBehandling, nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewForstegangsbehandling,
  setBehandlingOnHold, openBehandlingForChanges, resetBehandlingMenuData,
} from './duck';
import BehandlingMenu from './components/BehandlingMenu';

class BehandlingMenuIndex extends Component {
  componentWillUnmount() {
    const { resetBehandlingMenuData: resetMenuData } = this.props;
    resetMenuData();
  }

  render() {
    return (<BehandlingMenu {...this.props} />);
  }
}

BehandlingMenuIndex.propTypes = {
  resetBehandlingMenuData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    henleggBehandlingAccess,
    settBehandlingPaVentAccess,
    byttBehandlendeEnhetAccess,
    opprettRevurderingAccess,
    opprettNyForstegangsBehandlingAccess,
    gjenopptaBehandlingAccess,
    opneBehandlingForEndringerAccess,
    ikkeVisOpprettNyBehandling,
  } = getRettigheter(state);
  return {
    saksnummer: getSelectedSaksnummer(state),
    behandlingIdentifier: getSelectedBehandlingIdentifier(state),
    selectedBehandlingVersjon: getBehandlingVersjon(state),
    behandlingPaaVent: getBehandlingIsOnHold(state),
    behandlingKoet: getBehandlingIsQueued(state),
    behandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
    behandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
    behandlendeEnheter: getRestApiData(FpsakApi.BEHANDLENDE_ENHETER)(state),
    navAnsatt: getNavAnsatt(state),
    hasSoknad: getBehandlingHasSoknad(state),
    isInnsynsbehandling: getBehandlingIsInnsyn(state),
    henleggBehandlingAccess,
    settBehandlingPaVentAccess,
    byttBehandlendeEnhetAccess,
    opprettRevurderingAccess,
    opprettNyForstegangsBehandlingAccess,
    gjenopptaBehandlingAccess,
    opneBehandlingForEndringerAccess,
    ikkeVisOpprettNyBehandling,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  previewHenleggBehandling,
  resumeBehandling,
  shelveBehandling,
  nyBehandlendeEnhet,
  createNewForstegangsbehandling,
  setBehandlingOnHold,
  openBehandlingForChanges,
  resetBehandlingMenuData,
  push: routerActions.push,
}, dispatch);

// Ignore own props and children
const mergeProps = (stateProps, dispatchProps) => ({ ...stateProps, ...dispatchProps });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingMenuIndex);
