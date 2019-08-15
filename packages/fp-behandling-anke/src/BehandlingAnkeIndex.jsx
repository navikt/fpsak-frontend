import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingGrid, withBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/ankeBehandlingSelectors';
import FpAnkeBehandlingInfoSetter from './FpAnkeBehandlingInfoSetter';
import BehandlingsprosessAnkeContainer from './behandlingsprosess/BehandlingsprosessAnkeContainer';
import FaktaAnkeContainer from './fakta/FaktaAnkeContainer';
import {
  setHasShownBehandlingPaVent, setBehandlingInfo, updateOnHold, getBehandlingIdentifier,
  getHasShownBehandlingPaVent, resetBehandlingFpsakContext, getKodeverk, fetchBehandling as fetchBehandlingActionCreator,
} from './duckBehandlingAnke';
import fpAnkeBehandlingUpdater from './FpAnkeBehandlingUpdater';

/**
 * BehandlingAnkeIndex
 *
 * Bruker HOC withBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingAnkeIndex = ({
  setBehandlingInfoHolder,
}) => (
  <>
    <FpAnkeBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessAnkeContainer />}
      faktaContent={<FaktaAnkeContainer />}
    />
  </>
);

BehandlingAnkeIndex.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
};

// Definerer mapStateToProps og mapDispatchToProps her og send inn til HOC (Bruker anke-spesifikke selectors og funksjoner)
const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  fristBehandlingPaaVent: behandlingSelectors.getBehandlingOnHoldDate(state),
  behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
  venteArsakKode: behandlingSelectors.getBehandlingVenteArsakKode(state),
  hasManualPaVent: behandlingSelectors.hasBehandlingManualPaVent(state),
  hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
  ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
  isInSync: behandlingSelectors.isBehandlingInSync(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  setBehandlingInfo,
  resetBehandlingFpsakContext,
  destroyReduxForms: destroy,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default withBehandlingIndex(mapStateToProps, mapDispatchToProps, fpAnkeBehandlingUpdater)(BehandlingAnkeIndex);
