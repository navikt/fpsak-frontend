import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingGrid, withBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/innsynBehandlingSelectors';
import FpInnsynBehandlingInfoSetter from './FpInnsynBehandlingInfoSetter';
import BehandlingsprosessInnsynContainer from './behandlingsprosess/BehandlingsprosessInnsynContainer';
import FaktaInnsynContainer from './fakta/FaktaInnsynContainer';
import {
  fetchBehandling as fetchBehandlingActionCreator,
  getBehandlingIdentifier,
  getHasShownBehandlingPaVent,
  getKodeverk,
  resetBehandlingFpsakContext,
  setBehandlingInfo,
  setHasShownBehandlingPaVent,
  updateOnHold,
} from './duckBehandlingInnsyn';
import fpInnsynBehandlingUpdater from './FpInnsynBehandlingUpdater';

/**
 * BehandlingInnsynIndex
 *
 * Bruker HOC withBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingInnsynIndex = ({
  setBehandlingInfoHolder,
}) => (
  <>
    <FpInnsynBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessInnsynContainer />}
      faktaContent={<FaktaInnsynContainer />}
    />
  </>
);

BehandlingInnsynIndex.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
};

// Definerer mapStateToPropsFactory og mapDispatchToProps her og send inn til HOC (Bruker innsyn-spesifikke selectors og funksjoner)
const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    featureToggles: ownProps.featureToggles,
    kodeverk: ownProps.kodeverk,
    fagsak: ownProps.fagsak,
    allDocuments: ownProps.allDocuments,
    navAnsatt: ownProps.navAnsatt,
  };
  return (state) => ({
    behandlingIdentifier: getBehandlingIdentifier(state),
    behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
    fristBehandlingPaaVent: behandlingSelectors.getBehandlingOnHoldDate(state),
    behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
    venteArsakKode: behandlingSelectors.getBehandlingVenteArsakKode(state),
    hasManualPaVent: behandlingSelectors.hasBehandlingManualPaVent(state),
    hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
    ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
    isInSync: behandlingSelectors.isBehandlingInSync(state),
    fagsakInfo,
  });
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  setBehandlingInfo,
  resetBehandlingFpsakContext,
  destroyReduxForms: destroy,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default withBehandlingIndex(mapStateToPropsFactory, mapDispatchToProps, fpInnsynBehandlingUpdater)(BehandlingInnsynIndex);
