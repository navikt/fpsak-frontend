import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { getSelectedSaksnummer } from 'fagsak/fagsakSelectors';
import {
  previewMessage,
  getBehandlingIsOnHold,
  getBehandlingVersjon,
  getBehandlingIsQueued,
  getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn,
  getBehandlingIdentifier,
  getBehandlingType,
  getRettigheter,
} from 'behandling/duck';
import fpsakApi from 'data/fpsakApi';
import { getNavAnsatt } from 'app/duck';
import {
  nyBehandlendeEnhet, resumeBehandling, shelveBehandling, createNewBehandling,
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
    behandlingIdentifier: getBehandlingIdentifier(state),
    selectedBehandlingVersjon: getBehandlingVersjon(state),
    behandlingPaaVent: getBehandlingIsOnHold(state),
    behandlingKoet: getBehandlingIsQueued(state),
    behandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
    behandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
    behandlendeEnheter: fpsakApi.BEHANDLENDE_ENHETER.getRestApiData()(state),
    navAnsatt: getNavAnsatt(state),
    isInnsynsbehandling: getBehandlingType(state) === behandlingType.DOKUMENTINNSYN,
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  previewHenleggBehandling: previewMessage,
  resumeBehandling,
  shelveBehandling,
  nyBehandlendeEnhet,
  createNewBehandling,
  setBehandlingOnHold,
  openBehandlingForChanges,
  resetBehandlingMenuData,
  push,
}, dispatch);

// Ignore own props and children
const mergeProps = (stateProps, dispatchProps) => ({ ...stateProps, ...dispatchProps });

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingMenuIndex);
