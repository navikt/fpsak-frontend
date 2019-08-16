import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingGrid, withBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import FpSakBehandlingInfoSetter from './FpSakBehandlingInfoSetter';
import BehandlingsprosessForstegangOgRevContainer from './behandlingsprosess/BehandlingsprosessForstegangOgRevContainer';
import FaktaContainer from './fakta/FaktaContainer';
import {
  setHasShownBehandlingPaVent, setBehandlingInfo, updateOnHold, getBehandlingIdentifier,
  getHasShownBehandlingPaVent, resetBehandlingFpsakContext, getKodeverk, fetchBehandling as fetchBehandlingActionCreator,
} from './duckBehandlingForstegangOgRev';
import FpSakBehandlingUpdater from './FpSakBehandlingUpdater';

/**
 * BehandlingForstegangOgRevurderingIndex
 *
 * Bruker HOC withBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingForstegangOgRevurderingIndex = ({
  setBehandlingInfoHolder,
}) => (
  <>
    <FpSakBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessForstegangOgRevContainer />}
      faktaContent={<FaktaContainer />}
    />
  </>
);

BehandlingForstegangOgRevurderingIndex.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
};

// Definerer mapStateToPropsFactory og mapDispatchToProps her og send inn til HOC (Bruker førstegang-og-rev-spesifikke selectors og funksjoner)
const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    featureToggles: ownProps.featureToggles,
    kodeverk: ownProps.kodeverk,
    fagsak: ownProps.fagsak,
  };
  return state => ({
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

const mapDispatchToProps = dispatch => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  setBehandlingInfo,
  resetBehandlingFpsakContext,
  destroyReduxForms: destroy,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default withBehandlingIndex(mapStateToPropsFactory, mapDispatchToProps, FpSakBehandlingUpdater)(BehandlingForstegangOgRevurderingIndex);
